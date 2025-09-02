import { spawnCreep, getCreepsByRole } from './helpers'

export const ROLE_HARVESTER = 'harvester'

const MAX_HARVESTERS = 3

export const harversterRole = {
  spawn: (spawn: StructureSpawn): void => {
    const harvesters = getCreepsByRole(ROLE_HARVESTER)
    if (harvesters.length >= MAX_HARVESTERS) {
      return
    }

    if (spawnCreep(spawn, ROLE_HARVESTER, [WORK, CARRY, MOVE])) {
      console.log(`Spawned harvester: ${spawn.name}`)
    }
  },
  run: (creep: Creep): void => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      const spawn = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure: Structure) => structure.structureType === 'spawn'
      })[0] as StructureSpawn

      if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
      }
    } else {
      const source = creep.pos.findClosestByRange(FIND_SOURCES)
      if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}
