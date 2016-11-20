const collectEnergy = require('job.collectEnergy');

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    switch (creep.memory.job) {
      case 'upgrade':
        if (creep.carry.energy == 0) {
          creep.memory.job = 'harvest';
          creep.say('harvesting');
          break;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
        break;
      case 'harvest':
      default:
        if (creep.carry.energy === creep.carryCapacity) {
          creep.memory.job = 'upgrade';
          creep.say('upgrading');
          break;
        }

        collectEnergy(creep);
        break;
    }
  },
  bodies: {
    base: [WORK,CARRY,MOVE],
    extend: [WORK, WORK, CARRY, MOVE],
  }

};
