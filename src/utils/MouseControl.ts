import * as THREE from 'three';

export default class MouseControl {

	public hasBeenUpdated: boolean = false;
	private container: HTMLElement;
	private bindedUpdateMouseCoordinate: (event: MouseEvent) => void;
	private bindedSetPressToTrue: () => void;
	private bindedSetPressToFalse: () => void;
	private x = 0;
	private y = 0;
	private pressed = false;

	constructor (container: HTMLElement) {
		this.container = container;
		this.bindedUpdateMouseCoordinate = this.updateMouseCoordinate.bind(this);
		this.bindedSetPressToTrue = this.setPressToTrue.bind(this);
		this.bindedSetPressToFalse = this.setPressToFalse.bind(this);
		this.initMouseTrigger();
	}

	public beforeDestroy () {
		this.container.removeEventListener('mousemove', this.bindedUpdateMouseCoordinate);
		this.container.removeEventListener('mousedown', this.bindedSetPressToTrue);
		this.container.removeEventListener('mouseup', this.bindedSetPressToFalse);
	}

	public getPosition () {
		return new THREE.Vector2(this.x, -this.y);
	}

	public isPressed (): boolean {
		return this.pressed;
	}

	private initMouseTrigger () {
		this.container.addEventListener('mousemove', this.bindedUpdateMouseCoordinate);
		this.container.addEventListener('mousedown', this.bindedSetPressToTrue);
		this.container.addEventListener('mouseup', this.bindedSetPressToFalse);
	}

	private setPressToTrue () {
		this.pressed = true;
	}

	private setPressToFalse () {
		this.pressed = false;
	}

	private updateMouseCoordinate (event: MouseEvent) {
		this.x = event.clientX - (this.container.offsetWidth / 2);
		this.y = event.clientY - (this.container.offsetHeight / 2);
		this.hasBeenUpdated = true;
	}
}
