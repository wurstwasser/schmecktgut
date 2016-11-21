const controller = {
  spawn: require('spawn.controller'),
  creeps: require('creeps.controller'),
}

module.exports.loop = () => {

  Game.getCreepCount = function() {
    let total = 0;
    _.forEach(_.groupBy(Game.creeps, (creep) => creep.memory.role), (roleCreeps, role) => {
      console.log(role, 'count:', roleCreeps.length);
      total += roleCreeps.length;
    });
    console.log('total:', total);
  }

  controller.spawn.run();
  controller.creeps.run();
}
