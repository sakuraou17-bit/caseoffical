import React, { useState } from 'react';
import { yinDiaries, chenDiaries } from '../data/diaries';

const Timeline: React.FC = () => {
  // Combine and shuffle for a bit of challenge
  const [items, setItems] = useState(() => {
    const all = [...yinDiaries.slice(0, 5), ...chenDiaries.slice(0, 5)];
    return all.sort(() => Math.random() - 0.5);
  });

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-100 mb-2 uppercase tracking-widest">物理事件重构</h2>
        <p className="text-gray-500 text-sm mono">当前版本：VER_0.8.2_BETA (实验性模块)</p>
      </header>

      <div className="bg-gray-950/30 p-8 border border-gray-800 rounded-sm">
        <p className="text-xs text-gray-500 mb-8 italic">
          系统无法确定真相。请尝试按照你认为的逻辑顺序排列这些“记忆片段”。
          注意：部分记录可能存在互斥性。
        </p>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="flex items-center space-x-4 bg-[#161b22] border border-gray-800 p-4 hover:border-gray-600 transition-all cursor-default"
            >
              <div className="flex flex-col space-y-1">
                <button 
                  onClick={() => index > 0 && moveItem(index, index - 1)}
                  className="text-gray-600 hover:text-blue-500 text-xs"
                >
                  ▲
                </button>
                <button 
                  onClick={() => index < items.length - 1 && moveItem(index, index + 1)}
                  className="text-gray-600 hover:text-blue-500 text-xs"
                >
                  ▼
                </button>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-gray-500 mono">{item.date}</span>
                  <span className={`text-[10px] mono px-2 rounded-full border ${item.author === 'Yin' ? 'border-blue-900 text-blue-400' : 'border-green-900 text-green-400'}`}>
                    {item.author === 'Yin' ? 'SOURCE: YIN' : 'SOURCE: CHEN'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {/* Fix: item.content[0] is an object of type DiaryContent, need to access the text property for rendering */}
                  {item.content[0]?.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => alert('[SYSTEM] 验证中...\n逻辑链条完整度：52.4%\n结果：仍存在 3 处显著逻辑断层。')}
            className="px-8 py-3 bg-blue-900/50 border border-blue-500 text-blue-200 hover:bg-blue-800/50 transition-all text-sm mono"
          >
            RUN_VALIDATION
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timeline;