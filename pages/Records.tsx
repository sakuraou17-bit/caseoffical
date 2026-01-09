import React from 'react';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
}

const Records: React.FC<Props> = ({ gameState }) => {
  const isUnlocked = gameState.unlockedModules.includes('records');

  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8">
        <div className="border border-gray-800 bg-gray-900/20 p-12 text-center max-w-md shadow-2xl">
          <div className="text-4xl mb-6 grayscale opacity-30">📂</div>
          <h2 className="text-gray-500 font-bold mono uppercase tracking-widest mb-4">案件卷宗访问受限</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8 italic">
            系统提示：初步取证未完成。必须在档案库中标记至少 3 处显著逻辑碰撞，方可调阅外部证言及内部案情摘要。
          </p>
          <div className="text-[10px] text-gray-800 mono">AUTHORIZATION_LEVEL: RESTRICTED</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 pb-24">
      <header className="border-b border-gray-800 pb-8">
        <h1 className="text-3xl font-bold text-gray-100 tracking-tighter uppercase mb-2">案卷材料 (CASE_FILES_0924)</h1>
        <p className="text-gray-500 text-xs mono">CONFIDENTIAL | 绝密档案 | 仅限授权警员查阅</p>
      </header>

      {/* 报案记录 / 口供 */}
      <section className="bg-white/5 border border-gray-800 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 bg-gray-800 text-[8px] mono text-gray-400">DOC_TYPE: TESTIMONY_A</div>
        <h2 className="text-blue-400 font-bold mb-6 flex items-center">
          <span className="w-1 h-4 bg-blue-500 mr-2"></span>
          报案人笔录 (2012-10-24)
        </h2>
        <div className="font-serif text-sm leading-relaxed text-gray-300 space-y-4">
          <p>
            <span className="text-gray-500">【调查员：陈真】</span>
          </p>
          <p>
            “我弟弟周晨...他已经失踪快四天了。我们刚搬到这个社区不到两个月。16号那天他说压力大想出去走走，之后就再也没回来过。”
          </p>
          <p>
            “他在本地读大学，大一。平时很乖，就是爱打游戏。我们父母过世后一直是我照顾他，我们感情很好。12号我过生日他还给我买了草莓蛋糕。”
          </p>
          <p>
            “失踪那天他穿了一件蓝色的毛衣。我打了他很多次电话，都是关机。我求求你们帮我找找他...”
          </p>
          <p className="text-xs text-gray-500 italic pt-4">注：报案人表现极度焦虑，多次强调弟弟“离不开我”。</p>
        </div>
      </section>

      {/* 警方内部系统页 */}
      <section className="bg-black border border-blue-900/30 p-8 shadow-[0_0_15px_rgba(30,58,138,0.1)]">
        <h2 className="text-gray-100 font-bold mb-6 mono text-xs uppercase tracking-widest flex justify-between items-center">
          内部案情摘要 (INTERNAL_SUMMARY)
          <span className="text-green-500 text-[8px] animate-pulse">● 系统运行正常</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[12px] mono text-gray-400">
          <div className="space-y-4">
            <div className="border-b border-gray-900 pb-2">
              <span className="text-gray-600">关联关系:</span> 周茵（姐）/ 周晨（弟）
            </div>
            <div className="border-b border-gray-900 pb-2">
              <span className="text-gray-600">迁入时间:</span> 2012年8月26日
            </div>
            <div className="border-b border-gray-900 pb-2">
              <span className="text-gray-600">学籍核查:</span> <span className="text-yellow-600"> [PENDING] 本地数据库暂未检出“周晨”名下活跃学籍，可能存在跨区同步延迟或记录锁定。</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-b border-gray-900 pb-2">
              <span className="text-gray-600">现场查勘-01:</span> 室内生活用品摆放呈现<span className="italic">极度对称</span>特征，所有个人消耗品（牙膏、洗发露等）的使用进度较快，符合多人居住或单一高频使用的物理规律。
            </div>
            <div className="border-b border-gray-900 pb-2">
              <span className="text-gray-600">现场查勘-02:</span> 衣柜内部空间划分存在明显的“风格断层”，但未发现除报案人外第二人的指纹样本（不排除已被刻意清理）。
            </div>
          </div>
        </div>
      </section>

      {/* 外部视角碎片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-gray-900/20 border border-gray-800 p-6">
          <h3 className="text-xs font-bold text-gray-500 mb-4 mono uppercase">邻居证言 (Witness_01)</h3>
          <p className="text-xs font-serif leading-relaxed text-gray-400 italic">
            “搬家那天我印象挺深的，就看见那小姑娘一个人在那儿折腾，搬着几个大箱子上下楼。我看她实在辛苦，还过去帮她搭了把手抬了个沉柜子。我当时随口问她家里没个男人帮忙吗，她只是笑笑说她弟弟‘已经在屋里了’。可那天我眼看着她进进出出折腾了一下午，真没瞧见第二个大活人。不过怪就怪在半夜，那隔音一般，总能听见隔壁传来特别响的游戏声音，炸弹声、喊叫声，吵得我睡不着。我想着那小伙子大概是个极度孤僻的网瘾少年吧，整天大门不出二门不迈的。”
          </p>
        </section>

        <section className="bg-gray-900/20 border border-gray-800 p-6">
          <h3 className="text-xs font-bold text-gray-500 mb-4 mono uppercase">能源使用波动 (Energy_Log)</h3>
          <p className="text-xs font-serif leading-relaxed text-gray-400">
            2012年9月-10月月均用水量分析：
            <br/>当前数据处于[标准单身住户上限]与[极简双人住户下限]的重合区间。
            <br/>检测到深夜（AM 02:00 - 04:00）存在异常的间歇性用水峰值，与报案人描述的作息习惯（23:00入睡）不符。
            <br/>结论：<span className="text-gray-500 italic">无法通过能耗数据排除第二人存在的可能性。</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Records;