import React, { createContext, useContext, useState } from 'react';
import { CardSynergy, GameCard, PlayerStats, SkillPerk } from '../types/game';
import { ALL_GAME_CARDS } from '../data/cards';
import { SKILL_PERKS } from '../data/social';
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
  | 'admin';

export interface ResultsModalData {
  titleRu: string;
  scenarioNameRu: string;
  dqiScore: number;
  dqiDelta: number;
  xpReward: number;
  goldReward: number;
  unlockedCard?: GameCard;
  actionsBreakdown: { labelRu: string; isPositive: boolean }[];
  synergiesTriggered?: CardSynergy[];
}

interface GameContextType {
  currentScreen: GameScreen;
  setCurrentScreen: (screen: GameScreen) => void;
  playerStats: PlayerStats;
  inventoryCards: GameCard[];
  equippedDeck: string[];
  skillPerks: SkillPerk[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  masterVolume: number;
  setMasterVolume: (vol: number) => void;
  resultsModal: ResultsModalData | null;
  setResultsModal: (data: ResultsModalData | null) => void;
  conceptModalOpen: boolean;
  setConceptModalOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  inspectedCard: GameCard | null;
  setInspectedCard: (card: GameCard | null) => void;
  
  // Actions
  equipCard: (cardId: string) => void;
  unequipCard: (cardId: string) => void;
  toggleEquipPerk: (perkId: string) => void;
  upgradeSkill: (skill: keyof Pick<PlayerStats, 'analysis' | 'psychology' | 'strategy' | 'discipline' | 'riskManagement'>) => boolean;
  upgradeCard: (cardId: string) => boolean;
  recordScenarioResult: (
    dqi: number,
    xp: number,
    gold: number,
    scenarioTitle: string,
    actions: { labelRu: string; isPositive: boolean }[],
    newCardId?: string,
    combos?: CardSynergy[]
  ) => void;
  playSound: (type: 'click' | 'select' | 'play' | 'success' | 'error' | 'roar' | 'combo' | 'block') => void;
  checkDeckSynergies: (cardIds: string[]) => CardSynergy[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYER_STATS: PlayerStats = {
  analysis: 68,
  psychology: 52,
  strategy: 45,
  discipline: 72,
  riskManagement: 60,
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
  equippedPerks: ['perk-cold-heart', 'perk-orderflow-eye'],
};

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
  const [skillPerks] = useState<SkillPerk[]>(SKILL_PERKS);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [masterVolume, setMasterVolumeState] = useState<number>(0.8);
  
  const [resultsModal, setResultsModal] = useState<ResultsModalData | null>(null);
  const [conceptModalOpen, setConceptModalOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [inspectedCard, setInspectedCard] = useState<GameCard | null>(null);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sound.enabled = enabled;
  };

  const setMasterVolume = (vol: number) => {
    setMasterVolumeState(vol);
    sound.masterVolume = vol;
  };

  const playSound = (type: 'click' | 'select' | 'play' | 'success' | 'error' | 'roar' | 'combo' | 'block') => {
    if (!soundEnabled) return;
    switch (type) {
      case 'click': sound.playClick(); break;
      case 'select': sound.playCardSelect(); break;
      case 'play': sound.playCardPlay(); break;
      case 'success': sound.playSuccess(); break;
      case 'error': sound.playError(); break;
      case 'roar': sound.playBossRoar(); break;
      case 'combo': sound.playComboTrigger(); break;
      case 'block': sound.playShieldBlock(); break;
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

  const toggleEquipPerk = (perkId: string) => {
    playSound('click');
    setPlayerStats(prev => {
      const isEquipped = prev.equippedPerks.includes(perkId);
      return {
        ...prev,
        equippedPerks: isEquipped
          ? prev.equippedPerks.filter(id => id !== perkId)
          : [...prev.equippedPerks, perkId],
      };
    });
  };

  const checkDeckSynergies = (cardIds: string[]): CardSynergy[] => {
    const triggered: CardSynergy[] = [];
    cardIds.forEach(id => {
      const card = inventoryCards.find(c => c.id === id);
      if (card && card.synergies) {
        card.synergies.forEach(syn => {
          if (cardIds.includes(syn.targetCardId)) {
            triggered.push(syn);
          }
        });
      }
    });
    return triggered;
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
      prev.map(c => (c.id === cardId ? { ...c, level: c.level + 1 } : c))
    );
    return true;
  };

  const recordScenarioResult = (
    dqi: number,
    xp: number,
    gold: number,
    scenarioTitle: string,
    actions: { labelRu: string; isPositive: boolean }[],
    newCardId?: string,
    combos?: CardSynergy[]
  ) => {
    playSound(combos && combos.length > 0 ? 'combo' : 'success');
    const unlockedCard = newCardId ? inventoryCards.find(c => c.id === newCardId) : undefined;
    
    setPlayerStats(prev => {
      const newXp = prev.xp + xp;
      const leveledUp = newXp >= prev.nextLevelXp;
      return {
        ...prev,
        xp: leveledUp ? newXp - prev.nextLevelXp : newXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        nextLevelXp: leveledUp ? Math.floor(prev.nextLevelXp * 1.25) : prev.nextLevelXp,
        gold: prev.gold + gold,
        scenariosCompleted: prev.scenariosCompleted + 1,
        decisionQualityAvg: Math.round(((prev.decisionQualityAvg * prev.scenariosCompleted) + dqi) / (prev.scenariosCompleted + 1)),
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
      synergiesTriggered: combos,
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
        skillPerks,
        soundEnabled,
        setSoundEnabled,
        masterVolume,
        setMasterVolume,
        resultsModal,
        setResultsModal,
        conceptModalOpen,
        setConceptModalOpen,
        settingsModalOpen,
        setSettingsModalOpen,
        inspectedCard,
        setInspectedCard,
        equipCard,
        unequipCard,
        toggleEquipPerk,
        upgradeSkill,
        upgradeCard,
        recordScenarioResult,
        playSound,
        checkDeckSynergies,
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
