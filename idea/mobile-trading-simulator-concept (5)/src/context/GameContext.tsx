import React, { createContext, useContext, useState } from 'react';
import { GameCard, MistakeJournalEntry, PlayerStats, TournamentEvent } from '../types/game';
import { ALL_GAME_CARDS } from '../data/cards';
import { TOURNAMENT_EVENTS } from '../data/social';
import { sound } from '../utils/audio';

export type GameScreen =
  | 'lobby'
  | 'map'
  | 'academy'
  | 'battler'
  | 'puzzle'
  | 'story'
  | 'deck'
  | 'social'
  | 'guild'
  | 'profile'
  | 'stats'
  | 'admin'
  | 'journal'
  | 'tournaments';

export interface ResultsModalData {
  titleRu: string;
  scenarioNameRu: string;
  dqiScore: number;
  dqiDelta: number;
  xpReward: number;
  goldReward: number;
  unlockedCard?: GameCard;
  actionsBreakdown: { labelRu: string; isPositive: boolean }[];
  lessonLearnedRu?: string;
}

interface GameContextType {
  currentScreen: GameScreen;
  setCurrentScreen: (screen: GameScreen) => void;
  playerStats: PlayerStats;
  inventoryCards: GameCard[];
  equippedDeck: string[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  resultsModal: ResultsModalData | null;
  setResultsModal: (data: ResultsModalData | null) => void;
  conceptModalOpen: boolean;
  setConceptModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  inspectedCard: GameCard | null;
  setInspectedCard: (card: GameCard | null) => void;
  mistakeJournal: MistakeJournalEntry[];
  tournaments: TournamentEvent[];
  
  // Game Actions
  equipCard: (cardId: string) => void;
  unequipCard: (cardId: string) => void;
  upgradeSkill: (skill: keyof Pick<PlayerStats, 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement'>) => boolean;
  upgradeCard: (cardId: string) => boolean;
  craftCardMastery: (cardId: string) => boolean;
  recordScenarioResult: (
    dqi: number,
    xp: number,
    gold: number,
    scenarioTitle: string,
    actions: { labelRu: string; isPositive: boolean }[],
    newCardId?: string,
    mistakeEntry?: Omit<MistakeJournalEntry, 'id' | 'date'>
  ) => void;
  setActiveTitle: (title: string) => void;
  playSound: (type: 'click' | 'select' | 'play' | 'success' | 'error' | 'roar') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYER_STATS: PlayerStats = {
  analysis: 62,
  psychology: 48,
  strategy: 40,
  discipline: 67,
  riskManagement: 55,
  decisionQualityAvg: 86.4,
  scenariosCompleted: 48,
  streakDays: 14,
  energy: 85,
  maxEnergy: 100,
  gems: 2500,
  gold: 8650,
  xp: 1420,
  nextLevelXp: 2000,
  level: 12,
  leagueRank: 248,
  totalLeaguePlayers: 12487,
  leagueNameRu: 'Лига Аналитиков',
  titlesUnlocked: ['Ученик Аналитика', 'Защитник Капитала', 'Охотник за Ликвидностью'],
  activeTitle: 'Ученик Аналитика',
  mistakeJournalCount: 3,
};

const INITIAL_MISTAKE_JOURNAL: MistakeJournalEntry[] = [
  {
    id: 'm-1',
    date: 'Сегодня, 11:20',
    scenarioTitleRu: 'Инфляционный Шок 2022',
    errorTypeRu: 'Попытка поймать падающий нож',
    wrongChoiceRu: 'Агрессивная покупка первого отскока без базы накопления',
    correctChoiceRu: 'Применение протокола «Сначала Риск» и дожидание подтверждения',
    dqiScore: 62,
    remedyRuleRu: 'Правило: Первый отскок на панике — это ловушка ликвидности для розницы.',
  },
  {
    id: 'm-2',
    date: 'Вчера, 16:45',
    scenarioTitleRu: 'Пазл: Ложный пробой SFP',
    errorTypeRu: 'Вход на верхушке фитиля свечи',
    wrongChoiceRu: 'Покупка в импульс на хаях диапазона',
    correctChoiceRu: 'Идентификация снятия ликвидности (Sweep) и фиксация лонга',
    dqiScore: 58,
    remedyRuleRu: 'Правило: Длинная тень сверху на высоком объеме указывает на поглощение покупок лимитными продавцами.',
  },
  {
    id: 'm-3',
    date: '3 дня назад',
    scenarioTitleRu: 'Битва с ФОМО-Фантомом',
    errorTypeRu: 'Эмоциональный вход без чеклиста',
    wrongChoiceRu: 'Поддался на зеленую свечу All-Time High',
    correctChoiceRu: 'Активация карты «Анти-ФОМО Броня» и сверка с дневным таймфреймом',
    dqiScore: 68,
    remedyRuleRu: 'Правило: Упущенная прибыль — не убыток. Рынок всегда дает следующий структурированный сетап.',
  },
];

const INITIAL_DECK = [
  'proto-evidence',
  'proto-noise-quarantine',
  'dec-staying-out',
  'dec-take-partials',
  'read-market-structure',
  'def-news-not-signal',
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreenState] = useState<GameScreen>('lobby');
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);
  const [inventoryCards, setInventoryCards] = useState<GameCard[]>(ALL_GAME_CARDS);
  const [equippedDeck, setEquippedDeck] = useState<string[]>(INITIAL_DECK);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [mistakeJournal, setMistakeJournal] = useState<MistakeJournalEntry[]>(INITIAL_MISTAKE_JOURNAL);
  const [tournaments] = useState<TournamentEvent[]>(TOURNAMENT_EVENTS);
  
  const [resultsModal, setResultsModal] = useState<ResultsModalData | null>(null);
  const [conceptModalOpen, setConceptModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [inspectedCard, setInspectedCard] = useState<GameCard | null>(null);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.enabled = enabled;
  };

  const playSound = (type: 'click' | 'select' | 'play' | 'success' | 'error' | 'roar') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'click': sound.playClick(); break;
      case 'select': sound.playCardSelect(); break;
      case 'play': sound.playCardPlay(); break;
      case 'success': sound.playSuccess(); break;
      case 'error': sound.playError(); break;
      case 'roar': sound.playBossRoar(); break;
    }
  };

  const setCurrentScreen = (screen: GameScreen) => {
    playSound('click');
    setCurrentScreenState(screen);
  };

  const equipCard = (cardId: string) => {
    if (equippedDeck.includes(cardId)) return;
    if (equippedDeck.length >= 6) {
      playSound('error');
      return;
    }
    playSound('select');
    setEquippedDeck([...equippedDeck, cardId]);
  };

  const unequipCard = (cardId: string) => {
    if (!equippedDeck.includes(cardId)) return;
    playSound('click');
    setEquippedDeck(equippedDeck.filter(id => id !== cardId));
  };

  const upgradeSkill = (skill: keyof Pick<PlayerStats, 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement'>) => {
    const cost = 500;
    if (playerStats.gold < cost || playerStats[skill] >= 100) {
      playSound('error');
      return false;
    }
    playSound('success');
    setPlayerStats(prev => ({
      ...prev,
      gold: prev.gold - cost,
      [skill]: Math.min(100, prev[skill] + 5),
    }));
    return true;
  };

  const upgradeCard = (cardId: string) => {
    const card = inventoryCards.find(c => c.id === cardId);
    if (!card || card.level >= card.maxLevel || playerStats.gold < 750) {
      playSound('error');
      return false;
    }
    playSound('success');
    setPlayerStats(prev => ({ ...prev, gold: prev.gold - 750 }));
    setInventoryCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, level: c.level + 1, clarityBonus: c.clarityBonus + 5, noiseShield: c.noiseShield + 5 } : c))
    );
    return true;
  };

  const craftCardMastery = (cardId: string) => {
    const card = inventoryCards.find(c => c.id === cardId);
    if (!card || playerStats.gems < 500) {
      playSound('error');
      return false;
    }
    playSound('success');
    setPlayerStats(prev => ({ ...prev, gems: prev.gems - 500 }));
    setInventoryCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, masteryTier: c.masteryTier + 1, clarityBonus: c.clarityBonus + 8 } : c))
    );
    return true;
  };

  const setActiveTitle = (title: string) => {
    playSound('click');
    setPlayerStats(prev => ({ ...prev, activeTitle: title }));
  };

  const recordScenarioResult = (
    dqi: number,
    xp: number,
    gold: number,
    scenarioTitle: string,
    actions: { labelRu: string; isPositive: boolean }[],
    newCardId?: string,
    mistakeEntry?: Omit<MistakeJournalEntry, 'id' | 'date'>
  ) => {
    playSound('success');
    const unlockedCard = newCardId ? inventoryCards.find(c => c.id === newCardId) : undefined;
    
    if (mistakeEntry && dqi < 80) {
      const newEntry: MistakeJournalEntry = {
        id: `m-${Date.now()}`,
        date: 'Только что',
        ...mistakeEntry,
      };
      setMistakeJournal(prev => [newEntry, ...prev]);
    }

    setPlayerStats(prev => {
      const newXp = prev.xp + xp;
      const leveledUp = newXp >= prev.nextLevelXp;
      const newScenarios = prev.scenariosCompleted + 1;
      const newDqiAvg = Number((((prev.decisionQualityAvg * prev.scenariosCompleted) + dqi) / newScenarios).toFixed(1));
      
      return {
        ...prev,
        xp: leveledUp ? newXp - prev.nextLevelXp : newXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        nextLevelXp: leveledUp ? Math.floor(prev.nextLevelXp * 1.25) : prev.nextLevelXp,
        gold: prev.gold + gold,
        scenariosCompleted: newScenarios,
        decisionQualityAvg: newDqiAvg,
        mistakeJournalCount: mistakeEntry && dqi < 80 ? prev.mistakeJournalCount + 1 : prev.mistakeJournalCount,
      };
    });

    setResultsModal({
      titleRu: dqi >= 80 ? 'ПОБЕДА' : 'СЦЕНАРИЙ ЗАВЕРШЕН',
      scenarioNameRu: scenarioTitle,
      dqiScore: dqi,
      dqiDelta: +12,
      xpReward: xp,
      goldReward: gold,
      unlockedCard,
      actionsBreakdown: actions,
      lessonLearnedRu: mistakeEntry?.remedyRuleRu,
    });
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        playerStats,
        inventoryCards,
        equippedDeck,
        soundEnabled,
        setSoundEnabled,
        resultsModal,
        setResultsModal,
        conceptModalOpen,
        setConceptModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        inspectedCard,
        setInspectedCard,
        mistakeJournal,
        tournaments,
        equipCard,
        unequipCard,
        upgradeSkill,
        upgradeCard,
        craftCardMastery,
        setActiveTitle,
        recordScenarioResult,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
