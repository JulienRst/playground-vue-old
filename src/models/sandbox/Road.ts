import * as THREE from 'three';
import { fragmentShader, vertexShader } from '@/models/sandbox/shaders/road';

export interface RoadOptions {
	width: number;
	depth: number;
}

export default class Road {
	public mesh!: THREE.Mesh;
	private options: any;

	constructor (options: RoadOptions) {
		this.options = options;
	}

	public init () {
		const options = this.options;
		const geometry = new THREE.PlaneBufferGeometry(
			options.depth, options.width, 20, 20,
		);

		const material = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms: {
				uColor: new THREE.Uniform(new THREE.Color(0x222222))
			}
		});

		this.mesh = new THREE.Mesh(geometry, material);
		// this.mesh.position.z = -options.length / 2;
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.rotation.z = Math.PI / 2;
	}
}
