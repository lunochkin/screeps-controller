import { getCreepsByRole, spawnCreep } from '../helpers'
import { log } from '../log'

export const ROLE_RC_UPGRADER = 'rcUpgrader'

const MAX_RC_UPGRADERS = 5

const getSource = (creep: Creep): Source | null => {
  const sourceId = creep.memory['rcControllerSourceId'] || creep.memory['sourceId']
  if (!sourceId) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES) as Source
    creep.memory['sourceId'] = source.id
    return source
  }

  return Game.getObjectById<Source>(sourceId)
}

export const rcUpgraderRole = {
  spawn: (spawn: StructureSpawn): void => {
    const rcUpgraders = getCreepsByRole(ROLE_RC_UPGRADER)
    if (rcUpgraders.length >= MAX_RC_UPGRADERS) {
      return
    }

    if (spawnCreep(spawn, ROLE_RC_UPGRADER, [WORK, CARRY, MOVE])) {
      log(`Spawned rcUpgrader: ${spawn.name}`)
    }
  },
  run: (creep: Creep): void => {
    const source = getSource(creep)
    if (!source) {
      return
    }

    if (creep.store[RESOURCE_ENERGY] === 0) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source)
      }
    } else {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        if (creep.harvest(source) === OK) {
          return
        }

        const rcController = creep.room.controller
        if (rcController) {
          creep.upgradeController(rcController)

          if (!creep.memory['rcControllerSourceId']) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES) as Source
            creep.memory['rcControllerSourceId'] = source.id

            delete creep.memory['sourceId']
          }
        }
      } else {
        const rcController = creep.room.controller
        if (rcController && creep.upgradeController(rcController) === ERR_NOT_IN_RANGE) {
          creep.moveTo(rcController)
        }
      }
    }
  }
}
