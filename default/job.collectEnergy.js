const CONF = require('conf').GENERAL;

module.exports = (creep) => {
  // let sourcesInRoom = creep.room.find(FIND_DROPPED_ENERGY);
  // console.log(sourcesInRoom);
  const energy = creep.pos.findInRange(
    FIND_DROPPED_ENERGY,
    1
  );
  if (energy.length) {
    creep.pickup(energy[0]);
    return;
  }
  const sourcesInRoom = creep.room.find(FIND_SOURCES);
  let foundSource = false;
  do {
    const source = creep.pos[CONF.PATHFINDING](sourcesInRoom);
    if (!source) {
      foundSource = true;
      break;
    }

    if (source.energy === 0) {
      _.remove(sourcesInRoom, source);
      continue;
    }

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
    foundSource = true;
  } while (!foundSource);
};
