module.exports = {
  GENERAL: {
    PATHFINDING: 'findClosestByRange',
  },
  SPAWN: {
    ENERGY_CAP_RATIO: 0.8,
    MAX: {
      harvester: 6,
      builder: 7,
      upgrader: 3,
    },
    MIN: {
      harvester: 4,
      builder: 3,
      upgrader: 2,
    },
    PRIORITY: ['harvester', 'upgrader', 'builder'],
    RATIO: {
      harvester: 2,
      builder: 2,
      upgrader: 1,
    },
    RATIO_TOTAL: 4,
    RATIO_PRIORITY: ['harvester', 'builder', 'upgrader'],
  },
};
