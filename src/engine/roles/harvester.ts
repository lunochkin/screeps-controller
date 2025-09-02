import { spawnCreep, getCreepsByRole } from '../helpers'
import { log } from '../log'

export const ROLE_HARVESTER = 'harvester'

const MAX_HARVESTERS = 3

const getSource = (creep: Creep): Source | null => {
  const sourceId = creep.memory['sourceId']
  if (!sourceId) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES) as Source
    creep.memory['sourceId'] = source.id
    return source
  }

  return Game.getObjectById<Source>(sourceId)
}

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
      if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
      }
    } else {
      const source = getSource(creep)
      if (!source) {
        return
      }

      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    }
  }
}
