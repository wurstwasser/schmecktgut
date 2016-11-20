module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {
    const spawn = creep.memory.spawn;
    if (creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
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
    big: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  }
};
