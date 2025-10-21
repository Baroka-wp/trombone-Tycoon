import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, ProfitData, Toast, ToastType } from './types';
import { INITIAL_GAME_STATE, MAX_PROFIT_HISTORY, LOCAL_STORAGE_KEY } from './constants';
import { useGameLoop } from './hooks/useGameLoop';
import { getAlertTypeFromMessage } from './utils/alertUtils';

// Components
import Dashboard from './components/Dashboard';
import ProfitChart from './components/ProfitChart';
import ToastContainer from './components/Toast';
import EventPanel from './components/EventPanel';
import InfoBar from './components/InfoBar';
import InfoMessageBar from './components/InfoMessageBar';
import ManagementTabs from './components/ManagementTabs';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        // Basic validation to prevent malformed state
        const parsed = JSON.parse(savedState);
        if (typeof parsed.cash === 'number' && typeof parsed.gameCycle === 'number') {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load or parse saved game state:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return INITIAL_GAME_STATE;
  });

  const [profitHistory, setProfitHistory] = useState<ProfitData[]>([]);
  const [isPaused, setIsPaused] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [infoMessages, setInfoMessages] = useState<string[]>([]);

  const isGameOver = useMemo(() => gameState.cash <= 0, [gameState.cash]);

  useEffect(() => {
    if (isGameOver) {
      setIsPaused(true);
    }
  }, [isGameOver]);
  
  const addToast = useCallback((message: string, type: ToastType) => {
    setToasts(prev => {
        if (prev.some(t => t.message === message)) return prev;
        return [...prev, { id: Date.now() + Math.random(), message, type }]
    });
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleTick = useCallback((newState: GameState) => {
    setGameState(newState);
    
    setProfitHistory(prev => {
      const newHistory = [...prev, { cycle: newState.gameCycle, profit: newState.profitPerCycle }];
      if (newHistory.length > MAX_PROFIT_HISTORY) {
        return newHistory.slice(newHistory.length - MAX_PROFIT_HISTORY);
      }
      return newHistory;
    });

    const infoAlerts = newState.alerts.filter(msg => getAlertTypeFromMessage(msg) === 'info');
    const otherAlerts = newState.alerts.filter(msg => getAlertTypeFromMessage(msg) !== 'info');

    setInfoMessages(prev => JSON.stringify(prev) === JSON.stringify(infoAlerts) ? prev : infoAlerts);
    
    otherAlerts.forEach(alertMsg => {
      const alertType = getAlertTypeFromMessage(alertMsg);
      addToast(alertMsg, alertType);
    });
    
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
        console.error("Failed to save game state:", error);
        addToast("Erreur de sauvegarde de la partie", "error");
    }

  }, [addToast]);

  useGameLoop(gameState, handleTick, isPaused || isGameOver);

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir recommencer ? Votre progression sera perdue.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setGameState(INITIAL_GAME_STATE);
      setProfitHistory([]);
      setToasts([]);
      setInfoMessages([]);
      setIsPaused(true);
    }
  };

  const togglePause = () => {
    if(!isGameOver) {
       setIsPaused(prev => !prev);
    }
  };
  
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <InfoBar 
            gameCycle={gameState.gameCycle}
            isPaused={isPaused}
            isGameOver={isGameOver}
            onPauseToggle={togglePause}
            onReset={handleReset}
        />
      </header>
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <EventPanel event={gameState.activeEvent} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             <ManagementTabs 
                gameState={gameState} 
                setGameState={setGameState} 
                isGameOver={isGameOver} 
             />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl">
               <h2 className="text-xl font-semibold text-slate-300 mb-4">Historique des Bénéfices</h2>
               <InfoMessageBar messages={infoMessages} />
               <ProfitChart data={profitHistory} />
            </div>
            <Dashboard gameState={gameState} />
          </div>
        </div>

        {isGameOver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg shadow-2xl text-center border-2 border-red-500/50">
              <h2 className="text-4xl font-bold text-red-500 mb-4">FAILLITE</h2>
              <p className="text-lg mb-6">Votre entreprise n'a plus de trésorerie.</p>
              <button onClick={handleReset} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500">
                Recommencer
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;