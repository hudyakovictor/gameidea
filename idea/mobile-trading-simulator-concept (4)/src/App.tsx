import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/layout/TopBar';
import { BottomNav } from './components/layout/BottomNav';
import { LobbyScreen } from './components/screens/LobbyScreen';
import { BattlerScreen } from './components/screens/BattlerScreen';
import { MapScreen } from './components/screens/MapScreen';
import { AcademyScreen } from './components/screens/AcademyScreen';
import { PuzzleScreen } from './components/screens/PuzzleScreen';
import { StoryScreen } from './components/screens/StoryScreen';
import { DeckScreen } from './components/screens/DeckScreen';
import { SocialScreen } from './components/screens/SocialScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { StatsScreen } from './components/screens/StatsScreen';
import { GuildScreen } from './components/screens/GuildScreen';
import { AdminCrmScreen } from './components/screens/AdminCrmScreen';
import { ResultsModal } from './components/screens/ResultsModal';
import { ConceptGDDModal } from './components/screens/ConceptGDDModal';
import { SettingsModal } from './components/screens/SettingsModal';
import { CardInspectorModal } from './components/common/CardInspectorModal';

const GameViewport: React.FC = () => {
  const { currentScreen } = useGame();

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#040912] text-slate-100 flex items-center justify-center select-none">
      {/* Ambient background glows for desktop */}
      <div className="fixed inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#10253f_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Main Game Shell - Native Mobile/Tablet Aspect Ratio Container */}
      <div className="relative w-full h-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl bg-[#06101c] flex flex-col justify-between overflow-hidden sm:border-x sm:border-cyan-500/20 sm:shadow-2xl sm:shadow-cyan-950/80">
        {/* Top Game HUD */}
        <TopBar />

        {/* Screen Viewport with smooth AAA transition */}
        <main className="flex-1 overflow-hidden relative">
          <div key={currentScreen} className="h-full w-full animate-fadeIn">
            {currentScreen === 'lobby' && <LobbyScreen />}
            {currentScreen === 'battler' && <BattlerScreen />}
            {currentScreen === 'map' && <MapScreen />}
            {currentScreen === 'academy' && <AcademyScreen />}
            {currentScreen === 'puzzle' && <PuzzleScreen />}
            {currentScreen === 'story' && <StoryScreen />}
            {currentScreen === 'deck' && <DeckScreen />}
            {currentScreen === 'social' && <SocialScreen />}
            {currentScreen === 'profile' && <ProfileScreen />}
            {currentScreen === 'stats' && <StatsScreen />}
            {currentScreen === 'guild' && <GuildScreen />}
            {currentScreen === 'admin' && <AdminCrmScreen />}
          </div>
        </main>

        {/* Bottom Game Dock */}
        <BottomNav />

        {/* Floating System Modals */}
        <ResultsModal />
        <ConceptGDDModal />
        <SettingsModal />
        <CardInspectorModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameViewport />
    </GameProvider>
  );
}
