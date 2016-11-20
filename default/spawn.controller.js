const roles = require('roles');

const bodyTypeCosts = new Map();
bodyTypeCosts.set(Symbol.for(WORK), 100);
bodyTypeCosts.set(Symbol.for(MOVE), 50);
bodyTypeCosts.set(Symbol.for(CARRY), 50);
bodyTypeCosts.set(Symbol.for(ATTACK), 80);
bodyTypeCosts.set(Symbol.for(RANGED_ATTACK), 150);
bodyTypeCosts.set(Symbol.for(HEAL), 250);
bodyTypeCosts.set(Symbol.for(CLAIM), 600);
bodyTypeCosts.set(Symbol.for(TOUGH), 10);

const CONF = require('conf').SPAWN;

function createBodyForRole(role, spawn) {
  const energyCap = spawn.room.energyCapacityAvailable;
  let costs = 0;

  const returnBody = _.clone(role.bodies.base);

  role.bodies.base.forEach((bodyPart) => {
    costs += bodyTypeCosts.get(Symbol.for(bodyPart));
  });

  let extensionIndex = 0;
  let nextBodyPartCost = bodyTypeCosts.get(Symbol.for(role.bodies.extend[extensionIndex]));
  while (costs + nextBodyPartCost <= energyCap) {
    returnBody.push(role.bodies.extend[extensionIndex]);
    costs += nextBodyPartCost;
    extensionIndex += 1;
    extensionIndex %= role.bodies.extend.length;
    nextBodyPartCost = bodyTypeCosts.get(Symbol.for(role.bodies.extend[extensionIndex]));
  }

  return returnBody;
}

const spawn = {
  harvester: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn, spawnName) => {
      const body = createBodyForRole(roles.harvester, spawn);
      if (spawn.canCreateCreep(body) === 0) {
        const newName = spawn.createCreep(body, undefined, {role: 'harvester', spawn: spawnName});
        console.log('spawning new harvester: ' + newName);
      }
    });
  },
  builder: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const body = createBodyForRole(roles.builder, spawn);
      if (spawn.canCreateCreep(body) === 0) {
        const newName = spawn.createCreep(body, undefined, {role: 'builder'});
        console.log('spawning new builder: ' + newName);
      }
    });
  },
  upgrader: (roleCreeps) => {
    const count = roleCreeps.length;
    _.forEach(Game.spawns, (spawn) => {
      const body = createBodyForRole(roles.upgrader, spawn);
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
      if (CONF.MIN[role] > roleCreeps.length) {
        spawn[role](roleCreeps);
        return;
      }
    }
  }
}
