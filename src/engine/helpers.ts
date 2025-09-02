
export const getStructureByType = (type: StructureConstant): Structure[] => {
  return Object.values(Game.structures).filter(structure => structure.structureType === type)
}

export const getCreepsByRole = (role: string): Creep[] => {
  return Object.values(Game.creeps).filter(creep => creep.memory['role'] === role)
}

const bodyPartsCosts: Record<BodyPartConstant, number> = {
  [MOVE]: 50,
  [WORK]: 100,
  [CARRY]: 50,
  [ATTACK]: 80,
  [RANGED_ATTACK]: 150,
  [HEAL]: 250,
  [CLAIM]: 600,
  [TOUGH]: 10,
}

export const getCreepCost = (bodyParts: BodyPartConstant[]): number => {
  return bodyParts.reduce((acc, part) => acc + bodyPartsCosts[part], 0)
}

export const spawnCreep = (spawn: StructureSpawn, role: string, bodyParts: BodyPartConstant[]): boolean => {
  if (spawn.spawning) {
    return false
  }

  const creepCost = getCreepCost(bodyParts)
  if (spawn.store[RESOURCE_ENERGY]! < creepCost) {
    return false
  }

  const name = `${role}-${spawn.name}-${Game.time}`

  const result = spawn.spawnCreep(bodyParts, name, {
    memory: {
      role,
    }
  })
  if (result !== OK) {
    throw new Error(`Failed to spawn creep: ${result}`)
  }

  return true
}
