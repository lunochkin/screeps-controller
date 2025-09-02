import { harversterRole, ROLE_HARVESTER } from './harvester'
import { rcUpgraderRole, ROLE_RC_UPGRADER } from './rcUpgrader'

// Main game loop for Screeps Controller
const loop = (): void => {
  console.log("Screeps Controller running at tick:", Game.time)
  
  const spawn = Game.spawns['Spawn1']
  if (spawn && !spawn.spawning) {
    harversterRole.spawn(spawn)
    rcUpgraderRole.spawn(spawn)
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (!creep) {
      continue
    }

    if (creep.memory['role'] === ROLE_HARVESTER) {
      harversterRole.run(creep)
    } else if (creep.memory['role'] === ROLE_RC_UPGRADER) {
      rcUpgraderRole.run(creep)
    }
  }
}

module.exports = {
  loop,
}
