const collectEnergy = require('job.collectEnergy');
const CONF = require('conf').GENERAL;
const JOBS = {
  HARVEST: 0,
  BUILDING: 1,
  REPAIR: 2,
  EMERGENCY_REPAIR: 3,
}
const REPAIR_TRESHOLD = 0.75;
const EMERGENCY_REPAIR_TRESHOLD = 0.20;
const EMERGENCY_REPAIR_UPPER_TRESHOLD_ABSOLUTE = 10000;
const EMERGENCY_REPAIR_UPPER_TRESHOLD = 0.4;
const BUILD_STRUCTURES = [
  [STRUCTURE_EXTENSION, STRUCTURE_SPAWN],
  [STRUCTURE_WALL, STRUCTURE_TOWER],
  [STRUCTURE_ROAD],
  [STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL,
    STRUCTURE_CONTROLLER, STRUCTURE_LINK, STRUCTURE_STORAGE,
    STRUCTURE_OBSERVER, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN,
    STRUCTURE_EXTRACTOR, STRUCTURE_LAB, STRUCTURE_TERMINAL,
    STRUCTURE_CONTAINER]
];

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
    filter: object => object.hits < (object.hitsMax * EMERGENCY_REPAIR_TRESHOLD && object.hits < EMERGENCY_REPAIR_UPPER_TRESHOLD_ABSOLUTE)
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
  // BUILD
  targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  if(targets.length > 0) {
    targets = _.groupBy(targets, (structure) => {
      for (let i = 0; i < BUILD_STRUCTURES.length; i++) {
        const structureGroup = BUILD_STRUCTURES[i];
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
    targets.forEach(object => target = object.hits/object.hitsMax < target.hits/target.hitsMax ? object : target);
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
      case JOBS.EMERGENCY_REPAIR:
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if(target.hits === target.hitsMax * EMERGENCY_REPAIR_UPPER_TRESHOLD || 
          target.hits > EMERGENCY_REPAIR_UPPER_TRESHOLD_ABSOLUTE || 
          creep.carry.energy === 0){
          creep.memory.busy = false;
        }
        break;
      case JOBS.REPAIR:
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
        if(target.hits === target.hitsMax || creep.carry.energy === 0){
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
