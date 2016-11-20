const roles = require('roles');

const CONF = require('conf').SPAWN;

const spawn = {
  harvester: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn, spawnName) => {
      const body = roles.harvester.bodies.default;
      if (spawn.canCreateCreep(body) === 0) {
        const newName = spawn.createCreep(body, undefined, {role: 'harvester', spawn: spawnName});
        console.log('spawning new harvester: ' + newName);
      }
    });
  },
  builder: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const body = roles.builder.bodies.default;
      if (spawn.canCreateCreep(body) === 0) {
        const newName = spawn.createCreep(body, undefined, {role: 'builder'});
        console.log('spawning new builder: ' + newName);
      }
    });
  },
  upgrader: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const body = roles.upgrader.bodies.default;
      if (spawn.canCreateCreep(body) === 0) {
        const newName = spawn.createCreep(body, undefined, {role: 'upgrader'});
        console.log('spawning new upgrader: ' + newName);
      }
    });
  },
}

module.exports = {
  run: () => {
    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    for (role of CONF.PRIORITY) {
      const roleCreeps = creeps[role] || [];
      if (CONF.MIN[role] >= roleCreeps.length) {
        spawn[role](roleCreeps);
        return;
      }
    }
  }
}
