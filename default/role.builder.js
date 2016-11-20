const collectEnergy = require('job.collectEnergy');
const CONF = require('conf').GENERAL;
const JOBS = {
  HARVEST: 0,
  BUILDING: 1,
  REPAIR: 2,
}
const REPAIR_TRESHOLD = 0.75;

function getJob(creep){
  let targets, target;
  // HARVESTING
  if (creep.carry.energy == 0) {
    creep.memory.job = JOBS.HARVEST;
    creep.say('harvesting');
    return;
  }
  // BUILD
  target = creep.pos[CONF.PATHFINDING](FIND_CONSTRUCTION_SITES);
  if (target) {
    creep.memory.job = JOBS.BUILDING;
    creep.memory.target = target.id;
    creep.say('building');
    return;
  }
  // REPAIR
  targets = creep.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < (object.hitsMax * REPAIR_TRESHOLD)
  })
  if (targets.length > 0) {
    target = {
      hits: 1,
      hitsMax: 1
    }
    tagets.forEach(object => target = object.hits/object.hitsMax < target.hits/target.hitsMax ? object : target);
    creep.memory.job = JOBS.REPAIR;
    creep.memory.target = target.id;
    creep.say('repairing');
    return;
  }
}

module.exports = {
  run: function(creep) {
    let target;
    if(!creep.memory.busy){
      creep.memory.busy = true;
      getJob(creep);
    }
    if(creep.memory.target){
      target = Game.getObjectById(creep.memory.target);
    }
    switch (creep.memory.job) {
      case JOBS.HARVEST:
        collectEnergy(creep);
        if(creep.carry.energy === creep.carryCapacity){
          creep.memory.busy = false;
        }
        break;
      case JOBS.BUILDING:
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if(target === null || creep.carry.energy === 0){
          creep.memory.busy = false;
        }
        break;
      case JOBS.REPAIR:
        if (creep.repair(target) === ERR_NOT_IN_RANGE || creep.carry.energy === 0) {
          creep.moveTo(target);
        }
        if(target.hits === target.hitsMax){
          creep.memory.busy = false;
        }
        break;
    }
  },
  bodies: {
    base: [WORK,CARRY,MOVE],
    extend: [WORK, WORK, CARRY, MOVE],
  }
}
