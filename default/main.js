const controller = {
  spawn: require('spawn.controller'),
  creeps: require('creeps.controller'),
}

module.exports.loop = () => {
  controller.spawn.run();
  controller.creeps.run();
}
