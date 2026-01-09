
import React, { useState, useRef, useEffect } from 'react';
import { yinDiaries, chenDiaries } from '../data/diaries';
import { TagType, TagLabels, GameState, DiaryEntry } from '../types';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const DiaryView: React.FC<Props> = ({ gameState, setGameState }) => {
  const [mode, setMode] = useState<'yin' | 'chen' | 'compare'>('compare');
  const [selectedSpan, setSelectedSpan] = useState<{ id: string, index: number } | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (leftScrollRef.current) leftScrollRef.current.scrollTop = 0;
    if (rightScrollRef.current) rightScrollRef.current.scrollTop = 0;
  }, [mode]);

  const handleSpanClick = (id: string, index: number) => {
    setSelectedSpan({ id, index });
  };

  const handleTagSelect = (tag: TagType | null) => {
    if (!selectedSpan) return;
    
    const targetId = selectedSpan.id;
    const targetIdx = selectedSpan.index;
    const spanKey = `${targetId}-${targetIdx}`;
    
    setSelectedSpan(null);

    setGameState(prev => {
      const allDiaries = [...yinDiaries, ...chenDiaries];
      const currentEntry = allDiaries.find(d => d.id === targetId)!;
      const contradictionId = currentEntry.content[targetIdx]?.contradictionId;

      const newTags = { ...prev.tags };
      if (tag === null) {
        delete newTags[spanKey];
      } else {
        newTags[spanKey] = tag;
      }
      
      let isConflictFound = false;
      let updatedFoundIds = [...prev.foundContradictionIds];

      if (tag !== null && contradictionId) {
        const hasOtherTagWithSameId = allDiaries.some(d => 
          d.content.some((s, idx) => {
            const key = `${d.id}-${idx}`;
            return key !== spanKey && s.contradictionId === contradictionId && newTags[key];
          })
        );

        if (hasOtherTagWithSameId) {
          isConflictFound = true;
          if (!updatedFoundIds.includes(contradictionId)) {
            updatedFoundIds.push(contradictionId);
          }
        }
      }

      if (isConflictFound) {
        setShaking(true);
        setShowAlert(true);
        setTimeout(() => setShaking(false), 500);
        setTimeout(() => setShowAlert(false), 3000);
      }

      return {
        ...prev,
        tags: newTags,
        foundContradictionIds: updatedFoundIds,
        anomalies_found: updatedFoundIds.length
      };
    });
  };

  const renderDiaryEntry = (diary: DiaryEntry) => {
    const isDateHovered = hoveredDate === diary.date;

    return (
      <div 
        key={diary.id} 
        onMouseEnter={() => setHoveredDate(diary.date)}
        onMouseLeave={() => setHoveredDate(null)}
        className={`mb-12 border-b border-blue-500/5 pb-10 last:border-0 transition-all duration-500 ${isDateHovered && mode === 'compare' ? 'bg-blue-500/5' : ''}`}
      >
        <div className="flex items-center space-x-3 mb-6 px-4">
          <span className={`text-[10px] mono font-bold bg-black/40 px-2 py-1 border transition-colors ${isDateHovered ? 'border-blue-500 text-blue-400' : 'border-blue-900/20 text-blue-900'}`}>
            {diary.date}
          </span>
          <div className={`h-px flex-grow transition-colors ${isDateHovered ? 'bg-blue-500/20' : 'bg-blue-500/5'}`}></div>
        </div>
        <div className="space-y-6 px-4">
          {diary.content.map((item, idx) => {
            const spanKey = `${diary.id}-${idx}`;
            const tag = gameState.tags[spanKey];
            const isConfirmed = item.contradictionId && gameState.foundContradictionIds.includes(item.contradictionId);

            return (
              <p key={idx} className="leading-loose">
                <span
                  onClick={() => handleSpanClick(diary.id, idx)}
                  className={`
                    inline p-1 rounded-sm cursor-pointer transition-all duration-300 relative
                    ${tag ? `border-l-2 ${TagLabels[tag].color} bg-blue-500/5 shadow-lg` : 'hover:bg-blue-500/10 text-gray-300'}
                    ${isConfirmed ? 'text-white border-blue-400 bg-blue-900/30 shadow-[0_0_15px_rgba(0,210,255,0.2)]' : ''}
                    ${selectedSpan?.id === diary.id && selectedSpan?.index === idx ? 'bg-blue-400/20 ring-1 ring-blue-500' : ''}
                    text-[16px] font-serif
                  `}
                >
                  {item.text}
                  {tag && (
                    <span className="absolute -top-4 right-0 text-[8px] mono text-blue-400/60 bg-black border border-blue-900/20 px-1 z-10">
                      {TagLabels[tag].label}
                    </span>
                  )}
                </span>
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`h-[calc(100vh-64px)] flex flex-col transition-all duration-500 ${shaking ? 'animate-pulse' : ''}`}>
      <div className="flex justify-center items-center h-16 border-b border-blue-500/10 bg-black/20 backdrop-blur-xl px-6 shrink-0 z-40">
        <div className="flex bg-black/40 p-1 rounded border border-blue-500/10">
          <button onClick={() => setMode('yin')} className={`px-5 py-1.5 text-[10px] mono uppercase transition-all rounded ${mode === 'yin' ? 'bg-blue-500/10 text-blue-400' : 'text-blue-900/50'}`}>档案_YIN</button>
          <button onClick={() => setMode('compare')} className={`px-6 py-1.5 text-[10px] mono uppercase transition-all rounded ${mode === 'compare' ? 'bg-blue-500/20 text-blue-100' : 'text-blue-900/50'}`}>时空对照</button>
          <button onClick={() => setMode('chen')} className={`px-5 py-1.5 text-[10px] mono uppercase transition-all rounded ${mode === 'chen' ? 'bg-blue-500/10 text-blue-400' : 'text-blue-900/50'}`}>档案_CHEN</button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden flex">
        {(mode === 'yin' || mode === 'compare') && (
          <div ref={leftScrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 border-r border-blue-500/5">
            <div className="max-w-2xl mx-auto">{yinDiaries.map(renderDiaryEntry)}</div>
          </div>
        )}
        {(mode === 'chen' || mode === 'compare') && (
          <div ref={rightScrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
            <div className="max-w-2xl mx-auto">{chenDiaries.map(renderDiaryEntry)}</div>
          </div>
        )}
      </div>

      {showAlert && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none">
           <div className="bg-red-950/90 border border-red-500/50 text-red-100 px-12 py-8 shadow-[0_0_100px_rgba(255,0,0,0.3)] backdrop-blur-2xl animate-bounce text-center">
             <div className="text-3xl mb-4">⚠️</div>
             <div className="text-lg mono font-bold uppercase tracking-[0.5em]">LOGIC_CRASH</div>
             <div className="text-[10px] mono text-red-400/80 mt-2">发现意识形态碰撞：ID_CONFLICT_0924</div>
           </div>
        </div>
      )}

      {selectedSpan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#020c1b] border border-blue-500/20 w-full max-w-sm rounded-sm shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-blue-950/20 border-b border-blue-500/10 flex justify-between items-center">
              <span className="text-[9px] mono text-blue-400 font-bold uppercase tracking-widest">选择分类标记</span>
              <button onClick={() => setSelectedSpan(null)} className="text-blue-900 hover:text-blue-100 transition-colors">✕</button>
            </div>
            <div className="p-4 space-y-2">
              {(Object.keys(TagLabels) as TagType[]).map(type => (
                <button 
                  key={type} 
                  onClick={() => handleTagSelect(type)} 
                  className="w-full flex items-center space-x-4 p-4 border border-blue-500/5 bg-blue-950/10 hover:bg-blue-500/10 hover:border-blue-400/50 transition-all text-left group"
                >
                  <span className="text-xl">{TagLabels[type].icon}</span>
                  <div className={`text-xs mono font-bold ${TagLabels[type].color.split(' ')[0]}`}>{TagLabels[type].label}</div>
                </button>
              ))}
              <div className="pt-2">
                <button 
                  onClick={() => handleTagSelect(null)}
                  className="w-full p-4 border border-red-900/20 text-red-900/60 hover:text-red-500 hover:border-red-500 transition-all text-[9px] mono text-center rounded bg-red-950/5"
                >
                  [ 清除标记 ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryView;
