import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

    // Title
    this.add
      .text(width / 2, 120, "HORDE SHOOTER", {
        fontSize: "48px",
        fill: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    // Instructions
    this.add
      .text(
        width / 2,
        240,
        `
WASD / Arrow Keys - Move/Select
ENTER / SPACE - Choose Upgrades
Auto-shoots nearest enemy
Survive as long as possible

Press ENTER or SPACE to start
      `,
        {
          fontSize: "20px",
          fill: "#cccccc",
          align: "center",
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5);

    // Input
    this.startKeys = this.input.keyboard.addKeys({
      enter: "ENTER",
      space: "SPACE",
    });
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.startKeys.enter) ||
      Phaser.Input.Keyboard.JustDown(this.startKeys.space)
    ) {
      this.scene.start("GameScene");
    }
  }
}
