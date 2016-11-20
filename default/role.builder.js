const collectEnergy = require('job.collectEnergy');

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
      var targets = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    } else {
      collectEnergy(creep);
    }
  },
  bodies: {
    default: [
      WORK, CARRY, MOVE,
    ],
    big: [
      WORK,
      WORK,
      WORK,
      WORK,
      CARRY,
      MOVE,
      MOVE,
    ]
  }
}
