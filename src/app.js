import { PhaserMain } from './phaser/main'

export class App {

    constructor() {

    }

    attached() {
		FBInstant.initializeAsync()
			.then(() => {
				new PhaserMain().go();
			});
    }

}
