export type CardCategory = 'protocol' | 'decision' | 'reading' | 'defense';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardSynergy {
  targetCardId: string;
  nameRu: string;
  bonusEffectRu: string;
  bonusClarity: number;
  bonusShield: number;
  bonusDQI: number;
}

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
  synergies?: CardSynergy[];
  foilColor?: string;
}

export interface BossIntent {
  name: string;
  description: string;
  damage: number;
  noiseType: string;
  counterCategory: CardCategory;
  isSpecial?: boolean;
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
  phase: number;
  maxPhases: number;
  descriptionRu: string;
  specialMoveRu: string;
  weaknessCategory: CardCategory;
  passiveAbilityRu: string;
  intent: BossIntent;
}

export interface PatternSignal {
  labelRu: string;
  valueRu: string;
  status: 'bullish' | 'bearish' | 'neutral' | 'warning';
}

export interface ChartCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBullish: boolean;
  annotation?: string;
}

export interface MarketPuzzle {
  id: string;
  level: number;
  titleRu: string;
  marketContextRu: string;
  timeframe: string;
  asset: string;
  chartType: 'triangle' | 'double_top' | 'liquidity_sweep' | 'divergence' | 'fvg_imbalance' | 'bull_flag';
  hintRu: string;
  questionRu: string;
  targetZoneLabelRu: string;
  candles: ChartCandle[];
  options: {
    id: string;
    textRu: string;
    isCorrect: boolean;
    explanationRu: string;
    biasIdentifiedRu?: string;
  }[];
  patternSignals: PatternSignal[];
}

export interface StoryChoice {
  id: string;
  titleRu: string;
  descriptionRu: string;
  dqiImpact: number;
  disciplineScore: number;
  riskScore: number;
  outcomeRu: string;
  lessonRu: string;
  biasWarningRu?: string;
  isBestPractice: boolean;
}

export interface StoryNode {
  id: string;
  era: string;
  year: string;
  titleRu: string;
  situationRu: string;
  newsFlashRu: string;
  contextBadges: string[];
  historicalOutcomeRu: string;
  choices: StoryChoice[];
}

export interface AcademyQuizOption {
  textRu: string;
  isCorrect: boolean;
  feedbackRu: string;
}

export interface AcademyQuiz {
  questionRu: string;
  options: AcademyQuizOption[];
}

export interface AcademyLesson {
  id: string;
  chapter: number;
  titleRu: string;
  descriptionRu: string;
  mentorQuoteRu: string;
  mentorMood: 'neutral' | 'happy' | 'thinking' | 'warning' | 'proud';
  status: 'completed' | 'active' | 'locked';
  stars: number;
  xpReward: number;
  coinReward: number;
  unlockedCardId?: string;
  keyTakeawayRu: string;
  quiz: AcademyQuiz[];
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
  historicalContextRu: string;
}

export interface SkillPerk {
  id: string;
  nameRu: string;
  descRu: string;
  skillBranch: 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement';
  requiredLevel: number;
  unlocked: boolean;
  iconName: string;
  passiveBonusRu: string;
}

export interface PlayerStats {
  analysis: number;
  psychology: number;
  strategy: number;
  discipline: number;
  riskManagement: number;
  decisionQualityAvg: number;
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
  equippedPerks: string[];
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
  winRate: number;
  streak: number;
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
  tag?: string;
}
