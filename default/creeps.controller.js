const roles = require('roles');

module.exports = {
  run: () => {
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }

    _.forEach(Game.creeps, (creep) => {
      console.log(creep);
      const role = creep.memory.role;
      if (role) roles[role].run(creep);
    });
  }
}
