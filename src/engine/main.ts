import { harversterRole, ROLE_HARVESTER } from './harvester'
import { rcUpgraderRole, ROLE_RC_UPGRADER } from './rcUpgrader'
import { builderRole, ROLE_BUILDER } from './builder'

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
  console.log("Screeps Controller finished at tick:", Game.time, ' with usage:', endUsage - startUsage)
}

module.exports = {
  loop,
}
