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

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

function generateName(role) {
  return role + '_creep_' + s4() + s4();
}

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

const spawnLogic = {
  harvester: (spawn, spawnName, roleCreeps, increasesRatio) => {
    const count = roleCreeps.length;
    const body = createBodyForRole(roles.harvester, spawn);
    if (spawn.canCreateCreep(body) === 0) {
      const newName = spawn.createCreep(body, generateName('harvester'), {role: 'harvester', spawn: spawnName});
      if (increasesRatio) {
        spawn.memory.rrStep += 1;
        spawn.memory.ratioProgress.harvester += 1;
      }
      console.log('spawning new harvester: ' + newName);
    }
  },
  builder: (spawn, spawnName, roleCreeps, increasesRatio) => {
    const count = roleCreeps.length;
    const body = createBodyForRole(roles.builder, spawn);
    if (spawn.canCreateCreep(body) === 0) {
      const newName = spawn.createCreep(body, generateName('builder'), {role: 'builder'});
      if (increasesRatio) {
        spawn.memory.rrStep += 1;
        spawn.memory.ratioProgress.builder += 1;
      }
      console.log('spawning new builder: ' + newName);
    }
  },
  upgrader: (spawn, spawnName, roleCreeps, increasesRatio) => {
    const count = roleCreeps.length;
    const body = createBodyForRole(roles.upgrader, spawn);
    if (spawn.canCreateCreep(body) === 0) {
      const newName = spawn.createCreep(body, generateName('upgrader'), {role: 'upgrader'});
      if (increasesRatio) {
        spawn.memory.rrStep += 1;
        spawn.memory.ratioProgress.upgrader += 1;
      }
      console.log('spawning new upgrader: ' + newName);
    }
  },
};

module.exports = {
  run: () => {
    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    _.forEach(Game.spawns, (spawn, spawnName) => {
      for (role of CONF.PRIORITY) {
        const roleCreeps = creeps[role] || [];
        if (CONF.MIN[role] > roleCreeps.length) {
          spawn.memory.nextSpawnRole = role;
          spawn.memory.nextSpawnCause = 'MIN';
          spawnLogic[role](spawn, spawnName, roleCreeps, false);
          return;
        }
      }

      const maxRoles = CONF.RATIO_PRIORITY.length;
      let ratioIndex = spawn.memory.rrStep % maxRoles;
      let hasBuild = false;
      let doneWithoutBuild = new Set();

      if (spawn.memory.rrStep >= CONF.RATIO_TOTAL || spawn.memory.rrStep === undefined) {
        console.log('round robin cycle reached');
        spawn.memory.ratioProgress = {};
        CONF.RATIO_PRIORITY.forEach((role) => {
          spawn.memory.ratioProgress[role] = 0;
        });
        spawn.memory.rrStep = 0;
      }

      do {
        ratioRole = CONF.RATIO_PRIORITY[ratioIndex];
        if (creeps[ratioRole].length >= CONF.MAX[ratioRole]) {
          doneWithoutBuild.add(ratioRole);
          spawn.memory.rrStep += 1;
          spawn.memory.ratioProgress[ratioRole] += 1;
        } else if (spawn.memory.ratioProgress[ratioRole] < CONF.RATIO[ratioRole]) {
          spawn.memory.nextSpawnRole = ratioRole;
          spawn.memory.nextSpawnCause = 'RATIO';

          const roleCreeps = creeps[ratioRole] || [];
          spawnLogic[ratioRole](spawn, spawnName, roleCreeps, true);
          hasBuild = true;
        } else {
          doneWithoutBuild.add(ratioRole);
        }

        if (doneWithoutBuild.size >= maxRoles) {
          hasBuild = true;
        }

        ratioIndex = (ratioIndex + 1) % maxRoles;
      } while (!hasBuild);
    });
  }
}
