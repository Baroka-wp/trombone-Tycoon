import { useEffect } from 'react';
import { GameState } from '../types';
import { 
  GAME_TICK_MS, 
  BASE_DEMAND, 
  IDEAL_PRICE, 
  TROMBONES_PER_LINE_PER_WORKER,
  WORKERS_PER_LINE,
  RAW_MATERIAL_COST_PER_TROMBONE,
  WORKER_SALARY,
  LINE_INFRASTRUCTURE_COST,
  INTEREST_RATE
} from '../constants';
import { RANDOM_EVENTS } from '../events';

export const useGameLoop = (
  gameState: GameState, 
  onTick: (newState: GameState) => void,
  isPaused: boolean
) => {
  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = setInterval(() => {
      // --- Create a mutable copy of the state for calculations ---
      const newState = { ...gameState };
      newState.gameCycle += 1;
      
      const newAlerts: string[] = [];

      // --- 1. Handle Random Events ---
      if (newState.activeEvent) {
        // Event is active, decrement its duration
        newState.activeEvent = { ...newState.activeEvent, durationRemaining: newState.activeEvent.durationRemaining - 1 };
        
        if (newState.activeEvent.durationRemaining <= 0) {
          // Event just ended
          newAlerts.push(`✅ Événement terminé : ${newState.activeEvent.title}`);
          newState.activeEvent = null;

          // Schedule the next event
          const minCooldown = 40;
          const windowSize = 30; // 70 - 40
          newState.nextEventCycle = newState.gameCycle + minCooldown + Math.floor(Math.random() * windowSize);
        }
      } else {
        // No active event, check if it's time to trigger a new one
        if (newState.gameCycle >= newState.nextEventCycle) {
          const eventTemplate = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
          newState.activeEvent = {
            ...eventTemplate,
            durationRemaining: eventTemplate.duration,
          };
          const icon = newState.activeEvent.type === 'positive' ? '🎉' : '💥';
          newAlerts.push(`${icon} Nouvel événement : ${newState.activeEvent.title}`);
          
          // Set nextEventCycle to infinity to prevent re-triggering until the current event ends
          newState.nextEventCycle = Infinity;
        }
      }

      // --- 2. Apply Event Effects and Get Effective Constants ---
      let effectiveBaseDemand = BASE_DEMAND;
      let effectiveTrombonesPerLine = TROMBONES_PER_LINE_PER_WORKER;
      let effectiveRawMaterialCost = RAW_MATERIAL_COST_PER_TROMBONE;
      let effectiveWorkerSalary = WORKER_SALARY;

      if (newState.activeEvent) {
        switch (newState.activeEvent.id) {
          case 'RAW_MATERIAL_HIKE':
            effectiveRawMaterialCost *= 1.5;
            break;
          case 'RECESSION':
            effectiveBaseDemand *= 0.6;
            break;
          case 'WORKER_STRIKE':
            effectiveWorkerSalary *= 2;
            break;
          case 'PRODUCTIVITY_BOOST':
            effectiveTrombonesPerLine *= 1.25;
            break;
          case 'ECONOMIC_BOOM':
            effectiveBaseDemand *= 1.5;
            break;
          case 'RAW_MATERIAL_SURPLUS':
            effectiveRawMaterialCost *= 0.7;
            break;
        }
      }

      // --- 3. Calculate Demand ---
      const priceRatio = newState.price / IDEAL_PRICE;
      const priceFactor = Math.max(0, 1 - Math.pow(priceRatio - 1, 2) * (priceRatio > 1 ? 2.5 : 0.5));
      const marketingFactor = 1 + (Math.sqrt(newState.marketingBudget) / 15);
      newState.demand = Math.floor(effectiveBaseDemand * priceFactor * marketingFactor);

      // --- 4. Calculate Production Capacity ---
      const effectiveWorkers = Math.min(newState.workers, newState.assemblyLines * WORKERS_PER_LINE);
      newState.productionCapacity = Math.floor(effectiveWorkers * effectiveTrombonesPerLine);
      
      // --- 5. Calculate Actual Sales ---
      newState.unitsSold = Math.min(newState.demand, newState.productionCapacity);
      newState.unmetDemand = Math.max(0, newState.demand - newState.productionCapacity);

      // --- 6. Calculate Costs and Revenue ---
      newState.revenue = newState.unitsSold * newState.price;
      newState.variableCosts = newState.unitsSold * effectiveRawMaterialCost;
      
      const salaryCosts = newState.workers * effectiveWorkerSalary;
      const infrastructureCosts = newState.assemblyLines * LINE_INFRASTRUCTURE_COST;
      const interestCost = Math.floor(newState.debt * INTEREST_RATE);
      newState.fixedCosts = salaryCosts + infrastructureCosts + newState.marketingBudget + interestCost;
      
      // --- 7. Calculate Profit and update Cash ---
      newState.profitPerCycle = newState.revenue - newState.variableCosts - newState.fixedCosts;
      newState.cash += newState.profitPerCycle;

      // --- 8. Calculate other metrics ---
      newState.utilizationRate = newState.productionCapacity > 0 
        ? (newState.unitsSold / newState.productionCapacity) * 100 
        : 0;

      // --- 9. Generate Alerts (in addition to event alerts) ---
      if (newState.cash <= 0) {
        newAlerts.push("🚨 FAILLITE ! Votre trésorerie est à zéro. Fin de la partie.");
      } else if (newState.cash < newState.fixedCosts * 3) {
        newAlerts.push("🚨 ALERTE : Les réserves de trésorerie sont très basses !");
      }
      
      if (interestCost > 0 && newState.profitPerCycle < interestCost) {
        newAlerts.push(`⚠️ ATTENTION : Les intérêts de la dette (${interestCost.toLocaleString()}$) sont supérieurs à vos bénéfices !`);
      }

      if (newState.unmetDemand > 10) {
        newAlerts.push(`💡 ASTUCE : Vous avez manqué ${newState.unmetDemand} ventes ! Envisagez d'augmenter la production.`);
      }

      if (newState.utilizationRate < 50 && newState.productionCapacity > BASE_DEMAND / 2) {
        newAlerts.push(`⚠️ ATTENTION : La capacité de production est sous-utilisée. Baissez les prix ou augmentez le marketing.`);
      }

      newState.alerts = newAlerts;

      onTick(newState);

    }, GAME_TICK_MS);

    return () => clearInterval(intervalId);
  }, [gameState, onTick, isPaused]);
};