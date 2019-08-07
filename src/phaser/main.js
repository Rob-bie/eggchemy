import Phaser from 'phaser'
import { config } from './config'

export class PhaserMain {

	constructor() {

	}

    go() {
        return new Phaser.Game(config);
    }

}
