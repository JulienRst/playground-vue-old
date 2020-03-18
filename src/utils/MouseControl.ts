import * as THREE from 'three';

export default class MouseControl {

	public hasBeenUpdated: boolean = false;
	private container: HTMLElement;
	private bindedUpdateMouseCoordinate: (event: MouseEvent) => void;
	private x = 0;
	private y = 0;

	constructor (container: HTMLElement) {
		this.container = container;
		this.bindedUpdateMouseCoordinate = this.updateMouseCoordinate.bind(this);
		this.initMouseTrigger();
	}

	public beforeDestroy () {
		this.container.removeEventListener('mousemove', this.bindedUpdateMouseCoordinate);
	}

	public getPosition () {
		return new THREE.Vector2(this.x, -this.y);
	}

	private initMouseTrigger () {
		this.container.addEventListener('mousemove', this.bindedUpdateMouseCoordinate);
	}

	private updateMouseCoordinate (event: MouseEvent) {
		this.x = event.clientX - (this.container.offsetWidth / 2);
		this.y = event.clientY - (this.container.offsetHeight / 2);
		this.hasBeenUpdated = true;
	}
}
