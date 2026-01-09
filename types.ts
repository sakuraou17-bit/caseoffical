export enum TagType {
  TIME = 'TIME',
  ITEM = 'ITEM',
  MEMORY = 'MEMORY',
  IDENTITY = 'IDENTITY',
  INTUITION = 'INTUITION'
}

export const TagLabels: Record<TagType, { label: string, icon: string, color: string }> = {
  [TagType.TIME]: { label: '时间异常', icon: '⏱', color: 'text-blue-400 border-blue-400' },
  [TagType.ITEM]: { label: '物品异常', icon: '👕', color: 'text-green-400 border-green-400' },
  [TagType.MEMORY]: { label: '记忆问题', icon: '🧠', color: 'text-purple-400 border-purple-400' },
  [TagType.IDENTITY]: { label: '身份错位', icon: '👁', color: 'text-red-400 border-red-400' },
  [TagType.INTUITION]: { label: '直觉不对', icon: '❓', color: 'text-yellow-400 border-yellow-400' }
};

export interface DiaryContent {
  text: string;
  contradictionId?: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  author: 'Yin' | 'Chen';
  content: DiaryContent[];
}

export interface GameState {
  tags: Record<string, TagType>;
  unlockedModules: string[];
  lastContradictionId: string | null;
  foundContradictionIds: string[];
  trust_yin: number; 
  trust_chen: number;
  anomalies_found: number;
  ending_triggered: 'A' | 'B' | 'C' | null;
  intro_complete: boolean;
  deep_scan_level: number;
  discovered_clue_ids: string[];
}