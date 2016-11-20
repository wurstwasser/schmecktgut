const collectEnergy = require('job.collectEnergy');

const SUPPLIED_STRUCTURES = [[STRUCTURE_SPAWN, STRUCTURE_EXTENSION], [STRUCTURE_STORAGE]]

module.exports = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      collectEnergy(creep);
    } else {
      let target;
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          let result = false;
          _.flatten(SUPPLIED_STRUCTURES).forEach((struct) => result = result || structure.structureType === struct);
          return result && structure.energy < structure.energyCapacity;
        }
      });

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

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
    }
  },
  bodies: {
    base: [ WORK, CARRY, MOVE,],
    extend: [WORK, WORK, MOVE, CARRY,]
  },
};
