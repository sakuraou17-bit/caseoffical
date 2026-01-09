
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  unlockedModules: string[];
}

const Home: React.FC<Props> = ({ unlockedModules }) => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm('[WARNING] 确定要初始化所有系统数据吗？这将抹除所有观测记录。')) {
      localStorage.removeItem('case0924_state');
      window.location.reload();
    }
  };

  const canAccessRecords = unlockedModules.includes('records');
  const canAccessEvidence = unlockedModules.includes('evidence');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="border border-white/5 bg-black/10 backdrop-blur-md p-10 shadow-xl rounded-sm w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-[120px] font-bold text-white/5 pointer-events-none select-none mono">
          0924
        </div>
        
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2 tracking-[0.3em] uppercase mono">侦查终端_v4.5</h1>
          <p className="text-gray-500 text-[10px] mono uppercase tracking-widest">首席调查员 陈真 (CZ_AUTH_L3)</p>
        </header>

        <section className="space-y-10 relative z-10">
          <div className="bg-white/5 p-6 border-l-2 border-blue-400/30">
            <h2 className="text-xs font-bold text-blue-300 mb-2 mono tracking-widest uppercase">案情简报: Case #2012-10-24</h2>
            <p className="text-gray-300 leading-relaxed text-sm font-serif italic">
              失踪人员：<span className="text-blue-200">周晨</span>。
              报告人：<span className="text-blue-200">周茵</span>。
              系统提示：通过档案库对比双人记录，捕捉意识层面的不连续性点。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/diaries')}
              className="group border border-white/5 p-5 hover:bg-white/5 transition-all text-left bg-black/10"
            >
              <h3 className="text-gray-200 font-bold mb-2 group-hover:text-blue-400 text-xs mono transition-colors">档案库</h3>
              <p className="text-[9px] text-gray-500 mono uppercase">数据同步与标记</p>
            </button>

            <button 
              onClick={() => canAccessRecords ? navigate('/records') : null}
              className={`group border p-5 transition-all text-left bg-black/10 ${canAccessRecords ? 'border-white/5 hover:bg-white/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <h3 className={`font-bold mb-2 text-xs mono transition-colors ${canAccessRecords ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-600'}`}>
                {canAccessRecords ? '案件资料' : '[锁定]'}
              </h3>
              <p className="text-[9px] text-gray-500 mono uppercase">外部证言与笔录</p>
            </button>

            <button 
              onClick={() => navigate('/notebook')}
              className="group border border-white/5 p-5 hover:bg-white/5 transition-all text-left bg-black/10"
            >
              <h3 className="text-gray-200 font-bold mb-2 group-hover:text-red-400 text-xs mono transition-colors">调查手记</h3>
              <p className="text-[9px] text-gray-500 mono uppercase">逻辑断层整理</p>
            </button>
            
            <button 
              onClick={() => canAccessEvidence ? navigate('/evidence') : null}
              className={`group border p-5 transition-all text-left bg-black/10 ${canAccessEvidence ? 'border-white/5 hover:bg-white/5 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
              <h3 className={`font-bold mb-2 text-xs mono transition-colors ${canAccessEvidence ? 'text-gray-200 group-hover:text-blue-400' : 'text-gray-600'}`}>
                {canAccessEvidence ? '取证中心' : '[锁定]'}
              </h3>
              <p className="text-[9px] text-gray-500 mono uppercase">底层漏洞检索</p>
            </button>
          </div>
        </section>

        <footer className="mt-16 text-[8px] text-gray-600 mono flex justify-between items-center border-t border-white/5 pt-6">
          <div className="flex space-x-6">
            <span>UPTIME: 128:44:02</span>
            <span>UPLINK: STABLE</span>
          </div>
          <button 
            onClick={handleReset}
            className="text-red-900/40 hover:text-red-500 transition-colors border border-red-900/10 px-3 py-1 hover:border-red-600/30"
          >
            [ REBOOT_SYSTEM ]
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Home;
