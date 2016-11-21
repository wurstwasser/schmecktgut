const controller = {
  spawn: require('spawn.controller'),
  creeps: require('creeps.controller'),
  structures: require('structures.controller'),
}

module.exports.loop = () => {

  Game.getCreepCount = function() {
    let total = 0;
    _.forEach(_.groupBy(Game.creeps, (creep) => creep.memory.role), (roleCreeps, role) => {
      console.log(role, 'count:', roleCreeps.length);
      total += roleCreeps.length;
    });
    console.log('total:', total);
    console.log('-----------');
    _.forEach(Game.spawns, (spawn, spawnName) => {
      console.log(spawnName, 'plans to spawn', '"' + spawn.memory.nextSpawnRole + '"', 'creep next because of', spawn.memory.nextSpawnCause, 'requirement');
    });
    console.log('-----------');
  }

  controller.spawn.run();
  controller.creeps.run();
  controller.structures.run();
}
