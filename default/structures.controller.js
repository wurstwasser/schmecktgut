const structureJobs = require('structures');
const SMART_STRUCTURES = Object.keys(structureJobs);

module.exports = {
  run: () => {
    _.forEach(Game.rooms, room => {
      const structures = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          let result = false;
          SMART_STRUCTURES.forEach((struct) => result = result || structure.structureType === struct);
          return result;
        }
      });
      structures.forEach(structure => {
      structureJobs[structure.structureType].run(structure);
      });
    });
  }
}
