import { Scene } from 'phaser';
import { Math as PMath } from 'phaser';
import { eggRecipes } from '../util/eggs';

export class GameScene extends Scene {

	constructor() {
		super({ key: 'GameScene' });
	}

	create() {
		/* INITS */
		this.capacity = 6;
		this.eggsOnScreen = 0;
		this.eggs = {};

		//setInterval(() => { console.log(this.eggs) }, 1000);

		this.addBg();
		this.dragHandler();
		this.startEggSpawner();
	}

	addBg() {
		this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'grassBg').setOrigin(0.5, 0.5);
	}

	dragHandler() {
		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.input.on('dragend', (pointer, gameObject, dragX, dragY) => {
			this.checkForOverlaps(gameObject);
		});
	}

	startEggSpawner() {
		this.time.addEvent({
			delay: 2500,
			loop: true,
			callbackScope: this,
			callback: () => {
				if(this.eggsOnScreen < this.capacity) this.placeEgg('yellow');
			}
		});
	}

	placeEgg(type, x, y) {
		let uuid = PMath.RND.uuid();
		let destX = x || PMath.RND.between(50, this.game.config.width - 50);
		let destY = y || PMath.RND.between(50, this.game.config.height - 50);
		let egg = this.add.image(destX, destY, type).setScale(0.25, 0.25);
		egg.uuid = uuid;
		egg.type = type;
		egg.alpha = 0;
		this.spawnTween(egg);
		this.eggs[uuid] = egg;
		this.eggsOnScreen++;
	}

	checkForOverlaps(egg) {
		let eggs = Object.values(this.eggs);
		for(let i = 0; i < eggs.length; i++) {
			if(egg.uuid !== eggs[i].uuid) {
				let eBounds = egg.getBounds();
				let tBounds = eggs[i].getBounds();
				let intersects = Phaser.Geom.Intersects.RectangleToRectangle(eBounds, tBounds);
				if(intersects) {
					this.tryCombine(egg, eggs[i]);
					break;
				}
			}
		}
	}

	tryCombine(eggA, eggB) {
		let newTypePosA = eggRecipes[eggA.type + eggB.type];
		let newTypePosB = eggRecipes[eggB.type + eggA.type];
		let newType = newTypePosA || newTypePosB;
		if(newType) {
			this.combineEggs(eggA, eggB, newType);
		} else {
			this.rejectEggs(eggA, eggB);
		}
	}

	combineEggs(eggA, eggB, newType) {
		if(!eggA.combining && !eggB.combining) {
			eggA.combining = true;
			eggB.combining = true;
			this.combineTween(eggA, eggB, newType);
		}
	}

	rejectEggs(eggA, eggB) {
		let target = PMath.RND.pick([eggA, eggB]);
		let axis = PMath.RND.pick(['x', 'y']);
		let current = target[axis];
		let bound = axis === 'x' ? this.game.config.width : this.game.config.height;
		let dest;
		if(current + 100 > bound) {
			dest = current - 50;
		} else if(current - 100 > 0) {
			dest = current + 50;
		} else {
			dest = current + 50;
		}
		let rejectTweenObj = {
			targets: target,
			duration: 1000,
			ease: 'Bounce.easeInOut',
			onComplete: () => {
				if(eggA) eggA.combining = false;
				if(eggB) eggB.combining = false;
			}
		}
		rejectTweenObj[axis] = dest;
		this.tweens.add(rejectTweenObj);
	}

	combineTween(eggA, eggB, newType) {
		delete this.eggs[eggA.uuid];
		delete this.eggs[eggB.uuid];
		let target = PMath.RND.pick([eggA, eggB]);
		let newLoc = {x: target.x, y: target.y};
		this.tweens.add({
			targets: [eggA, eggB],
			x: newLoc.x,
			y: newLoc.y,
			ease: 'Bounce.easeInOut',
			duration: 1000,
			onComplete: () => {
				this.eggsOnScreen -= 2;
				console.log('here', this.eggsOnScreen);
				this.destroyTween(eggA, eggB, newType, newLoc);
			}
		});
	}

	destroyTween(eggA, eggB, newType, newLoc) {
		this.tweens.add({
			targets: [eggA, eggB],
			alpha: 0,
			duration: 500,
			onComplete: () => {
				if(eggA) eggA.destroy();
				if(eggB) eggB.destroy();
				this.placeEgg(newType, newLoc.x, newLoc.y);
			}
		});
	}

	spawnTween(egg) {
		/* BREATHE */
		this.tweens.add({
			targets: egg,
			scaleX: 0.30,
			yoyo: true,
			duration: 500,
			repeat: -1
		});
		/* TILT */
		this.tweens.add({
			targets: egg,
			rotation: 0.25,
			duration: 750,
			repeat: -1,
			yoyo: true
		});
		/* FADE IN */
		this.tweens.add({
			targets: egg,
			alpha: 1.00,
			duration: 750,
			onComplete: () => {
				this.enableEgg(egg);
			}
		});
	}

	enableEgg(egg) {
		egg.setInteractive();
		this.input.setDraggable(egg);
	}


}
