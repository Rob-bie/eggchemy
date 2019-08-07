import { Scene } from 'phaser';

export class LoaderScene extends Scene {

	constructor() {
		super({ key: 'LoaderScene' });
	}

	preload() {
		this.facebook.once('startgame', this.start, this);
		this.facebook.showLoadProgress(this);

		this.load.image('grassBg', 'src/assets/grass.png');
		this.load.image('yellow', 'src/assets/yellow.png');
		this.load.image('pink', 'src/assets/pink.png');
		this.load.image('purple', 'src/assets/purple.png');
		this.load.image('brown', 'src/assets/brown.png');
	}

	start() {
		this.scene.start('GameScene');
	}


}
