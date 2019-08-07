import { LoaderScene } from './scenes/loaderscene';
import { GameScene } from './scenes/gamescene';

export const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
	scale: {
		mode: Phaser.DOM.ENVELOP,
		width: window.innerWidth,
		height: window.innerHeight,
		autoCenter: Phaser.DOM.CENTER_BOTH
	},
	backgroundColor: '#CC8899',
	scene: [
		LoaderScene,
		GameScene
	]
};
