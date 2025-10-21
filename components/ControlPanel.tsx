import React from 'react';
import { GameState } from '../types';
import { WORKER_COST, LINE_COST } from '../constants';
import { PriceIcon, MarketingIcon, WorkerIcon, FactoryIcon, CashIcon, ProfitIcon, LossIcon } from './icons/Icons';
import FinancialMetricCard from './FinancialMetricCard';
import { formatCurrency } from '../utils/formatters';

interface ControlPanelProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    isGameOver: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ gameState, setGameState, isGameOver }) => {
    
    const baseButtonClass = "px-4 py-2 rounded-md font-bold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800";
    const actionButtonClass = "bg-slate-600 hover:bg-slate-500 text-white disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed";

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameState(prev => ({ ...prev, price: Number(e.target.value) }));
    };

    const handleMarketingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameState(prev => ({ ...prev, marketingBudget: Number(e.target.value) }));
    };

    const hireWorker = () => {
        if (gameState.cash >= WORKER_COST) {
            setGameState(prev => ({
                ...prev,
                workers: prev.workers + 1,
                cash: prev.cash - WORKER_COST,
            }));
        }
    };

    const fireWorker = () => {
        if (gameState.workers > 0) {
            setGameState(prev => ({ ...prev, workers: prev.workers - 1 }));
        }
    };

    const buyAssemblyLine = () => {
        if (gameState.cash >= LINE_COST) {
            setGameState(prev => ({
                ...prev,
                assemblyLines: prev.assemblyLines + 1,
                cash: prev.cash - LINE_COST,
            }));
        }
    };

    const sellAssemblyLine = () => {
        if (gameState.assemblyLines > 0) {
            setGameState(prev => ({
                ...prev,
                assemblyLines: prev.assemblyLines - 1,
                cash: prev.cash + LINE_COST * 0.5, // sell for half price
            }));
        }
    };

    const { cash, profitPerCycle } = gameState;
    const profitColor = profitPerCycle > 0 ? 'text-green-400' : profitPerCycle < 0 ? 'text-red-400' : 'text-slate-300';
    const profitIcon = profitPerCycle >= 0 ? <ProfitIcon /> : <LossIcon />;

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-slate-300 mb-6">Panneau de Contrôle</h2>

            <fieldset disabled={isGameOver} className="space-y-6">
                {/* Price Control */}
                <div className="space-y-2">
                    <label htmlFor="price" className="flex items-center text-slate-300 font-medium">
                        <PriceIcon className="w-5 h-5 mr-2 text-sky-400" />
                        <span>Prix de Vente: <span className="font-bold text-white">${gameState.price}</span></span>
                    </label>
                    <input id="price" type="range" min="1" max="50" value={gameState.price} onChange={handlePriceChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500" />
                </div>

                {/* Marketing Control */}
                <div className="space-y-2">
                    <label htmlFor="marketing" className="flex items-center text-slate-300 font-medium">
                        <MarketingIcon className="w-5 h-5 mr-2 text-purple-400" />
                        <span>Budget Marketing / Cycle: <span className="font-bold text-white">${gameState.marketingBudget}</span></span>
                    </label>
                    <input id="marketing" type="range" min="0" max="500" step="10" value={gameState.marketingBudget} onChange={handleMarketingChange} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                </div>

                {/* Workforce Control */}
                <div className="space-y-3">
                    <h3 className="flex items-center text-slate-300 font-medium"><WorkerIcon className="w-5 h-5 mr-2 text-amber-400" />Main-d'œuvre</h3>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-md">
                        <span className="font-bold text-lg">{gameState.workers} Employés</span>
                        <div className="flex space-x-2">
                            <button onClick={fireWorker} disabled={gameState.workers <= 0} className={`${baseButtonClass} ${actionButtonClass}`}>-</button>
                            <button onClick={hireWorker} disabled={gameState.cash < WORKER_COST} className={`${baseButtonClass} ${actionButtonClass}`}>+</button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">Coût d'embauche : ${WORKER_COST.toLocaleString()}</p>
                </div>

                {/* Production Control */}
                <div className="space-y-3">
                    <h3 className="flex items-center text-slate-300 font-medium"><FactoryIcon className="w-5 h-5 mr-2 text-indigo-400" />Production</h3>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-md">
                        <span className="font-bold text-lg">{gameState.assemblyLines} Lignes</span>
                        <div className="flex space-x-2">
                            <button onClick={sellAssemblyLine} disabled={gameState.assemblyLines <= 0} className={`${baseButtonClass} ${actionButtonClass}`}>-</button>
                            <button onClick={buyAssemblyLine} disabled={gameState.cash < LINE_COST} className={`${baseButtonClass} ${actionButtonClass}`}>+</button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">Coût par Ligne : ${LINE_COST.toLocaleString()} | Vente : ${(LINE_COST / 2).toLocaleString()}</p>
                </div>
            </fieldset>

            <div className="mt-6 pt-4 border-t border-slate-700 space-y-3">
                <FinancialMetricCard 
                    title="Trésorerie"
                    value={formatCurrency(cash)}
                    colorClass={cash > 0 ? 'text-green-400' : 'text-red-400'}
                    tooltip="Argent total disponible. Si cela atteint zéro, vous êtes en faillite !"
                    icon={<CashIcon />}
                />
                <FinancialMetricCard 
                    title="Bénéfice / Cycle"
                    value={formatCurrency(profitPerCycle)}
                    colorClass={profitColor}
                    tooltip="Revenus - Coûts. Un bénéfice positif augmente votre trésorerie."
                    icon={profitIcon}
                />
            </div>
        </div>
    );
};

export default ControlPanel;