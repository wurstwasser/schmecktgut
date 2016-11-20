const collectEnergy = require('job.collectEnergy');

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {
    const spawn = creep.memory.spawn;

    if (creep.carry.energy < creep.carryCapacity) {
      collectEnergy(creep);
    } else if (Game.spawns[spawn].energy < Game.spawns[spawn].energyCapacity) {
      if (creep.transfer(Game.spawns[spawn], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns[spawn]);
      }
    } else {
      return -1;
    }
  },
  bodies: {
    default: [WORK,CARRY,MOVE],
    base: [WORK,CARRY,MOVE],
    extend: [WORK, WORK, CARRY, MOVE],
  }
};
