import * as THREE from 'three';
import Deformation from './Deformation';
import { fragment, vertex } from './shaders/gradiant';

export default class LavaBall {
	private size: number = 2;
	private precision: number = 128;
	private geometry: THREE.LatheGeometry;
	private copyGeo: THREE.LatheGeometry;
	private material: THREE.ShaderMaterial|undefined;
	private mesh: THREE.Mesh|undefined;
	private impact: number = 128;

	// Animation
	private deformations: Deformation[] = [];

	public constructor (
		scene: THREE.Scene,
		position: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
		coefs: number[] = [0.7, 0.891]
	) {
		THREE.Cache.enabled = true;

		const points = [];
		for (let deg = 0; deg <= 180; deg += 6) {
			const rad = Math.PI * deg / 180;
			const point = new THREE.Vector2(
				(coefs[0] + coefs[1] * Math.cos(rad)) * Math.sin(rad),
				- Math.cos(rad)
			); // the "egg equation"
			points.push(point);
		}

		this.geometry = new THREE.LatheGeometry(points, this.precision);
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				colorA: { type: 'vec3', value: new THREE.Color(0xed3d68) },
				colorB: { type: 'vec3', value: new THREE.Color(0x362e9c) }
			},
			vertexShader: vertex,
			fragmentShader: fragment
		});
		this.copyGeo = this.geometry.clone();

		this.deformations.push(new Deformation(this.copyGeo.vertices));
		this.deformations.push(new Deformation(this.copyGeo.vertices));
		this.deformations.push(new Deformation(this.copyGeo.vertices));
		this.deformations.push(new Deformation(this.copyGeo.vertices));

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(position.x, position.y, position.z);
		scene.add(this.mesh);
	}

	public calculate () {
		if (this.mesh) {
			this.geometry.verticesNeedUpdate = true;
			const d = this.impact / this.precision;
			// const deplacement = new THREE.Vector3(0, 0, 0);
			this.deformations.forEach((deformation) => {
				deformation.computeDeformation();
				// deplacement.add(deformation.peak);
			});

			this.geometry.vertices.forEach((vertice, key) => {
				let f: number = 1;
				this.deformations.forEach((deformation) => {
					if (deformation.isWithinReach(this.copyGeo.vertices[key], d)) {
						f = f * deformation.force(this.copyGeo.vertices[key], d);
					}
				});
				vertice.set(this.copyGeo.vertices[key].x * f, this.copyGeo.vertices[key].y * f, this.copyGeo.vertices[key].z * f);
			});

			this.mesh.rotation.x += (0.001 + Math.random() / 100);
			this.mesh.rotation.y += (0.001 + Math.random() / 100);
			this.mesh.rotation.z += (0.001 + Math.random() / 100);
			// this.mesh.position.add(new THREE.Vector3(0.001 * deplacement.x, 0.001 * deplacement.y, 0.001 * deplacement.z));
		}
	}
}
