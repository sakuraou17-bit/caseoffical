
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types';

interface Clue {
  id: string;
  keywords: string[];
  title: string;
  content: React.ReactNode;
  docRef: string;
  isPhase2?: boolean;
}

const cluesDatabase: Clue[] = [
  // --- Phase 1: 物理事实 ---
  {
    id: 'clue_allergy',
    keywords: ['草莓', '过敏', '医疗', '报告', '检测', '医院', '身体', '蛋糕', '甜', '水果'],
    title: '圣玛利亚 hospital：过敏源检测报告',
    docRef: 'MED-2012-08-YIN',
    content: (
      <div className="space-y-2">
        <p className="text-gray-300">患者姓名：<span className="font-bold">周茵</span></p>
        <p className="text-red-400 font-bold underline">检测结果：完全没有草莓过敏史。</p>
        <p className="text-xs text-gray-500 italic">“所谓的生理过敏，可能只是其构建的某种心理防御。”</p>
      </div>
    )
  },
  {
    id: 'clue_moving',
    keywords: ['搬家', '清单', '床', '餐具', '物流', '箱子', '收拾', '家具', '一个人', '生活'],
    title: '物流服务公司：搬家物料清单',
    docRef: 'LOGI-0826-LIST',
    content: (
      <div className="space-y-2">
        <p className="text-gray-300">托运明细：家具（桌椅、<span className="text-blue-400 font-bold">单人床 x1</span>）、餐厨（<span className="text-blue-400 font-bold">单人餐具 x1套</span>）。</p>
        <p className="text-xs text-gray-500 italic">备注：报案人周茵在该日搬家时，只携带了供一人使用的基本生活设施。</p>
      </div>
    )
  },
  {
    id: 'clue_weather',
    keywords: ['天气', '记录', '晴', '放晴', '下雨', '降雨', '气象', '淋雨', '湿', '云', '伞'],
    title: '气象观测站：2012-09-17 气象监测记录',
    docRef: 'WEATH-2012-09-17',
    content: (
      <div className="space-y-2">
        <p className="text-gray-300">当日（00:00 - 24:00）观测汇总：<span className="text-yellow-500 font-bold">全天持续放晴，无降水记录。</span></p>
        <p className="text-xs text-gray-400">结论：证实 9月17日 全天并无任何降雨发生。周茵在日记中描述的“下班淋雨回家”在物理现实中不存在。</p>
      </div>
    )
  },
  {
    id: 'clue_sweater_timeline',
    keywords: ['毛衣', '蓝色', '购买', '记录', '再次', '存根', '发票', '衣服', '扔', '商场', '银座'],
    title: '物证追踪：蓝色毛衣时空轨迹',
    docRef: 'EVID-SWEATER-SYNC',
    content: (
      <div className="space-y-6">
        <div className="border-l-2 border-red-500 pl-4 py-1">
          <p className="text-[10px] text-gray-500 mono mb-1">2012-08-27 | 社区回收站</p>
          <p className="text-gray-300 text-sm">回收记录：<span className="text-red-400 font-bold">蓝色毛衣一件 已被投递处理</span></p>
          <p className="text-[9px] text-gray-600">搬家当日，该衣物确实被当做“旧物”遗弃。</p>
        </div>
        <div className="border-l-2 border-blue-500 pl-4 py-1">
          <p className="text-[10px] text-gray-500 mono mb-1">2012-09-04 18:40 | 银座商场</p>
          <p className="text-gray-300 text-sm">消费存根 (B)：<span className="text-blue-400 font-bold"> 男款蓝色纯羊毛衫 x1</span></p>
          <p className="text-[9px] text-gray-600">丢弃一周后，重新购入了一件完全相同的款式。</p>
        </div>
        <div className="bg-red-950/20 p-3 border border-red-900/40">
          <p className="text-xs text-red-200 leading-relaxed italic">
            分析结论：日记中所谓的“灵异出现”在物理上是解释得通的——有人买了新的替代品。但记录者却坚持认为它是“旧的”。
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'clue_trash_cam',
    keywords: ['垃圾', '监控', '视频', '截图', '发型', '倒垃圾', '物业', '楼下', '空', '谁倒的'],
    title: '物业监控：9月9日 视频截图分析',
    docRef: 'CAM-SEC-0909',
    content: (
      <div className="space-y-2">
        <p className="text-gray-300">时间：00:20。光照极差。</p>
        <p className="text-gray-400 font-serif leading-relaxed">
          监控显示有人下楼扔了垃圾。依稀可以辨认出一个<span className="text-red-400 font-bold underline">中短发发型</span>的人。
        </p>
        <p className="text-[10px] text-gray-500">注：发型特征与当时短发的周茵高度吻合，而非男性。</p>
      </div>
    )
  },

  // --- Phase 2: 系统逻辑崩坏 ---
  {
    id: 'clue_psych_chen',
    keywords: ['心理', '人格', '周晨', '复查', '评估', '精神', '生病', '医生', '倾向', '消失'],
    isPhase2: true,
    title: '精神卫生中心：患者 周晨 评估',
    docRef: 'PSYCH-EVAL-CHEN',
    content: (
      <div className="space-y-2 text-red-200">
        <p>评估：周晨存在严重的情绪失控与躯体化问题，<span className="font-bold underline">具有多重人格障碍倾向</span>。</p>
        <p className="italic text-xs">“当事人近期正在考虑清除其他多余的人格。”</p>
      </div>
    )
  },
  {
    id: 'clue_sys_fix',
    keywords: ['系统', '维护', '一致性', '校验', '修复', '维护', '错误', '漏洞', '覆盖'],
    isPhase2: true,
    title: '底层服务器系统日志',
    docRef: 'SYS-LOG-0926',
    content: (
      <div className="mono text-[11px] text-gray-500">
        [2012-09-26 01:14] 案件档案出现“记录一致性校验失败”。<br/>
        [2012-09-26 01:15] <span className="text-red-500 font-bold">系统自动执行修复流程</span>。
      </div>
    )
  },
  {
    id: 'clue_duty_cz',
    keywords: ['陈真', '执勤', '加班', '时长', '312', '工作', '警员', '警察', '我不记得', '记录'],
    isPhase2: true,
    title: '人事系统：陈真 执勤记录汇总',
    docRef: 'POL-DUTY-SYNC',
    content: (
      <div className="space-y-2 text-gray-400">
        <p>2012年9月累计：<span className="text-red-400 font-bold">312 小时</span>。</p>
        <p>状态：高于平均水平 217%。<span className="italic">系统备注：未发现任何正式任务出勤记录。</span></p>
      </div>
    )
  },
  {
    id: 'clue_scan_gap',
    keywords: ['扫描', '元数据', '间隔', '1018', '补录', '伪造', '日期', '时间戳', '纸'],
    isPhase2: true,
    title: '数字存档：扫描元数据分析',
    docRef: 'METADATA-SCAN-ID',
    content: (
      <p className="text-gray-400 text-sm">
        10月16日日记扫描时间：<span className="text-red-500 font-bold underline">2012年10月18日 02:03</span>。<br/>
        与其他页面相比，存在明显的逻辑断层。
      </p>
    )
  },
  {
    id: 'clue_access_final',
    keywords: ['访问', '卷宗', '审计', '23:47', '最后', '结束', '报案', '真相'],
    isPhase2: true,
    title: '卷宗访问审计：最近一次记录',
    docRef: 'AUDIT-LOG-FINAL',
    content: (
      <div className="mono text-xs text-blue-400">
        时间戳：<span className="text-red-500 font-bold">23:47</span>。<br/>
        访问人：<span className="font-bold underline">陈真</span>。<br/>
        <span className="text-gray-500 italic">(系统比对：该时间点与案件报案录入时间完全一致)</span>
      </div>
    )
  },
  {
    id: 'clue_cache_hint',
    keywords: ['很久', '提示', '溢出', '内存', '盯着', '谁', '我', '看见'],
    isPhase2: true,
    title: '缓存溢出片段 (UNINDEXED_CACHE)',
    docRef: 'CACHE-DUMP-000',
    content: (
      <div className="p-4 bg-red-950/20 border border-red-900/40 text-center">
        <p className="text-red-500 italic font-serif text-lg tracking-widest animate-pulse">“你已经看了很久了。”</p>
        <p className="text-[8px] text-gray-700 mt-4 mono">MEMORY_LEAK_IN_IDENTITY_NODE</p>
      </div>
    )
  }
];

const Evidence: React.FC<{ gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }> = ({ gameState, setGameState }) => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<Clue | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [overflowTriggered, setOverflowTriggered] = useState(false);
  const [showCutscene, setShowCutscene] = useState<'none' | 'activate' | 'overflow'>('none');
  
  const logEndRef = useRef<HTMLDivElement>(null);

  const foundPhase1 = gameState.discovered_clue_ids.filter(id => !cluesDatabase.find(c => c.id === id)?.isPhase2);
  const isPhase1Complete = foundPhase1.length >= 5; 
  const isComplete = gameState.discovered_clue_ids.length >= cluesDatabase.length;

  const errorPool = [
    "[ERR] 无法定位 [周晨] 的复查协议...",
    "[WARN] 档案 0926 一致性校验失败...",
    "[SYS] 检测到管理员 陈真 存在异常执勤记录...",
    "[ALERT] 日记扫描时间戳 1018 逻辑断层...",
    "[NOTICE] 卷宗审计：23:47 存在未授权访问...",
    "[CRITICAL] 内存缓存溢出：“你已经看了很久了”...",
    "[WARN] 标识符 ID_CZ 与 ID_CHEN 重叠率 > 98%...",
    "[FATAL] 观察者即被观察者。检测到陈真介入度 > 85%..."
  ];

  useEffect(() => {
    if (isPhase1Complete && !overflowTriggered) {
      setOverflowTriggered(true);
      setShowCutscene('overflow');
      setTimeout(() => {
        setShowCutscene('none');
        setSystemLogs(["[SYSTEM] 物理证据已补完", "[SYSTEM] 正在检测逻辑闭环...", "[FATAL] 检测到不可调和的数据断层！", ">> 正在流出残余碎片..."]);
      }, 6000);
    }
  }, [isPhase1Complete, overflowTriggered]);

  useEffect(() => {
    if (isPhase1Complete && !isComplete) {
      const interval = setInterval(() => {
        const newLog = errorPool[Math.floor(Math.random() * errorPool.length)];
        setSystemLogs(prev => [...prev.slice(-20), newLog]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPhase1Complete, isComplete]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [systemLogs]);

  const handleDeepScan = () => {
    setIsScanning(true);
    setScanMessage('>> 正在挂载物理现实数据库...');
    setTimeout(() => setScanMessage('>> 正在尝试绕过逻辑防火墙...'), 1500);
    setTimeout(() => {
      setIsScanning(false);
      setShowCutscene('activate');
      setTimeout(() => {
        setShowCutscene('none');
        setGameState(prev => ({ ...prev, deep_scan_level: 1 }));
      }, 6000);
    }, 3500);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const result = cluesDatabase.find(clue => {
      if (!isPhase1Complete && clue.isPhase2) return false;
      return clue.keywords.some(k => query.includes(k) || k.includes(query));
    });

    if (result) {
      setSearchResult(result);
      if (!gameState.discovered_clue_ids.includes(result.id)) {
        setGameState(prev => ({
          ...prev,
          discovered_clue_ids: [...prev.discovered_clue_ids, result.id]
        }));
      }
    } else {
      setSearchResult(null);
    }
    setSearchInput('');
  };

  if (!gameState.unlockedModules.includes('evidence')) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
        <div className="border border-red-900/30 bg-red-950/5 p-12 text-center max-w-md shadow-2xl">
          <div className="text-4xl mb-6 grayscale opacity-30">🔒</div>
          <h2 className="text-red-500 font-bold mono uppercase tracking-widest mb-4">访问权限受限</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 italic font-serif">
            系统提示：需要至少 3 处档案标记。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 transition-all duration-1000 ${isComplete ? 'grayscale-0' : (isPhase1Complete ? 'grayscale-0' : 'grayscale opacity-80')}`}>
      
      {showCutscene !== 'none' && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-red-950/20 opacity-40"></div>
          <div className="space-y-12 animate-fadeInOut max-w-2xl relative z-10">
            {showCutscene === 'activate' ? (
              <div className="space-y-6">
                <p className="text-gray-400 font-serif italic text-xl lg:text-2xl leading-relaxed tracking-widest">
                  “如果这两个人真的同时存在于这个房间里……”
                </p>
                <p className="text-gray-300 font-serif italic text-lg lg:text-xl leading-relaxed">
                  “……为什么他们从没有在同一面镜子、同一个瞬间，留下过两对足迹？”
                </p>
              </div>
            ) : (
              <>
                <p className="text-red-900 font-mono text-[10px] mb-8 tracking-[0.8em] uppercase animate-pulse">
                  [ CRITICAL_LOGICAL_OVERFLOW ]
                </p>
                <p className="text-red-100 font-serif italic text-lg lg:text-xl leading-relaxed tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  “昨晚我把那颗草莓留在了桌上。今早它不见了。
                  <br/>
                  你说，到底是我们谁还在……觉得饿？”
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <aside className="w-full md:w-64 shrink-0 space-y-4 order-2 md:order-1">
        <div className={`border p-4 rounded-sm h-[450px] flex flex-col transition-all duration-500 ${isPhase1Complete ? 'border-red-900 bg-red-950/10' : 'border-gray-800 bg-black/40'}`}>
          <h3 className={`text-[10px] mono font-bold mb-4 flex items-center justify-between uppercase ${isPhase1Complete ? 'text-red-500' : 'text-blue-500'}`}>
            {isPhase1Complete ? 'LOG_COLLAPSE_STREAM' : 'SYSTEM_STABLE_LOG'}
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPhase1Complete ? 'bg-red-500' : 'bg-blue-500'}`}></span>
          </h3>
          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {systemLogs.map((log, i) => (
              <div key={i} className={`text-[9px] mono leading-relaxed border-l pl-2 transition-all ${isPhase1Complete ? 'border-red-900 text-red-400/70 hover:text-red-300' : 'border-gray-800 text-gray-500 hover:text-blue-300'}`}>
                {log}
              </div>
            ))}
            <div ref={logEndRef}></div>
          </div>
        </div>
      </aside>

      <div className="flex-grow space-y-8 order-1 md:order-2">
        {isScanning && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center">
            <div className="text-blue-500 mono text-sm animate-pulse flex items-center space-x-4">
              <span className="w-4 h-4 bg-blue-500 animate-ping"></span>
              <span>{scanMessage}</span>
            </div>
          </div>
        )}

        <header className="border-b border-gray-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold uppercase tracking-[0.2em] mb-2 transition-colors ${isComplete ? 'text-red-500' : (isPhase1Complete ? 'text-red-400' : 'text-blue-400')}`}>
              证据重组中心
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-[10px] mono">PROGRESS: {gameState.discovered_clue_ids.length} / {cluesDatabase.length}</span>
              <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isComplete ? 'bg-red-600' : (isPhase1Complete ? 'bg-red-800' : 'bg-blue-600')}`} 
                  style={{ width: `${(gameState.discovered_clue_ids.length / cluesDatabase.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-[10px] mono text-gray-600">
            PHASE: {isPhase1Complete ? <span className="text-red-500 animate-pulse">02_LOGICAL_COLLAPSE</span> : "01_PHYSICAL_RECONSTRUCT"}
          </div>
        </header>

        {gameState.deep_scan_level === 0 ? (
          <div className="bg-blue-950/5 border border-blue-900/20 p-16 text-center rounded-sm">
            <h3 className="text-blue-400 font-bold mb-6 mono tracking-widest uppercase">底层漏洞提取程序已就绪</h3>
            <p className="text-gray-400 text-sm mb-12 leading-relaxed max-w-lg mx-auto font-serif">
              档案本身是主观的。为了揭示客观真相，你必须先搜集所有关于“物理现实”的矛盾线索。只有物理层完整，系统底层才会因逻辑过载而漏出深层密码。
            </p>
            <button 
              onClick={handleDeepScan}
              className="px-12 py-4 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all mono text-xs uppercase tracking-widest"
            >
              [ 激活漏洞扫描协议 ]
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeIn">
            <section className={`border p-8 transition-all duration-500 ${isComplete ? 'border-red-600 bg-red-950/10 shadow-[0_0_40px_rgba(255,0,0,0.1)]' : 'border-gray-800 bg-[#161b22]'}`}>
              {isComplete ? (
                <div className="text-center py-12 space-y-8">
                  <h3 className="text-red-500 font-bold text-2xl mono uppercase tracking-[0.3em] animate-pulse">检测到致命身份冲突：系统已锁定</h3>
                  <p className="text-gray-400 text-sm font-serif italic">“周晨、周茵、陈真... 我们终于在同一个节点相遇了。”</p>
                  <button 
                    onClick={() => { setGameState(prev => ({ ...prev, ending_triggered: 'C' })); navigate('/final'); }}
                    className="px-16 py-5 bg-red-600 text-white font-bold mono uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(255,0,0,0.4)] hover:scale-105 transition-all"
                  >
                    [ 终止观察：IDENTITY_FINAL_SYNC ]
                  </button>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        placeholder={isPhase1Complete ? "捕捉日志流中泄露的关键词..." : "搜寻物理线索关键词"}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className={`flex-grow bg-black border px-6 py-4 text-sm text-gray-200 focus:outline-none mono transition-colors ${isPhase1Complete ? 'border-red-900 focus:border-red-500' : 'border-gray-800 focus:border-blue-500'}`}
                      />
                      <button type="submit" className={`border px-8 text-xs mono transition-all ${isPhase1Complete ? 'bg-red-900/20 border-red-500 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-blue-900/20 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'}`}>
                        检索
                      </button>
                    </div>
                  </form>

                  {searchResult ? (
                    <div className={`border bg-black/60 p-8 animate-slideDown shadow-2xl ${searchResult.isPhase2 ? 'border-red-500/30 shadow-red-900/10' : 'border-blue-500/30 shadow-blue-900/10'}`}>
                      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                        <h4 className={`font-bold text-sm uppercase tracking-widest ${searchResult.isPhase2 ? 'text-red-400' : 'text-blue-400'}`}>{searchResult.title}</h4>
                        <span className="text-[10px] mono text-gray-600">{searchResult.docRef}</span>
                      </div>
                      <div className="font-serif text-[16px] leading-loose">
                        {searchResult.content}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-24 border border-dashed border-gray-800">
                      {isPhase1Complete ? (
                        <p className="text-red-400/60 text-sm italic font-serif animate-pulse">系统已失控。寻找左侧红色日志中的泄露关键词。</p>
                      ) : (
                        <p className="text-gray-600 text-sm italic font-serif">
                          物理层数据缺失 ({foundPhase1.length}/5)。<br/>
                          请核对日记中的物证、天气与生活琐事。
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isPhase1Complete ? '#450a0a' : '#1e3a8a'}; }
        @keyframes fadeInOut {
          0% { opacity: 0; filter: blur(20px); transform: scale(0.95); }
          15% { opacity: 1; filter: blur(0); transform: scale(1); }
          85% { opacity: 1; filter: blur(0); transform: scale(1); }
          100% { opacity: 0; filter: blur(20px); transform: scale(1.05); }
        }
        .animate-fadeInOut { animation: fadeInOut 6s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default Evidence;
