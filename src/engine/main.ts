import { harversterRole, ROLE_HARVESTER } from './roles/harvester'
import { rcUpgraderRole, ROLE_RC_UPGRADER } from './roles/rcUpgrader'
import { builderRole, ROLE_BUILDER } from './roles/builder'
import { log, enableLog, disableLog } from './log'

;(global as any).enableLog = enableLog
;(global as any).disableLog = disableLog

// Main game loop for Screeps Controller
const loop = (): void => {
  const startUsage = Game.cpu.getUsed()
  
  const spawn = Game.spawns['Spawn1']
  if (!spawn) {
    return
  }

  if (!spawn.spawning) {
    harversterRole.spawn(spawn)
    rcUpgraderRole.spawn(spawn)
    builderRole.spawn(spawn)
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (!creep) {
      continue
    }

    if (creep.memory['role'] === ROLE_HARVESTER) {
      harversterRole.run(spawn, creep)
    } else if (creep.memory['role'] === ROLE_RC_UPGRADER) {
      rcUpgraderRole.run(creep)
    } else if (creep.memory['role'] === ROLE_BUILDER) {
      builderRole.run(creep)
    }
  }

  const endUsage = Game.cpu.getUsed()
  log('Usage:', endUsage - startUsage)
}

module.exports = {
  loop,
}
