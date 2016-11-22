const collectEnergy = require('job.collectEnergy');
const CONF = require('conf').GENERAL;
const JOBS = {
  HARVEST: 0,
  DELIVERING: 1,
  EMERGENCY_REPAIR: 2,
}
const SUPPLIED_STRUCTURES = [[STRUCTURE_TOWER ,STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_CONTAINER], [STRUCTURE_STORAGE]]
const EMERGENCY_REPAIR_TRESHOLD_ABSOLUTE = 10000;
const EMERGENCY_REPAIR_TRESHOLD = 0.20;
const EMERGENCY_REPAIR_UPPER_TRESHOLD_ABSOLUTE = 15000;
const EMERGENCY_REPAIR_UPPER_TRESHOLD = 0.4;

function getJob(creep){
  let targets, target;
  // HARVESTING
  if (creep.carry.energy === 0) {
    creep.memory.job = JOBS.HARVEST;
    creep.say('harvesting');
    return;
  }
  // EMERGENCY_REPAIR
  targets = creep.room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax * EMERGENCY_REPAIR_TRESHOLD &&
      object.hits < EMERGENCY_REPAIR_TRESHOLD_ABSOLUTE
  })
  if (targets.length > 0) {
    target = {
      hits: 1,
      hitsMax: 1
    }
    targets.forEach(object => target = object.hits/object.hitsMax < target.hits/target.hitsMax ? object : target);
    creep.memory.job = JOBS.EMERGENCY_REPAIR;
    creep.memory.target = target.id;
    creep.say('emergency repairing');
    return;
  }
  // DELIVERING
  targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      let result = false;
      _.flatten(SUPPLIED_STRUCTURES).forEach((struct) => result = result || structure.structureType === struct);
      return result && structure.energy < structure.energyCapacity;
    }
  });
  if(targets.length > 0) {
    targets = _.groupBy(targets, (structure) => {
      for (let i = 0; i < SUPPLIED_STRUCTURES.length; i++) {
        const structureGroup = SUPPLIED_STRUCTURES[i];
        for (const groupStructure of structureGroup) {
          if (structure.structureType === groupStructure) {
            return i;
          }
        }
      }
    });
    for (const targetGroupKey in targets) {
      const targetGroup = targets[targetGroupKey];
      if (targetGroup.length === 0) continue;
      else {
        target = creep.pos.findClosestByPath(targetGroup);
        break;
      };
    }
    creep.memory.job = JOBS.DELIVERING;
    creep.memory.target = target.id;
    creep.say('delivering');
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
      case JOBS.DELIVERING:
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if(target.energy === target.energyCapacity || creep.carry.energy === 0){
          creep.memory.busy = false;
        }
        break;
      case JOBS.EMERGENCY_REPAIR:
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if(target.hits > target.hitsMax * EMERGENCY_REPAIR_UPPER_TRESHOLD || 
          target.hits > EMERGENCY_REPAIR_UPPER_TRESHOLD_ABSOLUTE || 
          creep.carry.energy === 0){
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
