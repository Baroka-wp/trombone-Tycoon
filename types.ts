export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  duration: number; // The original total duration
  durationRemaining: number;
  type: 'positive' | 'negative';
}

export type ToastType = 'error' | 'warning' | 'info' | 'success';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export interface GameState {
  gameCycle: number;
  cash: number;
  price: number;
  marketingBudget: number;
  workers: number;
  assemblyLines: number;
  dividendsPaid: number;
  investorConfidence: number;
  debt: number;
  
  // Calculated values
  productionCapacity: number;
  demand: number;
  unitsSold: number;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  profitPerCycle: number;
  utilizationRate: number;
  unmetDemand: number;
  alerts: string[];
  activeEvent: RandomEvent | null;
}

export interface ProfitData {
  cycle: number;
  profit: number;
}