// Screeps TypeScript definitions
declare global {
  // Game objects
  var Game: {
    time: number;
    cpu: {
      getUsed(): number;
      limit: number;
      tickLimit: number;
      bucket: number;
    };
    creeps: { [name: string]: Creep };
    rooms: { [name: string]: Room };
    spawns: { [name: string]: StructureSpawn };
    structures: { [id: string]: Structure };
    constructionSites: { [id: string]: ConstructionSite };
    flags: { [name: string]: Flag };
    map: Map;
    market: Market;
    shard: {
      name: string;
      type: string;
    };
    getObjectById: <T extends RoomObject>(id: string) => T | null;

    enableLog?: boolean;
  };

  var Memory: {
    [key: string]: any;
  };

  // Creep interface
  interface Creep {
    id: string;
    name: string;
    pos: RoomPosition;
    room: Room;
    body: BodyPartDefinition[];
    fatigue: number;
    hits: number;
    hitsMax: number;
    memory: CreepMemory;
    spawning: boolean;
    ticksToLive: number | undefined;
    store: StoreDefinition;
    carry: StoreDefinition;
    carryCapacity: number;
    move: (direction: DirectionConstant) => ScreepsReturnCode;
    moveTo: (target: RoomPosition | { pos: RoomPosition } | { x: number; y: number; roomName?: string }, opts?: MoveToOpts) => ScreepsReturnCode;
    harvest: (target: Source | Mineral | Deposit) => ScreepsReturnCode;
    build: (target: ConstructionSite) => ScreepsReturnCode;
    repair: (target: Structure) => ScreepsReturnCode;
    attack: (target: Creep | Structure) => ScreepsReturnCode;
    heal: (target: Creep) => ScreepsReturnCode;
    transfer: (target: Creep | Structure, resourceType: ResourceConstant, amount?: number) => ScreepsReturnCode;
    upgradeController: (target: StructureController) => ScreepsReturnCode;
    pickup: (target: Resource) => ScreepsReturnCode;
    drop: (resourceType: ResourceConstant, amount?: number) => ScreepsReturnCode;
    say: (message: string, public?: boolean) => ScreepsReturnCode;
    suicide: () => ScreepsReturnCode;
  }

  interface CreepMemory {
    [key: string]: any;
  }

  // Room interface
  interface Room {
    name: string;
    controller?: StructureController;
    storage?: StructureStorage;
    terminal?: StructureTerminal;
    visual: RoomVisual;
    find: (type: FindConstant, opts?: FindOptions) => RoomObject[];
    lookAt: (x: number, y: number) => LookAtResult[];
    lookAtArea: (top: number, left: number, bottom: number, right: number, asArray?: boolean) => LookAtResultMatrix | LookAtResultWithPos[];
    lookForAt: (type: string, x: number, y: number) => any;
    lookForAtArea: (type: string, top: number, left: number, bottom: number, right: number, asArray?: boolean) => any;
    createConstructionSite: (x: number, y: number, structureType: StructureConstant, name?: string) => ConstructionSite;
  }

  // RoomObject interface (base for all objects in rooms)
  interface RoomObject {
    id: string;
    pos: RoomPosition;
    room: Room;
  }

  // RoomPosition interface
  interface RoomPosition {
    x: number;
    y: number;
    roomName: string;
    getRangeTo: (target: RoomPosition | { pos: RoomPosition }) => number;
    isNearTo: (target: RoomPosition | { pos: RoomPosition }) => boolean;
    getDirectionTo: (target: RoomPosition | { pos: RoomPosition }) => DirectionConstant;
    findClosestByRange: (type: FindConstant, opts?: FindOptions) => RoomObject | null;
    findClosestByPath: (type: FindConstant, opts?: FindOptions) => RoomObject | null;
    look: () => LookAtResult[];
    lookFor: (type: string) => any[];
  }

  // Structure interfaces
  interface Structure {
    id: string;
    pos: RoomPosition;
    room: Room;
    structureType: StructureConstant;
    hits: number;
    hitsMax: number;
  }

  interface StructureSpawn extends Structure {
    name: string;
    spawning: {
      name: string;
      needTime: number;
      remainingTime: number;
    } | null;
    store: StoreDefinition;
    spawnCreep: (body: BodyPartConstant[], name?: string, opts?: SpawnOptions) => ScreepsReturnCode;
    canSpawn: () => boolean;
  }

  interface StructureController extends Structure {
    level: number;
    progress: number;
    progressTotal: number;
    owner?: {
      username: string;
    };
    my: boolean;
    reservation?: {
      username: string;
      ticksToEnd: number;
    };
  }

  // Source interface
  interface Source {
    id: string;
    pos: RoomPosition;
    room: Room;
    energy: number;
    energyCapacity: number;
    ticksToRegeneration: number;
  }

  // Resource interface
  interface Resource {
    id: string;
    pos: RoomPosition;
    room: Room;
    amount: number;
    resourceType: ResourceConstant;
  }

  // ConstructionSite interface
  interface ConstructionSite {
    id: string;
    pos: RoomPosition;
    room: Room;
    structureType: StructureConstant;
    progress: number;
    progressTotal: number;
  }

  // Flag interface
  interface Flag {
    name: string;
    pos: RoomPosition;
    room: Room;
    color: ColorConstant;
    secondaryColor: ColorConstant;
    memory: FlagMemory;
    remove: () => ScreepsReturnCode;
    setColor: (color: ColorConstant, secondaryColor?: ColorConstant) => ScreepsReturnCode;
    setPosition: (x: number, y: number, roomName?: string) => ScreepsReturnCode;
  }

  interface FlagMemory {
    [key: string]: any;
  }

  // Store interface
  interface StoreDefinition {
    [resourceType: string]: number;
    getFreeCapacity: (resourceType?: ResourceConstant) => number;
    getCapacity: (resourceType?: ResourceConstant) => number;
    getUsedCapacity: (resourceType?: ResourceConstant) => number;
  }

  // Body part interface
  interface BodyPartDefinition {
    type: BodyPartConstant;
    hits: number;
  }

  // Constants
  type DirectionConstant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  type StructureConstant = 
    | 'spawn' | 'extension' | 'road' | 'constructedWall' | 'rampart' | 'link' 
    | 'storage' | 'tower' | 'observer' | 'powerSpawn' | 'extractor' | 'lab' 
    | 'terminal' | 'container' | 'nuker' | 'factory';
  type BodyPartConstant = 
    | 'move' | 'work' | 'carry' | 'attack' | 'ranged_attack' | 'tough' | 'heal' | 'claim';
  type ResourceConstant = 
    | 'energy' | 'power' | 'H' | 'O' | 'U' | 'L' | 'K' | 'Z' | 'X' | 'G';
  type ColorConstant = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  type FindConstant = 
    | FIND_CREEPS | FIND_MY_CREEPS | FIND_HOSTILE_CREEPS | FIND_SOURCES_ACTIVE 
    | FIND_SOURCES | FIND_DROPPED_RESOURCES | FIND_STRUCTURES | FIND_MY_STRUCTURES 
    | FIND_HOSTILE_STRUCTURES | FIND_FLAGS | FIND_CONSTRUCTION_SITES | FIND_EXIT_TOP 
    | FIND_EXIT_RIGHT | FIND_EXIT_BOTTOM | FIND_EXIT_LEFT | FIND_EXIT;

  // Return codes
  type ScreepsReturnCode = OK | ERR_NOT_OWNER | ERR_NO_PATH | ERR_NAME_EXISTS | ERR_BUSY | ERR_NOT_FOUND | ERR_NOT_ENOUGH_ENERGY | ERR_NOT_ENOUGH_RESOURCES | ERR_INVALID_TARGET | ERR_FULL | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS | ERR_TIRED | ERR_NO_BODYPART | ERR_NOT_ENOUGH_EXTENSIONS | ERR_RCL_NOT_ENOUGH | ERR_GCL_NOT_ENOUGH;

  // Constants
  const OK = 0;
  const ERR_NOT_OWNER = -1;
  const ERR_NO_PATH = -2;
  const ERR_NAME_EXISTS = -3;
  const ERR_BUSY = -4;
  const ERR_NOT_FOUND = -5;
  const ERR_NOT_ENOUGH_ENERGY = -6;
  const ERR_NOT_ENOUGH_RESOURCES = -7;
  const ERR_INVALID_TARGET = -8;
  const ERR_FULL = -9;
  const ERR_NOT_IN_RANGE = -10;
  const ERR_INVALID_ARGS = -11;
  const ERR_TIRED = -12;
  const ERR_NO_BODYPART = -13;
  const ERR_NOT_ENOUGH_EXTENSIONS = -14;
  const ERR_RCL_NOT_ENOUGH = -15;
  const ERR_GCL_NOT_ENOUGH = -16;

  // Body part constants
  const MOVE: 'move' = 'move';
  const WORK: 'work' = 'work';
  const CARRY: 'carry' = 'carry';
  const ATTACK: 'attack' = 'attack';
  const RANGED_ATTACK: 'ranged_attack' = 'ranged_attack';
  const TOUGH: 'tough' = 'tough';
  const HEAL: 'heal' = 'heal';
  const CLAIM: 'claim' = 'claim';

  // Resource constants
  const RESOURCE_ENERGY = 'energy';
  const RESOURCE_POWER = 'power';
  const RESOURCE_H = 'H';
  const RESOURCE_O = 'O';
  const RESOURCE_U = 'U';
  const RESOURCE_L = 'L';
  const RESOURCE_K = 'K';
  const RESOURCE_Z = 'Z';
  const RESOURCE_X = 'X';
  const RESOURCE_G = 'G';

  // Find constants
  const FIND_CREEPS = 101;
  const FIND_MY_CREEPS = 102;
  const FIND_HOSTILE_CREEPS = 103;
  const FIND_SOURCES_ACTIVE = 104;
  const FIND_SOURCES = 105;
  const FIND_DROPPED_RESOURCES = 106;
  const FIND_STRUCTURES = 107;
  const FIND_MY_STRUCTURES = 108;
  const FIND_HOSTILE_STRUCTURES = 109;
  const FIND_FLAGS = 110;
  const FIND_CONSTRUCTION_SITES = 111;
  const FIND_EXIT_TOP = 112;
  const FIND_EXIT_RIGHT = 113;
  const FIND_EXIT_BOTTOM = 114;
  const FIND_EXIT_LEFT = 115;
  const FIND_EXIT = 116;

  // Move options
  interface MoveToOpts {
    reusePath?: number;
    serializeMemory?: boolean;
    noPathFinding?: boolean;
    visualizePathStyle?: any;
  }

  // Spawn options
  interface SpawnOptions {
    memory?: CreepMemory;
    energyStructures?: StructureSpawn[];
    dryRun?: boolean;
  }

  // Look result
  interface LookAtResult {
    type: string;
    [key: string]: any;
  }

  // Look constants
  const LOOK_EXITS = 'exit';

  interface LookAtResultMatrix {
    [y: number]: { [x: number]: LookAtResult[] };
  }

  interface LookAtResultWithPos {
    x: number;
    y: number;
    type: string;
    [key: string]: any;
  }

  // RoomVisual
  interface RoomVisual {
    roomName?: string;
    line: (x1: number, y1: number, x2: number, y2: number, style?: any) => RoomVisual;
    circle: (x: number, y: number, style?: any) => RoomVisual;
    rect: (x: number, y: number, w: number, h: number, style?: any) => RoomVisual;
    text: (text: string, x: number, y: number, style?: any) => RoomVisual;
  }

  // Map
  interface Map {
    describeExits: (roomName: string) => { [direction: string]: string };
    findExit: (fromRoom: string, toRoom: string, opts?: any) => FindConstant | ERR_NO_PATH | ERR_INVALID_ARGS;
    findRoute: (fromRoom: string, toRoom: string, opts?: any) => any[] | ERR_NO_PATH;
    getRoomLinearDistance: (roomName1: string, roomName2: string, continuous?: boolean) => number;
    getWorldSize: () => number;
    isRoomAvailable: (roomName: string) => boolean;
  }

  // Market
  interface Market {
    credits: number;
    incomingTransactions: Transaction[];
    outgoingTransactions: Transaction[];
    orders: { [id: string]: Order };
    calcTransactionCost: (amount: number, roomName1: string, roomName2: string) => number;
    cancelOrder: (orderId: string) => ScreepsReturnCode;
    changeOrderPrice: (orderId: string, newPrice: number) => ScreepsReturnCode;
    createOrder: (type: string, resourceType: ResourceConstant, price: number, totalAmount: number, roomName?: string) => ScreepsReturnCode;
    deal: (orderId: string, amount: number, targetRoomName?: string) => ScreepsReturnCode;
    extendOrder: (orderId: string, addAmount: number) => ScreepsReturnCode;
    getAllOrders: (filter?: any) => Order[];
    getHistory: (shard?: string) => any[];
  }

  interface Transaction {
    transactionId: string;
    time: number;
    sender: { username: string };
    recipient: { username: string };
    resourceType: ResourceConstant;
    amount: number;
    from: string;
    to: string;
    description: string;
    order: Order;
  }

  interface Order {
    id: string;
    created: number;
    amount: number;
    remainingAmount: number;
    resourceType: ResourceConstant;
    roomName: string;
    unitPrice: number;
    totalAmount: number;
    type: string;
  }
}

export {};
