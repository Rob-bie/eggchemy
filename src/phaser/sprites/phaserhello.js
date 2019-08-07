import { GameObjects } from 'phaser'

export class PhaserHello extends GameObjects.Sprite {

	constructor(scene, x, y, key) {
		super(scene, x, y, key);
		this.add();
	}

	update() {
		if(this.body.x <= 0) {
			this.body.setVelocityX(400);
		}

		if(this.body.x >= this.scene.game.config.width - this.width) {
			this.body.setVelocityX(-400);
		}
	}

	add() {
		this.scene.add.existing(this);
		this.scene.physics.world.enable(this);
		this.body.setVelocityX(-400);
	}

}
