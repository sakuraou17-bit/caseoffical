import React, { useState, useEffect } from 'react';
import { GameState } from '../types';

interface Props {
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const Intro: React.FC<Props> = ({ setGameState }) => {
  const [step, setStep] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (step === 0) {
      console.log('case_context_syncing...');
      const timer = setTimeout(() => setStep(1), 4000);
      return () => clearTimeout(timer);
    }
    
    if (step === 4) {
      // Flash effect when reporter enters
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 200);
      const nextTimer = setTimeout(() => setStep(5), 5000);
      return () => { clearTimeout(timer); clearTimeout(nextTimer); };
    }

    if (step === 5) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, intro_complete: true }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, setGameState]);

  const handlePsychChoice = (choice: 'clear' | 'tired' | 'unsure') => {
    let yinAdj = 0;
    let chenAdj = 0;
    if (choice === 'clear') chenAdj = 5;
    if (choice === 'unsure') yinAdj = 5;
    
    setGameState(prev => ({
      ...prev,
      trust_yin: prev.trust_yin + yinAdj,
      trust_chen: prev.trust_chen + chenAdj
    }));
    setStep(4);
  };

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center text-[#c9d1d9] transition-colors duration-200 ${isFlashing ? 'bg-gray-800' : 'bg-black'}`}>
      <div className="max-w-md w-full px-6">
        
        {/* Step 1: Loading */}
        {step === 0 && (
          <div className="text-center animate-pulse">
            <p className="text-xs tracking-[0.2em] text-gray-500 mono">正在载入案件资料...</p>
          </div>
        )}

        {/* Step 2: System Prompt */}
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-2 border-blue-500 pl-6 space-y-2">
              <p className="text-sm font-bold text-blue-400 mono">>> NEW_CASE_RECEIVED</p>
              <p className="text-lg">报案人：周茵</p>
              <p className="text-lg">报案内容：家属失踪</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-serif">
              请确认你的状态是否适合继续工作。
            </p>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition-all text-sm mono uppercase tracking-widest"
            >
              [ 继续 ]
            </button>
          </div>
        )}

        {/* Step 3: Psychological Test */}
        {step === 2 && (
          <div className="space-y-12 animate-fadeIn">
            <h2 className="text-xl text-center font-serif italic">“你现在感觉如何？”</h2>
            <div className="space-y-4">
              <button onClick={() => handlePsychChoice('clear')} className="w-full p-4 border border-gray-800 hover:bg-gray-900 text-sm mono text-left">
                A. 我很清醒
              </button>
              <button onClick={() => handlePsychChoice('tired')} className="w-full p-4 border border-gray-800 hover:bg-gray-900 text-sm mono text-left">
                B. 有点累，但没问题
              </button>
              <button onClick={() => handlePsychChoice('unsure')} className="w-full p-4 border border-gray-800 hover:bg-gray-900 text-sm mono text-left">
                C. 不太确定
              </button>
            </div>
            <p className="text-[10px] text-gray-700 text-center mono uppercase">Personal_State_Syncing...</p>
          </div>
        )}

        {/* Step 4: Reporter Enters */}
        {step === 4 && (
          <div className="space-y-6 mono text-xs text-gray-500">
            <p className="text-gray-400">23:41</p>
            <p>报案人进入接待室。</p>
            <p>情绪稳定。</p>
            <p>表述清晰。</p>
            <div className="h-12"></div>
            <p className="text-lg font-serif text-gray-300 italic">“她说，她的弟弟失踪了。”</p>
          </div>
        )}

        {/* Step 5: Unnecessary Info */}
        {step === 5 && (
          <div className="text-center">
            <p className="text-sm italic font-serif text-gray-400 animate-fadeInOut">
              记录完成时，你发现桌上的笔并不在你记忆中的位置。
            </p>
          </div>
        )}

      </div>

      {/* Hidden Design Elements (ARG Styling) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out forwards;
        }
        .animate-fadeInOut {
          animation: fadeInOut 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Intro;