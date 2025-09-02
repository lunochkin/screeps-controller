import { spawnCreep, getCreepsByRole } from '../helpers'
import { log } from '../log'

export const ROLE_HARVESTER = 'harvester'

const MAX_HARVESTERS = 3

export const harversterRole = {
  spawn: (spawn: StructureSpawn): void => {
    const harvesters = getCreepsByRole(ROLE_HARVESTER)
    if (harvesters.length >= MAX_HARVESTERS) {
      return
    }

    if (spawnCreep(spawn, ROLE_HARVESTER, [WORK, CARRY, MOVE])) {
      log(`Spawned harvester: ${spawn.name}`)
    }
  },
  run: (spawn: StructureSpawn, creep: Creep): void => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
      }
    } else {
      let sourceId = creep.memory['sourceId']
      let source: Source | null = null
      if (!sourceId) {
        source = creep.pos.findClosestByRange(FIND_SOURCES) as Source
        creep.memory['sourceId'] = source.id
      } else {
        source = Game.getObjectById<Source>(sourceId)
      }

      if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}
