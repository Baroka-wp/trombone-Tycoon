import React from 'react';
import { GameState } from '../types';
import { formatCurrency } from '../utils/formatters';

const ProductionFunnel: React.FC<{demand: number, capacity: number, sales: number}> = ({ demand, capacity, sales }) => {
    const maxVal = Math.max(demand, capacity, 1);
    const demandWidth = (demand / maxVal) * 100;
    const capacityWidth = (capacity / maxVal) * 100;
    const salesWidth = (sales / maxVal) * 100;

    const bottleneck = capacity < demand ? "production" : "demand";

    return (
        <div className="space-y-4 text-sm">
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <span className="w-32 text-right font-medium text-slate-400">Demande Marché</span>
                    <div className="flex-1 bg-slate-700 rounded-md h-7 p-0.5">
                        <div className="bg-purple-500 h-full rounded-sm flex items-center justify-end px-2" style={{width: `clamp(10%, ${demandWidth}%, 100%)`}}>
                            <span className="font-bold text-white">{demand}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <span className="w-32 text-right font-medium text-slate-400">Capacité Usine</span>
                    <div className="flex-1 bg-slate-700 rounded-md h-7 p-0.5">
                        <div className="bg-amber-500 h-full rounded-sm flex items-center justify-end px-2" style={{width: `clamp(10%, ${capacityWidth}%, 100%)`}}>
                            <span className="font-bold text-white">{capacity}</span>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <span className="w-32 text-right font-medium text-slate-400">Ventes Réalisées</span>
                    <div className="flex-1 bg-slate-700 rounded-md h-7 p-0.5">
                        <div className="bg-sky-500 h-full rounded-sm flex items-center justify-end px-2" style={{width: `clamp(10%, ${salesWidth}%, 100%)`}}>
                            <span className="font-bold text-white">{sales}</span>
                        </div>
                    </div>
                </div>
            </div>
            {bottleneck === 'production' && sales < demand && (
                <p className="text-center text-xs text-yellow-300 bg-yellow-500/10 py-1 px-2 rounded-md">
                    💡 Votre capacité de production est inférieure à la demande. Vous manquez des ventes !
                </p>
            )}
             {bottleneck === 'demand' && capacity > sales && (
                <p className="text-center text-xs text-yellow-300 bg-yellow-500/10 py-1 px-2 rounded-md">
                    💡 Votre usine produit plus que ce que le marché ne demande. Baissez les prix ou augmentez le marketing.
                </p>
            )}
        </div>
    );
}

interface DashboardProps {
  gameState: GameState;
}

const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  const { productionCapacity, unitsSold, demand, utilizationRate } = gameState;
  
  const utilizationColor = utilizationRate < 50 ? 'text-yellow-400' : utilizationRate > 90 ? 'text-green-400' : 'text-indigo-400';

  return (
    <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-300">Aperçu Opérationnel</h2>
                <div title="Mesure d'efficacité (Ventes / Production). Une faible utilisation signifie que vous payez pour des employés/lignes inactifs." className="text-right">
                    <h3 className="text-sm font-medium text-slate-400">Utilisation</h3>
                    <p className={`text-2xl font-bold ${utilizationColor}`}>{utilizationRate.toFixed(0)}%</p>
                </div>
            </div>
            <ProductionFunnel
                demand={demand}
                capacity={productionCapacity}
                sales={unitsSold}
            />
        </div>
    </div>
  );
};

export default Dashboard;