<template>
	<div class="render" ref="container"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';

@Component({
	name: 'NormalVertexPartyComponent'
})
export default class NormalVertexPartyComponent extends Vue {
	private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
	private scene: THREE.Scene = new THREE.Scene();
	private container!: HTMLElement;
	private timeout: number = -1;
	private bindedResize!: () => void;

	private points: THREE.Mesh[] = [];
	private triangles: THREE.Mesh[] = [];
	private mainGroup: THREE.Group = new THREE.Group();

	private pointGeometry: THREE.SphereBufferGeometry = new THREE.SphereBufferGeometry(0.01, 64, 64);
	private pointMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
		color: 0x98A6E9,
		side: THREE.DoubleSide
	});

	private numberOfPoints = 30;
	private delay = 100;

	public mounted () {
		this.renderer.setClearColor(0xffffff, 0);
		this.bindedResize = this.resize.bind(this);

		this.init(this.$refs.container as HTMLElement);
	}

	public init (container: HTMLElement) {
		this.container = container;
		this.container.appendChild(this.renderer.domElement);
		this.resize();
		this.animate();
		this.initLight();
		this.scene.add(this.mainGroup);
		this.renderer.render(this.scene, this.camera);
		window.addEventListener('resize', this.bindedResize);

		this.points = [];
		this.triangles = [];
		this.mainGroup.children = [];

		for (let i = 0; i < this.numberOfPoints; i++) {
			window.setTimeout(() => {
				this.generateNewPoint();
			}, i * this.delay);
		}
	}

	public resize () {
		this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
		this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
		this.camera.position.z = 10;
		this.camera.updateProjectionMatrix();
	}

	public initLight () {
		const al = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(al);
	}

	public generateNewPoint () {
		const MESH = new THREE.Mesh(this.pointGeometry, this.pointMaterial);
		MESH.position.set(
			Math.random() * 10 - 5,
			Math.random() * 10 - 5,
			Math.random() * 10 - 5,
		);

		this.addPoint(MESH);
	}


	public addPoint (mesh: THREE.Mesh) {
		this.points.push(mesh);
		const l = this.points.length;
		if (this.points.length > 2) {
			const triangle = new THREE.Triangle(mesh.position, this.points[l - 2].position, this.points[l - 3].position);
			const triangleGeometry = new THREE.Geometry();
			triangleGeometry.vertices.push(triangle.a, triangle.b, triangle.c);
			let normal = new THREE.Vector3(1, 1, 1);
			normal = triangle.getNormal(normal);
			triangleGeometry.faces.push(new THREE.Face3(0, 1, 2, normal));
			this.triangles.push(
				new THREE.Mesh(
					triangleGeometry,
					new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.5, side: THREE.DoubleSide })
				)
			);
			this.mainGroup.add(this.triangles[this.triangles.length - 1]);
		}
	}

	public animate () {
		this.renderer.render(this.scene, this.camera);
		this.mainGroup.rotation.z += 0.001;
		this.mainGroup.rotation.x += 0.001;
		this.timeout = window.setTimeout(() => this.animate(), 1000 / 25);
	}

	public beforeDestroy () {
		window.clearTimeout(this.timeout);
		window.removeEventListener('resize', this.bindedResize);
	}
}
</script>