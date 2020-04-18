<template>
	<div class="render" id="tunnel-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';
import MouseControl from '@/utils/MouseControl';

@Component({
	name: 'TunnelComponent'
})
export default class TunnelComponent extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	private loader: THREE.TextureLoader = new THREE.TextureLoader();
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private mouseControl!: MouseControl;
	private screenSize!: { w: number, h: number, ratio: number };
	// Settings
	private frameRate = 1000 / 24;
	private speed = 0.1;
	// Tube
	private curve!: THREE.CatmullRomCurve3;
	private tubeGeometry!: THREE.TubeGeometry;
	private tubeMaterial!: THREE.MeshStandardMaterial;
	private splineMesh!: THREE.Line;
	private tube!: THREE.Mesh;
	private tubeGeometryO!: THREE.TubeGeometry;

	public mounted () {
		console.log('///// INIT');
		const target: HTMLElement|null = document.querySelector('#tunnel-render');
		// Init Utils
		if (target) {
			this.windowControl = new WindowControl(target);
			this.mouseControl = new MouseControl(target);
			this.screenSize = this.windowControl.screenSize();
			// Init Three
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(2, this.screenSize.ratio, 0.1, 100000);
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0x000000);
			// Add Alpha
			this.setSize();
			this.setCamera();
			// Init Dom
			target.appendChild(this.renderer.domElement);
			// Init Event
			window.addEventListener('resize', this.setSize);
			// Init Scene
			this.initLight();
			this.initTunnel();
		} else {
			console.warn('Invalid html render receiver');
		}
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
		this.mouseControl.beforeDestroy();
	}

	private initLight () {
		const light = new THREE.HemisphereLight( 0xffffbb, 0x887979, 0.9);
		const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
		this.scene.add(light);
		this.scene.add(directionalLight);
		this.scene.fog = new THREE.Fog(0x000000, 0.1, 2);
	}

	private initTunnel () {
		this.loader.load('/assets/textures/stonePattern.jpg', (texture) => {
			const points: THREE.Vector3[] = [];
			// Init points along z-axis
			for (let i = 0; i < 5; i++) {
				points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)));
			}
			// Create the curve from the points
			this.curve = new THREE.CatmullRomCurve3(points);
			// Spline
			const geometry = new THREE.Geometry();
			geometry.vertices = this.curve.getPoints(70);
			this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());
			// Tube
			this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.01, 50, false);
			this.tubeMaterial = new THREE.MeshStandardMaterial({
				side: THREE.BackSide,
				map: texture
			});

			// Avoid the texture to be stretch
			if (this.tubeMaterial && this.tubeMaterial.map) {
				this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
				this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
				this.tubeMaterial.map.repeat.set(30, 6);
			}

			this.tube = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
			this.tubeGeometryO = this.tubeGeometry.clone();
			this.scene.add(this.tube);
			this.animate();
		});
	}

	private calculate () {
		// Update material offset
		if (this.tubeMaterial && this.tubeMaterial.map) {
			this.tubeMaterial.map.offset.x += (this.mouseControl.isPressed()) ? -3 * this.speed : this.speed;
		}
		// Update geometry
		let index = 0;
		let verticeO = null;
		let vertice = null;
		for (let i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
			verticeO = this.tubeGeometryO.vertices[i];
			vertice = this.tubeGeometry.vertices[i];
			index = Math.floor(i / 50);
			vertice.x +=
			(verticeO.x + (this.splineMesh.geometry as THREE.Geometry).vertices[index].x - vertice.x) /
			10;
			vertice.y +=
			(verticeO.y + (this.splineMesh.geometry as THREE.Geometry).vertices[index].y - vertice.y) /
			5;
		}
		this.tubeGeometry.verticesNeedUpdate = true;
		const mouse = this.mouseControl.getPosition();
		this.curve.points[2].x = mouse.x * 0.00002;
		this.curve.points[4].x = mouse.x * 0.00002;
		this.curve.points[2].y = mouse.y * 0.00002;

		(this.splineMesh.geometry as THREE.Geometry).verticesNeedUpdate = true;
		(this.splineMesh.geometry as THREE.Geometry).vertices = this.curve.getPoints(70);
	}

	private setCamera () {
		this.camera.position.set(0, 0, 2);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private animate () {
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.frameRate);
	}
}
</script>