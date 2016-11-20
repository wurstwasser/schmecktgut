const CONF = require('conf').GENERAL;

module.exports = (creep) => {
  var source = creep.pos[CONF.PATHFINDING](FIND_SOURCES);
  if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
    creep.moveTo(source);
  }
};
