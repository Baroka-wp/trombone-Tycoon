import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './icons/Icons';

interface InfoBarProps {
  gameCycle: number;
  isPaused: boolean;
  isGameOver: boolean;
  onPauseToggle: () => void;
  onReset: () => void;
}

const InfoBar: React.FC<InfoBarProps> = ({ gameCycle, isPaused, isGameOver, onPauseToggle, onReset }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
                 <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Trombone Tycoon</h1>
                    <p className="text-sm text-slate-400">Cycle: <span className="font-bold text-slate-200">{gameCycle.toLocaleString()}</span></p>
                </div>
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={onPauseToggle}
                    disabled={isGameOver}
                    className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
                    aria-label={isPaused ? "Démarrer" : "Pause"}
                    title={isPaused ? "Démarrer" : "Pause"}
                >
                    {isPaused ? <PlayIcon className="h-6 w-6" /> : <PauseIcon className="h-6 w-6" />}
                </button>
                <button
                    onClick={onReset}
                    className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500"
                    aria-label="Réinitialiser la partie"
                    title="Réinitialiser la partie"
                >
                    <ResetIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default InfoBar;
