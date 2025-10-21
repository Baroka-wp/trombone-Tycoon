import { RandomEvent } from './types';

// Omit durationRemaining, as it will be set when the event is triggered.
type EventTemplate = Omit<RandomEvent, 'durationRemaining'>;

export const RANDOM_EVENTS: EventTemplate[] = [
  {
    id: 'RAW_MATERIAL_HIKE',
    title: "Crise de la chaîne d'approvisionnement !",
    description: "Des pénuries mondiales ont augmenté le coût du laiton. Le coût des matières premières augmente de 50% pour une durée limitée.",
    duration: 20,
    type: 'negative',
  },
  {
    id: 'RECESSION',
    title: 'Récession Économique',
    description: "Une récession a frappé et les consommateurs ont moins de revenus disponibles. La demande du marché a chuté de 40%.",
    duration: 30,
    type: 'negative',
  },
  {
    id: 'WORKER_STRIKE',
    title: 'Grève des employés !',
    description: "Vos employés demandent un meilleur salaire. Les salaires sont doublés jusqu'à ce qu'un accord soit trouvé.",
    duration: 15,
    type: 'negative',
  },
  {
    id: 'PRODUCTIVITY_BOOST',
    title: 'Innovation Révolutionnaire !',
    description: "Votre équipe a découvert une nouvelle technique de fabrication ! La production par ligne augmente de 25%.",
    duration: 25,
    type: 'positive',
  },
  {
    id: 'ECONOMIC_BOOM',
    title: 'Boom Économique !',
    description: "L'économie est florissante et tout le monde veut un trombone ! La demande du marché a bondi de 50%.",
    duration: 25,
    type: 'positive',
  },
  {
    id: 'RAW_MATERIAL_SURPLUS',
    title: 'Excédent de Matières Premières',
    description: "Un nouveau fournisseur de laiton est entré sur le marché, faisant baisser les prix. Le coût des matières premières a diminué de 30%.",
    duration: 20,
    type: 'positive',
  },
];