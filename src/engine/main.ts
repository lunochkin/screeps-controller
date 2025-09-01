const ROLE_HARVESTER = 'harvester'

const MAX_HARVESTERS = 3

const harversterRole = {
  spawn: (spawn: StructureSpawn): void => {
    const harvesters = Object.values(Game.creeps).filter(creep => creep.memory['role'] === ROLE_HARVESTER)
    if (harvesters.length >= MAX_HARVESTERS) {
      return
    }

    const name = `harvester-${spawn.name}-${Game.time}`
    const result = spawn.spawnCreep([WORK, CARRY, MOVE], name, {
      memory: {
        role: ROLE_HARVESTER
      }
    })
    if (result !== OK) {
      // throw new Error(`Failed to spawn harvester: ${result}`)
    }
  },
  run: (creep: Creep): void => {
    if (!creep) {
      throw new Error('Invalid creep')
    }

    if (creep.memory['role'] !== ROLE_HARVESTER) {
      throw new Error('Invalid creep role')
    }

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

// Main game loop for Screeps Controller
const loop = (): void => {
  console.log("Screeps Controller running at tick:", Game.time)
  
  const spawn = Game.spawns['Spawn1']
  if (spawn && !spawn.spawning) {
    harversterRole.spawn(spawn)
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    if (creep && creep.memory['role'] === ROLE_HARVESTER) {
      harversterRole.run(creep)
    }
  }
}

module.exports = {
  loop,
}
