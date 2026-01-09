
import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const Final: React.FC<Props> = ({ gameState, setGameState }) => {
  const [phase, setPhase] = useState<'confront' | 'collapse' | 'reveal'>('confront');
  const [clickCount, setClickCount] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isWiping, setIsWiping] = useState(false);

  const truthText = "正在解析 [CHEN_ZHEN] 的访问权限... 警告：访问者与受害者、记录者与报案人为同一意识节点。你不是在寻找他，你是在删除他。或者说，你是在删除‘自己’。";

  useEffect(() => {
    if (phase === 'reveal') {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(truthText.slice(0, i));
        i++;
        if (i > truthText.length) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleReset = () => {
    setIsWiping(true);
    document.body.classList.add('terminal-collapse');
    
    // 模拟终端格式化过程
    setTimeout(() => {
      localStorage.removeItem('case0924_state');
      window.location.href = '#/';
      window.location.reload();
    }, 2500);
  };

  const handleConfrontClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 4) {
      setPhase('collapse');
      setTimeout(() => setPhase('reveal'), 2000);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-[2000ms] flex items-center justify-center p-6 ${isWiping ? 'bg-white' : (phase === 'confront' ? 'bg-[#0d1117]' : (phase === 'collapse' ? 'bg-red-900' : 'bg-black'))}`}>
      <div className={`max-w-2xl w-full transition-opacity duration-1000 ${isWiping ? 'opacity-0' : 'opacity-100'}`}>
        {phase === 'confront' && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-red-500 font-bold mono text-xs tracking-[0.4em] text-center mb-12 uppercase">最后的数据碰撞 (IDENTITY_FINAL_SYNC)</h2>
            <div className="space-y-4">
              {[
                "陈真在9月份累计执勤312小时，却没有一张任务单。",
                "系统访问审计日志显示：报案录入者正是陈真本人。",
                "你已经看了很久了。这本资料是为你准备的。",
                "日记本扫描时间：10月18日 02:03。那是你在接待室的凌晨。",
                "承认吧。你不是在寻找周晨，你就是在周晨的废墟上建立的投影。"
              ].map((text, i) => (
                <button 
                  key={i}
                  disabled={i > clickCount}
                  onClick={handleConfrontClick}
                  className={`w-full p-5 border transition-all text-left text-xs mono leading-relaxed ${i <= clickCount ? (i < clickCount ? 'border-red-500/10 text-red-900 line-through' : 'border-red-500 bg-red-950/10 text-red-100 shadow-[0_0_20px_rgba(255,0,0,0.3)] scale-[1.02]') : 'border-gray-800 text-gray-700 opacity-50'}`}
                >
                  {i < clickCount ? `[ 冗余数据已被粉碎 ]` : `[ 对质片段_${i+1} ]: ${text}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'collapse' && (
          <div className="text-center space-y-4">
            <p className="text-white mono text-xl animate-pulse tracking-widest uppercase">正在强制关闭同步程序...</p>
            <p className="text-red-500 mono text-xs">MEMORY_LEAK_DETECTED: [IDENTITY_NULL]</p>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="text-center space-y-12">
            <p className="text-xl md:text-2xl text-red-100 font-serif italic leading-relaxed drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {typedText}
            </p>
            {typedText === truthText && (
              <div className="space-y-8 animate-fadeIn pt-12 border-t border-gray-900">
                <p className="text-gray-600 text-[10px] mono leading-loose tracking-wider">
                  2012年10月24日 23:47，接待室里从未有过报案人。<br/>
                  灯光在闪烁。你坐在冰冷的椅子上。<br/>
                  你只是在空白的卷宗首页，写下了“陈真”这两个字。<br/>
                  那只是你的名字，还是你的囚笼？
                </p>
                <button 
                  onClick={handleReset}
                  className="px-12 py-4 bg-white text-black font-bold mono text-xs hover:bg-red-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  [ 彻底注销并重启意识 ]
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Final;
