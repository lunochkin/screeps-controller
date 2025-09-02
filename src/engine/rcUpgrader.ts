import { getCreepsByRole, spawnCreep } from './helpers'

export const ROLE_RC_UPGRADER = 'rcUpgrader'

const MAX_RC_UPGRADERS = 4

export const rcUpgraderRole = {
  spawn: (spawn: StructureSpawn): void => {
    const rcUpgraders = getCreepsByRole(ROLE_RC_UPGRADER)
    if (rcUpgraders.length >= MAX_RC_UPGRADERS) {
      return
    }

    if (spawnCreep(spawn, ROLE_RC_UPGRADER, [WORK, CARRY, MOVE])) {
      console.log(`Spawned rcUpgrader: ${spawn.name}`)
    }
  },
  run: (creep: Creep): void => {
    const source = creep.pos.findClosestByPath(FIND_SOURCES)
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
