import { spawnCreep, getCreepsByRole } from '../helpers'
import { log } from '../log'

export const ROLE_BUILDER = 'builder'

const MAX_BUILDERS = 1

export const builderRole = {
  spawn: (spawn: StructureSpawn): void => {
    const builders = getCreepsByRole(ROLE_BUILDER)
    if (builders.length >= MAX_BUILDERS) {
      return
    }

    if (spawnCreep(spawn, ROLE_BUILDER, [WORK, CARRY, MOVE])) {
      log(`Spawned builder: ${spawn.name}`)
    }
  },
  run: (creep: Creep): void => {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES) as ConstructionSite | null;
    if (target) {
      creep.build(target)
    }
  }
}
