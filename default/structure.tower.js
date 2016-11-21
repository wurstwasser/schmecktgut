// const REPAIR_ENERGY_RATIO = 0.5;

module.exports = {
  run: function(tower) {
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
      return;
    }
    // if(tower.energy > tower.energyCapacity * REPAIR_ENERGY_RATIO)
    // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => structure.hits < structure.hitsMax
    // });
    // if (closestDamagedStructure) {
    //   tower.repair(closestDamagedStructure);
    //   return;
    // }

  }
};
