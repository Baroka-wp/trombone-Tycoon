import { GameState } from './types';

export const GAME_TICK_MS = 2000; // 2 seconds per game cycle
export const MAX_PROFIT_HISTORY = 50;

// --- Initial State ---
export const INITIAL_GAME_STATE: GameState = {
  gameCycle: 0,
  cash: 1000,
  price: 15,
  marketingBudget: 0,
  workers: 1,
  assemblyLines: 1,
  dividendsPaid: 0,
  investorConfidence: 0,
  debt: 0,
  
  // Calculated values - will be updated on first tick
  productionCapacity: 0,
  demand: 0,
  unitsSold: 0,
  revenue: 0,
  variableCosts: 0,
  fixedCosts: 0,
  profitPerCycle: 0,
  utilizationRate: 0,
  unmetDemand: 0,
  alerts: ["Bienvenue chez Magnat du Trombone ! Embauchez des employés et achetez des lignes pour démarrer la production."],
  activeEvent: null,
  nextEventCycle: 40 + Math.floor(Math.random() * 30), // Schedule first event between cycle 40-70
};


// --- Economic Parameters ---

// Demand Calculation
export const BASE_DEMAND = 50;
export const IDEAL_PRICE = 12;

// Production
export const TROMBONES_PER_LINE_PER_WORKER = 10;
export const WORKERS_PER_LINE = 1;
export const RAW_MATERIAL_COST_PER_TROMBONE = 4;

// Costs
export const WORKER_COST = 250; // One-time hiring cost
export const WORKER_SALARY = 20; // Per cycle
export const LINE_COST = 800; // One-time purchase cost
export const LINE_INFRASTRUCTURE_COST = 15; // Per cycle (electricity, maintenance)

// Investment & Debt
export const INTEREST_RATE = 0.05; // 5% per cycle
export const DIVIDEND_TO_CONFIDENCE_RATIO = 1000; // For every $1000 in dividends, confidence +1
export const INVESTOR_CAPITAL_MULTIPLIER = 5000; // Each confidence point unlocks $5000 in credit

export const LOCAL_STORAGE_KEY = 'tromboneTycoonState';