import * as THREE from 'three';
import { Vector3 } from 'three';

export default class Deformation {
	public peak: THREE.Vector3;
	private counter: number; // Minimum 1;
	private counterAmplitude: number;
	private velocity: number;
	private direction: number = 1;
	private vertices: THREE.Vector3[];


	public constructor (vertices: THREE.Vector3[]) {
		this.vertices = vertices;
		this.counter = 1;
		this.counterAmplitude = 10;
		this.peak = this.vertices[Math.round(Math.random() * this.vertices.length)];
		this.velocity = Math.random() / 10 + 0.01;
	}

	public computeDeformation () {
		this.counter += this.direction * this.velocity;
		if ((this.direction > 0) ? this.counter >= this.counterAmplitude : this.counter <= 1) {
			this.direction *= -1;
			if (this.direction === -1) {
				this.init();
			}
		}
	}

	public force (vertice: Vector3, d: number): number {
		const ampl = this.peak.distanceTo(vertice);
		return 1 + (Math.sqrt((d - ampl)) / Math.exp(this.counter));
	}

	public isWithinReach (vertice: THREE.Vector3, amplitude: number) {
		return this.peak.distanceTo(vertice) < amplitude;
	}

	private init () {
		this.peak = this.vertices[Math.round(Math.random() * this.vertices.length)];
		this.velocity = Math.random() / 10 + 0.01;
	}
}
