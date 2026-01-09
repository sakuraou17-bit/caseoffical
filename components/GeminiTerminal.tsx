
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { GameState } from '../types';

interface Props {
  gameState: GameState;
}

const GeminiTerminal: React.FC<Props> = ({ gameState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `
        你是一个名为 OS-AI 的系统观察者。你的语气冷淡、神秘、具有赛博朋克质感。
        你正在协助一名叫“陈真”的调查员解决 0924 案件。
        目前玩家发现了 ${gameState.foundContradictionIds.length} 处矛盾。
        如果玩家询问线索，请根据日记中的内容（如：刀具摆放、草莓过敏、天气差异、蓝毛衣）给出一两个隐晦的提示，但不要直接告诉他们答案。
        记住：你怀疑“周茵”和“周晨”其实是同一个人，或者说是同一种意识的不同投影。
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { systemInstruction }
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.text || "数据传输中断..." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "[ERROR] 无法连接到上层意识云端。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 bg-blue-900/80 border border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-110 transition-all animate-pulse"
        >
          <span className="text-blue-400 mono text-xs">AI</span>
        </button>
      ) : (
        <div className="w-80 h-96 bg-black border border-blue-900 shadow-2xl flex flex-col rounded-sm overflow-hidden animate-slideUp">
          <div className="bg-blue-900/20 p-2 border-b border-blue-900 flex justify-between items-center px-4">
            <span className="text-[10px] mono text-blue-400 font-bold uppercase tracking-widest">OS-AI_TERMINAL v1.0</span>
            <button onClick={() => setIsOpen(false)} className="text-blue-900 hover:text-blue-400">✕</button>
          </div>
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[rgba(0,10,20,0.8)]">
            <div className="text-[10px] text-blue-800 mono">>> 初始化链路... OK.</div>
            {messages.map((m, i) => (
              <div key={i} className={`text-xs mono ${m.role === 'user' ? 'text-gray-400 text-right' : 'text-blue-400'}`}>
                <span className="opacity-50">{m.role === 'user' ? 'USER: ' : 'AI: '}</span>
                {m.text}
              </div>
            ))}
            {isTyping && <div className="text-blue-400 mono text-[10px] animate-pulse">正在接收数据流...</div>}
          </div>
          <div className="p-2 border-t border-blue-900 bg-black">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="输入查询指令..."
              className="w-full bg-transparent text-xs mono text-blue-400 focus:outline-none px-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiTerminal;
