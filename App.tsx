
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import DiaryView from './pages/DiaryView';
import Evidence from './pages/Evidence';
import Notebook from './pages/Notebook';
import Records from './pages/Records';
import Final from './pages/Final';
import Intro from './pages/Intro';
import { GameState } from './types';

const GameRouter: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  glitch: boolean;
}> = ({ gameState, setGameState, glitch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (gameState.ending_triggered && location.pathname !== '/final') {
      navigate('/final');
    }
  }, [gameState.ending_triggered, navigate, location.pathname]);

  const canAccessRecords = gameState.unlockedModules.includes('records');
  const canAccessEvidence = gameState.unlockedModules.includes('evidence');
  const isEndingActive = !!gameState.ending_triggered;
  
  const instability = (gameState.foundContradictionIds.length / 8);

  if (!gameState.intro_complete && !isEndingActive) {
    return <Intro setGameState={setGameState} />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${glitch ? 'grayscale brightness-105 contrast-105' : ''}`}>
      {!isEndingActive && (
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold tracking-widest text-gray-100 hover:text-blue-300 transition-colors mono">
              SYSLOG-0924
            </Link>
            <div className="hidden md:flex space-x-6 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Link to="/diaries" className="text-gray-400 hover:text-white transition-colors">档案库</Link>
              <Link to="/records" className={`transition-colors ${canAccessRecords ? 'text-gray-400 hover:text-white' : 'text-gray-800 pointer-events-none'}`}>资料</Link>
              <Link to="/notebook" className="text-gray-400 hover:text-white transition-colors">手记</Link>
              <Link to="/evidence" className={`transition-colors ${canAccessEvidence ? 'text-blue-400 hover:text-blue-300' : 'text-gray-800 pointer-events-none'}`}>取证</Link>
            </div>
          </div>
          <div className="text-[9px] mono text-gray-600 hidden sm:block">
            {instability > 0.8 ? <span className="text-red-500 animate-pulse">CRITICAL_MEMORY_SYNC</span> : `PROTOCOL_v4.5.0`}
          </div>
        </nav>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home unlockedModules={gameState.unlockedModules} />} />
          <Route path="/diaries" element={<DiaryView gameState={gameState} setGameState={setGameState} />} />
          <Route path="/records" element={<Records gameState={gameState} />} />
          <Route path="/evidence" element={<Evidence gameState={gameState} setGameState={setGameState} />} />
          <Route path="/notebook" element={<Notebook gameState={gameState} />} />
          <Route path="/final" element={<Final gameState={gameState} setGameState={setGameState} />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [glitch, setGlitch] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('case0924_state');
    return saved ? JSON.parse(saved) : { 
      tags: {}, 
      unlockedModules: [], 
      lastContradictionId: null,
      foundContradictionIds: [],
      trust_yin: 0,
      trust_chen: 0,
      anomalies_found: 0,
      ending_triggered: null,
      intro_complete: false,
      deep_scan_level: 0,
      discovered_clue_ids: []
    };
  });

  useEffect(() => {
    localStorage.setItem('case0924_state', JSON.stringify(gameState));
    if (gameState.anomalies_found >= 3 && !gameState.unlockedModules.includes('records')) {
      setGameState(prev => ({ ...prev, unlockedModules: [...prev.unlockedModules, 'records', 'evidence'] }));
    }
  }, [gameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.999) { // 大幅降低抖动频率
        setGlitch(true);
        setTimeout(() => setGlitch(false), 30);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <GameRouter gameState={gameState} setGameState={setGameState} glitch={glitch} />
    </Router>
  );
};

export default App;
