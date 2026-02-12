import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {}

  create() {
    // Set world bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // Add simple player placeholder
    this.player = this.add.rectangle(400, 300, 40, 40, 0x00ff00);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    // Create enemy group
    this.enemies = this.physics.add.group();

    this.enemySpawnEvent = this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerHit,
      null,
      this,
    );

    this.enemyList = this.enemies.getChildren();

    // Create player controls
    this.keys = this.input.keyboard.addKeys({
      up: "W",
      down: "S",
      left: "A",
      right: "D",
    });

    this.playerMaxHp = 100;
    this.playerHp = 100;
    this.isPlayerDead = false;

    this.lastDamageTime = 0;
    this.damageCooldown = 300; // ms

    // TEMPORARY enemy counter
    this.enemyCounterText = this.add.text(10, 10, "Enemies: 0", {
      fontSize: "18px",
      fill: "#ffffff",
    });

    this.enemyCounterText.setDepth(1000);
    this.enemyCounterText.setScrollFactor(0);

    // Health bar background
    this.healthBarBg = this.add
      .rectangle(10, 40, 200, 20, 0x222222)
      .setOrigin(0, 0)
      .setScrollFactor(0);

    // Health bar fill
    this.healthBar = this.add
      .rectangle(10, 40, 200, 20, 0x00ff00)
      .setOrigin(0, 0)
      .setScrollFactor(0);
  }

  update() {
    // Set death state
    if (this.isPlayerDead) {
      this.player.body.setVelocity(0);
      return;
    }

    // Update player controls
    const speed = 200;
    const body = this.player.body;

    body.setVelocity(0);

    if (this.keys.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.keys.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.keys.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.keys.down.isDown) {
      body.setVelocityY(speed);
    }

    // ADD THIS AFTER ENEMIES CAN BE REMOVED
    // this.enemyList.forEach(enemy => {
    //    ...
    // })

    // Update enemy controls
    this.enemies.getChildren().forEach((enemy) => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;

      const length = Math.sqrt(dx * dx + dy * dy);

      if (length > 0) {
        const speed = 80;
        enemy.body.setVelocity((dx / length) * speed, (dy / length) * speed);
      }
    });

    // TEMPORARY enemy counter
    this.enemyCounterText.setText("Enemies: " + this.enemies.countActive(true));

    // Health bar
    if (!this.isPlayerDead) {
      const healthPercent = Phaser.Math.Clamp(
        this.playerHp / this.playerMaxHp,
        0,
        1,
      );
      this.healthBar.width = Math.floor(200 * healthPercent);

      // Change color when low
      if (healthPercent > 0.6) {
        this.healthBar.setFillStyle(0x00ff00);
      } else if (healthPercent > 0.3) {
        this.healthBar.setFillStyle(0xffff00);
      } else {
        this.healthBar.setFillStyle(0xff0000);
      }
    } else {
      // Ensure it stays zero
      this.healthBar.width = 0;
    }
  }

  spawnEnemy() {
    const { width, height } = this.scale;

    // Random edge spawn
    let x, y;
    const side = Phaser.Math.Between(0, 3);

    if (side === 0) {
      x = 0;
      y = Phaser.Math.Between(0, height);
    } else if (side === 1) {
      x = width;
      y = Phaser.Math.Between(0, height);
    } else if (side === 2) {
      x = Phaser.Math.Between(0, width);
      y = 0;
    } else {
      x = Phaser.Math.Between(0, width);
      y = height;
    }

    const enemy = this.add.rectangle(x, y, 30, 30, 0xff0000);
    this.physics.add.existing(enemy);
    enemy.body.setAllowGravity(false);
    enemy.body.setImmovable(true);
    enemy.body.setCircle(12);
    enemy.body.setCollideWorldBounds(true);

    this.enemies.add(enemy);
  }

  handlePlayerHit(player, enemy) {
    const now = this.time.now;

    if (now < this.lastDamageTime + this.damageCooldown) {
      return;
    }

    this.lastDamageTime = now;

    this.playerHp = Phaser.Math.Clamp(this.playerHp - 10, 0, this.playerMaxHp);

    if (this.playerHp < 0) {
      this.playerHp = 0;
    }

    console.log("HP:", this.playerHp);

    if (this.playerHp <= 0 && !this.isPlayerDead) {
      this.isPlayerDead = true;
      this.player.setFillStyle(0x555555);

      // Stop spawning
      this.enemySpawnEvent.remove(false);

      // Stop all enemies
      this.enemies.getChildren().forEach((enemy) => {
        enemy.body.setVelocity(0);
      });

      // Kill health bar visually
      this.healthBar.width = 0;

      // Optional: show text
      this.add
        .text(400, 300, "YOU DIED", {
          fontSize: "48px",
          fill: "#ffffff",
        })
        .setOrigin(0.5);
    }
  }
}
