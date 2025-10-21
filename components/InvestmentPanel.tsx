import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { ConfidenceIcon, DebtIcon, CashIcon } from './icons/Icons';
import { INVESTOR_CAPITAL_MULTIPLIER, INTEREST_RATE } from '../constants';
import FinancialMetricCard from './FinancialMetricCard';
import { formatCurrency } from '../utils/formatters';

interface InvestmentPanelProps {
    gameState: GameState;
    setGameState: React.Dispatch<React.SetStateAction<GameState>>;
    isGameOver: boolean;
}

const InvestmentPanel: React.FC<InvestmentPanelProps> = ({ gameState, setGameState, isGameOver }) => {
    const { cash, debt, investorConfidence } = gameState;
    const maxCreditLine = investorConfidence * INVESTOR_CAPITAL_MULTIPLIER;
    const availableCredit = maxCreditLine - debt;
    
    const [borrowAmount, setBorrowAmount] = useState(0);
    const [repayAmount, setRepayAmount] = useState(0);

    useEffect(() => {
        if (borrowAmount > availableCredit) setBorrowAmount(availableCredit);
    }, [availableCredit, borrowAmount]);

    useEffect(() => {
        const maxRepay = Math.min(debt, cash);
        if (repayAmount > maxRepay) setRepayAmount(maxRepay);
    }, [cash, debt, repayAmount]);
    
    const handleBorrow = () => {
        if (borrowAmount > 0 && borrowAmount <= availableCredit) {
            setGameState(prev => ({
                ...prev,
                cash: prev.cash + borrowAmount,
                debt: prev.debt + borrowAmount,
            }));
            setBorrowAmount(0);
        }
    };

    const handleRepay = () => {
        if (repayAmount > 0 && repayAmount <= cash && repayAmount <= debt) {
            setGameState(prev => ({
                ...prev,
                cash: prev.cash - repayAmount,
                debt: prev.debt - repayAmount,
            }));
            setRepayAmount(0);
        }
    };

    const interestCostPerCycle = Math.floor(debt * INTEREST_RATE);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl">
            <div className="space-y-4">
                <h2 className="flex items-center text-xl font-semibold text-slate-300">
                    <ConfidenceIcon className="w-6 h-6 mr-2 text-yellow-400" />
                    Investissement & Dette
                </h2>
                <div className="text-sm text-slate-400 space-y-1">
                    <p>Utilisez votre confiance pour emprunter de l'argent et accélérer votre croissance. Attention aux intérêts !</p>
                    <p>Coût des intérêts / cycle : <span className="font-bold text-red-400">${interestCostPerCycle.toLocaleString()}</span> ({(INTEREST_RATE * 100).toFixed(0)}%)</p>
                    <p>Ligne de crédit max : <span className="font-bold text-yellow-300">${maxCreditLine.toLocaleString()}</span></p>
                </div>

                <fieldset disabled={isGameOver} className="space-y-6 pt-2">
                    {/* Borrowing Section */}
                    <div className="space-y-2">
                        <label htmlFor="borrow" className="flex justify-between text-slate-300 font-medium">
                            <span>Emprunter (Crédit dispo: ${availableCredit.toLocaleString()})</span>
                            <span className="font-bold text-white">${borrowAmount.toLocaleString()}</span>
                        </label>
                        <input 
                            id="borrow" type="range" min="0" max={Math.max(0, availableCredit)} step="1000" 
                            value={borrowAmount} 
                            onChange={(e) => setBorrowAmount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                        />
                        <button 
                            onClick={handleBorrow} disabled={borrowAmount <= 0}
                            className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-700 disabled:text-slate-500"
                        >
                            Emprunter
                        </button>
                    </div>

                    {/* Repaying Section */}
                    <div className="space-y-2">
                        <label htmlFor="repay" className="flex justify-between text-slate-300 font-medium">
                            <span>Rembourser (Dette: ${debt.toLocaleString()})</span>
                            <span className="font-bold text-white">${repayAmount.toLocaleString()}</span>
                        </label>
                         <input 
                            id="repay" type="range" min="0" max={Math.min(debt, cash)} step="100" 
                            value={repayAmount} 
                            onChange={(e) => setRepayAmount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" 
                        />
                        <button 
                            onClick={handleRepay} disabled={repayAmount <= 0}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-700 disabled:text-slate-500"
                        >
                            Rembourser
                        </button>
                    </div>
                </fieldset>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 space-y-3">
                 <FinancialMetricCard 
                    title="Trésorerie"
                    value={formatCurrency(cash)}
                    colorClass={cash > 0 ? 'text-green-400' : 'text-red-400'}
                    tooltip="Argent total disponible. Si cela atteint zéro, vous êtes en faillite !"
                    icon={<CashIcon />}
                />
                <FinancialMetricCard 
                    title="Confiance Investisseur"
                    value={investorConfidence.toString()}
                    colorClass="text-yellow-400"
                    tooltip="Votre réputation auprès des investisseurs. Augmente avec les dividendes versés et débloque des crédits."
                    icon={<ConfidenceIcon />}
                />
                 <FinancialMetricCard 
                    title="Dette"
                    value={formatCurrency(debt)}
                    colorClass={debt > 0 ? 'text-red-400' : 'text-slate-300'}
                    tooltip="Argent emprunté. Génère des intérêts à chaque cycle !"
                    icon={<DebtIcon />}
                />
            </div>
        </div>
    );
};

export default InvestmentPanel;