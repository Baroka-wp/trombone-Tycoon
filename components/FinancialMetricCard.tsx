import React from 'react';
import { CashIcon, DividendIcon, ProfitIcon, LossIcon, ConfidenceIcon, DebtIcon } from './icons/Icons';

// FIX: Correctly typed the `icon` prop to `React.ReactElement<React.SVGProps<SVGSVGElement>>`.
// This ensures TypeScript knows that the cloned element can accept SVG properties like `className`, fixing the type error on React.cloneElement.
const FinancialMetricCard: React.FC<{ title: string; value: string; colorClass?: string; tooltip: string; icon: React.ReactElement<React.SVGProps<SVGSVGElement>> }> = ({ title, value, colorClass = 'text-white', tooltip, icon }) => (
  <div title={tooltip} className="bg-slate-800 p-4 rounded-lg shadow-lg flex items-center space-x-4 transition-transform duration-200 hover:scale-105">
    <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('-400', '-500/20').replace('-300', '-500/20')}`}>
      {/* FIX: Removed unnecessary cast as 'icon' prop type is now correct */}
      {React.cloneElement(icon, { className: `w-7 h-7 ${colorClass}` })}
    </div>
    <div>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  </div>
);

export default FinancialMetricCard;