// Expanded and comprehensive Game Types for SIGNAL ARENA

export type CardCategory = 'protocol' | 'decision' | 'reading' | 'defense';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type AssetClass = 'crypto' | 'equity' | 'forex' | 'commodity' | 'index';
export type MarketRegime = 'bull_trend' | 'bear_trend' | 'high_volatility' | 'consolidation' | 'liquidity_crisis' | 'fomc_shock';

export interface CardSynergy {
  targetCardId: string;
  synergyNameRu: string;
  bonusEffectRu: string;
  extraClarity: number;
  extraShield: number;
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
  detailedRuleRu: string;
  clarityBonus: number;
  riskReduction: number;
  disciplineBonus: number;
  noiseShield: number;
  iconName: string;
  level: number;
  maxLevel: number;
  masteryXp: number;
  masteryTier: number;
  synergies?: CardSynergy[];
  archetypeTagRu: string;
}

export interface BossIntent {
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  damage: number;
  shieldBreak: number;
  noiseType: string;
  threatType: 'burst' | 'debuff' | 'drain' | 'chaos';
  counterCategory: CardCategory;
}

export interface BossPhase {
  phaseNumber: number;
  hpThreshold: number;
  phaseNameRu: string;
  phaseBuffRu: string;
  newIntent: BossIntent;
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
  regime: MarketRegime;
  descriptionRu: string;
  specialMoveRu: string;
  weaknessCategory: CardCategory;
  secondaryWeakness?: CardCategory;
  phases: BossPhase[];
  intent: BossIntent;
  loreQuoteRu: string;
}

export interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isSweep?: boolean;
  isBOS?: boolean;
  annotationRu?: string;
}

export interface MarketPuzzle {
  id: string;
  chapter: number;
  level: number;
  titleRu: string;
  marketContextRu: string;
  assetClass: AssetClass;
  asset: string;
  timeframe: string;
  regime: MarketRegime;
  chartType: 'triangle' | 'double_top' | 'liquidity_sweep' | 'divergence' | 'bull_flag' | 'head_and_shoulders' | 'fvg_fill' | 'order_block';
  hintRu: string;
  questionRu: string;
  candles: CandlestickData[];
  resistancePrice?: number;
  supportPrice?: number;
  invalidationLevel?: number;
  patternSignals: {
    labelRu: string;
    valueRu: string;
    status: 'bullish' | 'bearish' | 'neutral' | 'warning';
  }[];
  options: {
    id: string;
    textRu: string;
    isCorrect: boolean;
    explanationRu: string;
    dqiImpact: number;
  }[];
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
  historicalFactRu: string;
  isBestPractice: boolean;
  consequences: {
    capitalPreservedPercent: number;
    psychologyPenalty: number;
    xpBonus: number;
  };
}

export interface StoryNode {
  id: string;
  era: string;
  year: string;
  titleRu: string;
  situationRu: string;
  newsFlashRu: string;
  newspaperSnippetRu: string;
  contextBadges: string[];
  historicalQuoteRu: string;
  historicalSpeakerRu: string;
  choices: StoryChoice[];
}

export interface AcademyQuizOption {
  textRu: string;
  isCorrect: boolean;
  feedbackRu: string;
}

export interface AcademyQuizQuestion {
  id: string;
  questionRu: string;
  conceptRu: string;
  options: AcademyQuizOption[];
}

export interface AcademyLesson {
  id: string;
  chapter: number;
  sectionRu: string;
  titleRu: string;
  descriptionRu: string;
  mentorQuoteRu: string;
  keyRuleRu: string;
  status: 'completed' | 'active' | 'locked';
  stars: number;
  xpReward: number;
  coinReward: number;
  unlockedCardId?: string;
  practicalExerciseType: 'quiz' | 'pattern_check' | 'risk_calc';
  quiz: AcademyQuizQuestion[];
}

export interface WorldMapNode {
  id: string;
  year: string;
  eraCode: string;
  titleRu: string;
  subtitleRu: string;
  type: 'boss' | 'story' | 'puzzle' | 'checkpoint' | 'raid';
  status: 'completed' | 'active' | 'locked';
  stars: number;
  maxStars: number;
  bossId?: string;
  puzzleId?: string;
  storyId?: string;
  rewardsRu: string;
  completionDqi?: number;
}

export interface SkillNode {
  id: string;
  branch: 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement';
  nameRu: string;
  descRu: string;
  level: number;
  maxLevel: number;
  costGold: number;
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
  titlesUnlocked: string[];
  activeTitle: string;
  mistakeJournalCount: number;
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
  division: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Grandmaster';
  isPlayer?: boolean;
}

export interface GuildMember {
  id: string;
  name: string;
  role: 'Leader' | 'Officer' | 'Member';
  dqiScore: number;
  weeklyXp: number;
  online: boolean;
  avatar: string;
}

export interface GuildData {
  id: string;
  name: string;
  tag: string;
  level: number;
  membersCount: number;
  maxMembers: number;
  guildRank: number;
  totalDqiAvg: number;
  weeklyQuestRu: string;
  weeklyQuestProgress: number;
  weeklyQuestTarget: number;
  members: GuildMember[];
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
  isSystemAlert?: boolean;
}

export interface MistakeJournalEntry {
  id: string;
  date: string;
  scenarioTitleRu: string;
  errorTypeRu: string;
  wrongChoiceRu: string;
  correctChoiceRu: string;
  dqiScore: number;
  remedyRuleRu: string;
}

export interface TournamentEvent {
  id: string;
  titleRu: string;
  descRu: string;
  badgeRu: string;
  timeLeft: string;
  prizePoolGold: number;
  prizeCardNameRu: string;
  participantsCount: number;
  minDqiRequirement: number;
  status: 'active' | 'upcoming' | 'ended';
}
