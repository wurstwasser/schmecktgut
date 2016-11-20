module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    switch (creep.memory.job) {
      case 'upgrade':
        if (creep.carry.energy == 0) {
          creep.memory.job = 'harvest';
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
          break;
        }

        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }

        break;
    }
  },
  bodies: {
    default: [WORK,CARRY,MOVE],
    big: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  }

};
