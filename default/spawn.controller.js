const roles = require('roles');

const CONF = {
  MIN: {
    harvester: 2,
    builder: 2,
    upgrader: 2,
  },
  PRIORITY: ['harvester', 'builder', 'upgrader'],
};

const spawn = {
  harvester: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const newName = spawn.createCreep(roles.harvester.bodies.default, undefined, {role: 'harvester'});
      console.log('spawning new harvester: ' + newName);
    });
  },
  builder: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const newName = spawn.createCreep(roles.builder.bodies.default, undefined, {role: 'builder'});
      console.log('spawning new builder: ' + newName);
    });
  },
  upgrader: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const newName = spawn.createCreep(roles.upgrader.bodies.default, undefined, {role: 'upgrader'});
      console.log('spawning new upgrader: ' + newName);
    });
  },
}

module.exports = {
  run: () => {
    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    for (role of CONF.PRIORITY) {
      console.log('role', role);
      const roleCreeps = creeps[role] || [];
      if (CONF.MIN[role] >= roleCreeps.length) {
        spawn[role](roleCreeps);
        return;
      }
    }
  }
}
