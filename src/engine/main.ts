// Main game loop for Screeps Controller
const loop = function(): void {
  console.log("Screeps Controller running at tick:", Game.time, Game.cpu.getUsed());
};

module.exports = {
  loop: loop
};
