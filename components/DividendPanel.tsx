import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { DividendIcon } from './icons/Icons';
import { DIVIDEND_TO_CONFIDENCE_RATIO } from '../constants';
import FinancialMetricCard from './FinancialMetricCard';
import { formatCurrency } from '../utils/formatters';

interface DividendPanelProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    isGameOver: boolean;
}

const DividendPanel: React.FC<DividendPanelProps> = ({ gameState, setGameState, isGameOver }) => {
    const [amount, setAmount] = useState(100);

    // Effect to adjust slider amount if cash drops below it
    useEffect(() => {
        if (amount > gameState.cash) {
            setAmount(gameState.cash);
        }
    }, [gameState.cash, amount]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setAmount(value);
    };

    const payDividend = () => {
        if (amount > 0 && gameState.cash >= amount) {
            setGameState(prev => {
                const confidenceGained = Math.floor(amount / DIVIDEND_TO_CONFIDENCE_RATIO);
                return {
                    ...prev,
                    cash: prev.cash - amount,
                    dividendsPaid: prev.dividendsPaid + amount,
                    investorConfidence: prev.investorConfidence + confidenceGained,
                };
            });
            // Reset amount to a sensible default or max possible
            // FIX: Replaced `prev` with `gameState` which is in scope.
            // The logic correctly calculates the new cash value (`gameState.cash - amount`)
            // and resets the slider amount based on that.
            setAmount(Math.min(100, gameState.cash - amount));
        }
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl">
            <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-slate-300">
                    <DividendIcon className="w-6 h-6 mr-2 text-teal-400" />
                    Verser des Dividendes
                </h2>
                <p className="text-sm text-slate-400">Augmente votre score et la confiance des investisseurs.</p>
                
                <fieldset disabled={isGameOver} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="dividend" className="flex justify-between text-slate-300 font-medium">
                            <span>Montant:</span>
                            <span className="font-bold text-white">${amount.toLocaleString()}</span>
                        </label>
                        <input 
                            id="dividend" 
                            type="range" 
                            min="0" 
                            max={gameState.cash} 
                            step="100" 
                            value={amount} 
                            onChange={handleAmountChange} 
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500" 
                        />
                    </div>

                    <button 
                        onClick={payDividend} 
                        disabled={amount <= 0 || gameState.cash < amount}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Verser ${amount.toLocaleString()}
                    </button>
                </fieldset>
            </div>
             <div className="mt-4 pt-4 border-t border-slate-700">
                <FinancialMetricCard 
                    title="Dividendes (Score)"
                    value={formatCurrency(gameState.dividendsPaid)}
                    colorClass="text-teal-400"
                    tooltip="Votre score ! C'est le total des bénéfices que vous avez extraits de l'entreprise."
                    icon={<DividendIcon />}
                />
            </div>
        </div>
    );
};

export default DividendPanel;