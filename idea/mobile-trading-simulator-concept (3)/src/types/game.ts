export type CardCategory = 'protocol' | 'decision' | 'reading' | 'defense';

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface GameCard {
  id: string;
  name: string;
  nameRu: string;
  category: CardCategory;
  rarity: CardRarity;
  cost: number;
  effect: string;
  effectRu: string;
  loreRu: string;
  clarityBonus: number;
  riskReduction: number;
  disciplineBonus: number;
  noiseShield: number;
  iconName: string;
  level: number;
  maxLevel: number;
}

export interface BossThreat {
  id: string;
  name: string;
  nameRu: string;
  titleRu: string;
  image: string;
  maxStability: number;
  currentStability: number;
  threatLevel: number;
  descriptionRu: string;
  specialMoveRu: string;
  weaknessCategory: CardCategory;
  intent: {
    name: string;
    description: string;
    damage: number;
    noiseType: string;
  };
}

export interface MarketPuzzle {
  id: string;
  level: number;
  titleRu: string;
  marketContextRu: string;
  timeframe: string;
  asset: string;
  chartType: 'triangle' | 'double_top' | 'liquidity_sweep' | 'divergence' | 'bull_flag';
  hintRu: string;
  questionRu: string;
  options: {
    id: string;
    textRu: string;
    isCorrect: boolean;
    explanationRu: string;
  }[];
  patternSignals: {
    labelRu: string;
    valueRu: string;
    status: 'bullish' | 'bearish' | 'neutral' | 'warning';
  }[];
}

export interface StoryNode {
  id: string;
  era: string;
  year: string;
  titleRu: string;
  situationRu: string;
  newsFlashRu: string;
  contextBadges: string[];
  choices: {
    id: string;
    titleRu: string;
    descriptionRu: string;
    dqiImpact: number; // Decision Quality Index impact
    disciplineScore: number;
    riskScore: number;
    outcomeRu: string;
    lessonRu: string;
    isBestPractice: boolean;
  }[];
}

export interface AcademyLesson {
  id: string;
  chapter: number;
  titleRu: string;
  descriptionRu: string;
  mentorQuoteRu: string;
  status: 'completed' | 'active' | 'locked';
  stars: number;
  xpReward: number;
  coinReward: number;
  unlockedCardId?: string;
  quiz: {
    questionRu: string;
    options: { textRu: string; isCorrect: boolean; feedbackRu: string }[];
  }[];
}

export interface WorldMapNode {
  id: string;
  year: string;
  titleRu: string;
  subtitleRu: string;
  type: 'boss' | 'story' | 'puzzle' | 'checkpoint';
  status: 'completed' | 'active' | 'locked';
  stars: number;
  maxStars: number;
  bossId?: string;
  rewardsRu: string;
}

export interface PlayerStats {
  analysis: number;       // Анализ (0-100)
  psychology: number;     // Психология (0-100)
  strategy: number;       // Стратегия (0-100)
  discipline: number;     // Дисциплина (0-100)
  riskManagement: number; // Управление рисками (0-100)
  decisionQualityAvg: number; // Среднее DQI %
  scenariosCompleted: number;
  streakDays: number;
  energy: number;
  maxEnergy: number;
  gems: number;
  gold: number;
  xp: number;
  nextLevelXp: number;
  level: number;
  leagueRank: number;
  totalLeaguePlayers: number;
  leagueNameRu: string;
}

export interface LeaguePlayer {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  dqiScore: number;
  consistencyScore: number;
  bestScenario: string;
  badgeRu: string;
  isPlayer?: boolean;
}

export interface GuildMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  messageRu: string;
  likes: number;
  attachedCard?: string;
  attachedDQI?: number;
}
