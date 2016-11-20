const collectEnergy = require('job.collectEnergy');
const CONF = require('conf').GENERAL;

module.exports = {
  run: function(creep) {

    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.say('harvesting');
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      creep.memory.building = true;
      creep.say('building');
    }

    if (creep.memory.building) {
      var target = creep.pos[CONF.PATHFINDING](FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    } else {
      collectEnergy(creep);
    }
  },
  bodies: {
    default: [WORK,CARRY,MOVE],
    base: [WORK,CARRY,MOVE],
    extend: [WORK, WORK, CARRY, MOVE],
  }
}
