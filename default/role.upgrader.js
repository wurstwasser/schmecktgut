const collectEnergy = require('job.collectEnergy');

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.job === undefined) creep.memory.job = 'harvest';
    if (creep.memory.job === 'upgrade' && creep.carry.energy == 0) {
      creep.memory.job = 'harvest';
      creep.say('harvesting');
    } else if (creep.memory.job === 'harvest' && creep.carry.energy === creep.carryCapacity) {
      creep.memory.job = 'upgrade';
      creep.say('upgrading');
    }
    
    switch (creep.memory.job) {
      case 'upgrade':
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
        break;
      case 'harvest':
      default:
        collectEnergy(creep);
        break;
    }
  },
  bodies: {
    base: [WORK,CARRY,MOVE],
    extend: [WORK, WORK, CARRY, MOVE],
  }

};
