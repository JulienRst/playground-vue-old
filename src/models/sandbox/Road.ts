import * as THREE from 'three';
import { fragmentShader, vertexShader } from '@/models/sandbox/shaders/road';
import { myCustomDistortion } from '@/utils/Distortion';

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
		// console.log(this.options);
		const geometry = new THREE.PlaneBufferGeometry(
			this.options.width, this.options.depth, 20, 200,
		);

		const material = new THREE.ShaderMaterial({
			fragmentShader,
			vertexShader,
			uniforms: Object.assign(
				{
					uColor: new THREE.Uniform(new THREE.Color(0x222222)),
					uTravelLength: new THREE.Uniform(this.options.depth)
				},
				myCustomDistortion.uniforms
			),
			side: THREE.DoubleSide
		});

		material.onBeforeCompile = (shader) => {
			shader.vertexShader = shader.vertexShader.replace('#include', myCustomDistortion.getDistortion);
		};


		this.mesh = new THREE.Mesh(geometry, material);
		this.mesh.rotation.x = -Math.PI / 2;
		this.mesh.position.z = -this.options.depth / 2;
	}
}
