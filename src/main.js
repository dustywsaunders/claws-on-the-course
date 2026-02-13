import Phaser from "phaser";
import StartScene from "./scenes/StartScene";
import GameScene from "./scenes/GameScene";
import PauseScene from "./scenes/PauseScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#1e1e1e",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [StartScene, GameScene, PauseScene],
};

new Phaser.Game(config);
