import React from 'react';
import { RandomEvent } from '../types';

interface EventPanelProps {
  event: RandomEvent | null;
}

const EventPanel: React.FC<EventPanelProps> = ({ event }) => {
  if (!event) {
    return null;
  }

  const isPositive = event.type === 'positive';
  const borderColor = isPositive ? 'border-green-500' : 'border-red-500';
  const bgColor = isPositive ? 'bg-green-500/10' : 'bg-red-500/10';
  const textColor = isPositive ? 'text-green-300' : 'text-red-300';
  const progressBg = isPositive ? 'bg-green-500' : 'bg-red-500';
  const progress = (event.durationRemaining / event.duration) * 100;

  return (
    <div className={`p-4 rounded-lg shadow-xl border-2 ${borderColor} ${bgColor} mb-6 transition-all duration-500`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`text-xl font-bold ${textColor}`}>{event.title}</h2>
        <span className="text-sm font-semibold text-slate-300">
          {event.durationRemaining} cycles restants
        </span>
      </div>
      <p className="text-slate-300 mb-3">{event.description}</p>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={`${progressBg} h-2.5 rounded-full transition-all duration-1000 ease-linear`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EventPanel;