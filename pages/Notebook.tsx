
import React from 'react';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
}

interface NoteEntry {
  id: string;
  title: string;
  summary: React.ReactNode;
  timestamp: string;
  rotation: number;
}

const notebookContent: Record<string, NoteEntry> = {
  'knife_logic': {
    id: 'knife_logic',
    title: '厨房里的刀',
    rotation: -1.2,
    timestamp: '2012.09.13 现场记事',
    summary: (
      <>
        这事儿太怪了。周茵在8月29号记日记说她习惯把刀按大到小排，结果到了9月13号，<span className="text-red-500 font-bold underline decoration-wavy">刀具</span>居然换了个摆法，<span className="text-red-500 font-bold">我想不通：</span>她为什么要惊讶？如果那不是她摆的，那是谁动的刀？
      </>
    )
  },
  'strawberry_logic': {
    id: 'strawberry_logic',
    title: '消失的过敏症',
    rotation: 0.8,
    timestamp: '2012.10.12 补充笔记',
    summary: (
      <>
        说好的<span className="text-red-500 font-bold border-b border-red-500">草莓过敏</span>呢？9月初还在日记里千叮咛万嘱咐说自己过敏，结果过生日那天，两姐弟吃草莓蛋糕吃得挺开心，一个没提过敏，一个没拦着。
      </>
    )
  },
  'trash_logic': {
    id: 'trash_logic',
    title: '谁倒了垃圾？',
    rotation: -0.5,
    timestamp: '2012.09.09 走访记录',
    summary: (
      <>
        9月9号早上，周茵发现垃圾桶是空的并以为是周晨倒的。但根据周晨的记录，他从8号晚上回家就<span className="text-red-500 font-bold bg-red-500/10 px-1">直接睡了</span>且一直睡到9号下午才起床。逻辑上，他不可能在9号早上清理垃圾桶。
      </>
    )
  },
  'weather_logic': {
    id: 'weather_logic',
    title: '两片不同的天空',
    rotation: 1.5,
    timestamp: '2012.09.17 走访记录',
    summary: (
      <>
        见了鬼了，9月17号那天，周茵说下雨淋了一身水，周晨却说天气特别好，还去散了步。难道在那个屋子里，他们<span className="text-red-500 font-bold italic">看到的不是同一片天</span>？
      </>
    )
  },
  'sweater_logic': {
    id: 'sweater_logic',
    title: '那件该死的蓝毛衣',
    rotation: -2.1,
    timestamp: '2012.09.24 证据确认',
    summary: (
      <>
        <span className="text-red-500 font-bold ring-1 ring-red-500 px-1">蓝毛衣</span>的事儿周茵一直在变卦。一会儿说早扔了，一会儿又说在柜子里看见了，甚至还差点穿错。周晨也说他一直在穿。
      </>
    )
  },
  'cup_logic': {
    id: 'cup_logic',
    title: '水杯的加减法',
    rotation: 0.4,
    timestamp: '2012.09.26 物证核对',
    summary: (
      <>
        周茵说<span className="text-red-500 font-bold underline decoration-dotted">小兔子水杯</span>丢了一个，周晨却在同一天说姐姐新买了一个。这种小事上他们也要各执一词？
      </>
    )
  },
  'holiday_logic': {
    id: 'holiday_logic',
    title: '不存在的加班',
    rotation: -0.8,
    timestamp: '2012.10.02 考勤核对',
    summary: (
      <>
        国庆假期，周茵说自己在加班，忙得脚不沾地。但我去她公司查过，根本没有加班记录，公司大门都锁着呢。
      </>
    )
  },
  'socks_logic': {
    id: 'socks_logic',
    title: '一只袜子',
    rotation: 1.1,
    timestamp: '2012.09.13 碎碎念',
    summary: (
      <>
        两份日记都提到了丢了一只袜子。但都说是对方的袜子，到底是谁的袜子？
      </>
    )
  }
};

const Notebook: React.FC<Props> = ({ gameState }) => {
  const allNoteIds = Object.keys(notebookContent);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <header className="mb-16 border-b-2 border-red-900/30 pb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-gray-100 tracking-tighter mb-4 font-serif italic">陈真的调查手记</h1>
          <p className="text-red-900 text-[11px] mono uppercase tracking-[0.5em] font-bold">IDENTITY_VOID_STUDY_LOG</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] mono text-gray-600 mb-2 font-bold">LOGICAL_SYNC</div>
          <div className="w-48 h-2 bg-gray-900 overflow-hidden border border-gray-800">
            <div 
              className="h-full bg-red-600 transition-all duration-1000 shadow-[0_0_10px_rgba(255,0,0,0.5)]" 
              style={{ width: `${(gameState.foundContradictionIds.length / allNoteIds.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {allNoteIds.map((id, index) => {
          const isFound = gameState.foundContradictionIds.includes(id);
          const note = notebookContent[id];

          return (
            <div 
              key={id} 
              style={{ transform: isFound ? `rotate(${note.rotation}deg)` : 'none' }}
              className={`relative p-8 transition-all duration-700 shadow-2xl ${
                isFound 
                ? 'bg-[#1c2128] border border-gray-700 opacity-100' 
                : 'bg-transparent border border-gray-900 opacity-20 grayscale scale-95'
              }`}
            >
              {/* 装饰性的“曲别针”或“黑色马克笔涂抹”效果 */}
              {isFound && (
                <div className="absolute -top-3 left-8 w-10 h-3 bg-red-900/40 rounded-full blur-[2px]"></div>
              )}

              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-3 h-3 rounded-full ${isFound ? 'bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'bg-gray-800'}`}></div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest font-serif ${isFound ? 'text-gray-100' : 'text-gray-700'}`}>
                    {isFound ? note.title : '??_COLLISION_??'}
                  </h3>
                </div>
                
                <div className="flex-grow font-serif text-[15px] leading-relaxed">
                  {isFound ? (
                    <div className="text-gray-400 space-y-4">
                      <p>{note.summary}</p>
                      <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                        <span className="text-[9px] mono text-red-900 font-bold uppercase tracking-widest">{note.timestamp}</span>
                        <span className="text-[12px] opacity-20 grayscale">FILE_ID: {index + 1}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      <div className="w-full h-1.5 bg-gray-900 rounded-full"></div>
                      <div className="w-5/6 h-1.5 bg-gray-900 rounded-full"></div>
                      <div className="w-4/6 h-1.5 bg-gray-900 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* 右下角的印章装饰 */}
              {isFound && (
                <div className="absolute bottom-2 right-2 text-[24px] opacity-5 pointer-events-none select-none">
                  CONFIDENTIAL
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-24 p-12 border-2 border-red-900/10 bg-red-950/5 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0d1117] px-4 text-red-900 mono text-xs font-bold tracking-[0.5em]">
          PERSONAL_THOUGHTS
        </div>
        <p className="text-sm text-gray-500 leading-relaxed font-serif italic max-w-xl mx-auto text-center">
          “记录本身会撒谎，但逻辑不会。只要我能拼凑出所有的断层，
          就能看到那个被隐藏在阴影里的人。或者说，看到我自己留下的灰烬。”
          <br/><br/>
          <span className="text-xs text-gray-600 not-italic">—— 摘自 陈真 的个人随笔 (录入时间: 04:12)</span>
        </p>
      </div>
    </div>
  );
};

export default Notebook;
