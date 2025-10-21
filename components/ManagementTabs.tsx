import React, { useState } from 'react';
import { GameState } from '../types';
import ControlPanel from './ControlPanel';
import DividendPanel from './DividendPanel';
import InvestmentPanel from './InvestmentPanel';
import { FactoryIcon, PriceIcon } from './icons/Icons';

interface ManagementTabsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  isGameOver: boolean;
}

type ActiveTab = 'operations' | 'strategy';

const ManagementTabs: React.FC<ManagementTabsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('operations');

  const baseButtonClass = "w-full text-center px-4 py-2.5 text-sm font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900";
  const activeButtonClass = "bg-sky-600 text-white shadow-lg";
  const inactiveButtonClass = "bg-slate-700 text-slate-300 hover:bg-slate-600";

  return (
    <div className="space-y-4">
      <div className="flex bg-slate-800/50 p-1 rounded-lg space-x-1">
        <button 
          onClick={() => setActiveTab('operations')} 
          className={`${baseButtonClass} ${activeTab === 'operations' ? activeButtonClass : inactiveButtonClass}`}
        >
          <span className="flex items-center justify-center"><FactoryIcon className="w-5 h-5 mr-2" />Opérations</span>
        </button>
        <button 
          onClick={() => setActiveTab('strategy')}
          className={`${baseButtonClass} ${activeTab === 'strategy' ? activeButtonClass : inactiveButtonClass}`}
        >
           <span className="flex items-center justify-center"><PriceIcon className="w-5 h-5 mr-2" />Stratégie</span>
        </button>
      </div>
      
      <div>
        {activeTab === 'operations' && (
          <div className="animate-fade-in">
            <ControlPanel {...props} />
          </div>
        )}
        {activeTab === 'strategy' && (
          <div className="animate-fade-in space-y-6">
            <DividendPanel {...props} />
            <InvestmentPanel {...props} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementTabs;