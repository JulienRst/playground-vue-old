<template>
	<div class="render" id="tunnel-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';
import MouseControl from '@/utils/MouseControl';
import noise from '@/utils/Noise';
import { hslToRgb } from '@/utils/Color';

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
	private frameRate = 1000 / 20;
	private speed = 0.1;
	private delta = 0;
	// Tube
	private curve!: THREE.CatmullRomCurve3;
	private tubeGeometry!: THREE.TubeGeometry;
	private tubeMaterial!: THREE.MeshStandardMaterial;
	private splineMesh!: THREE.Line;
	private tube!: THREE.Mesh;
	private tubeGeometryO!: THREE.TubeGeometry;

	public mounted () {
		const target: HTMLElement|null = document.querySelector('#tunnel-render');
		// Init Utils
		if (target) {
			this.windowControl = new WindowControl(target);
			this.mouseControl = new MouseControl(target);
			this.screenSize = this.windowControl.screenSize();
			// Init Three
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera(15, this.screenSize.ratio, 0.01, 10);
			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setClearColor(0xFFFFFF);
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
		this.scene.fog = new THREE.Fog(0xFFFFFF, 0, 1);
	}

	private initTunnel () {
		const points: THREE.Vector3[] = [];
		// Init points along z-axis
		for (let i = 0; i < 5; i++) {
			points.push(new THREE.Vector3(0, 0, 3 * (i / 4)));
		}
		// Create the curve from the points
		this.curve = new THREE.CatmullRomCurve3(points);
		// Spline
		const geometry = new THREE.Geometry();
		geometry.vertices = this.curve.getPoints(120);
		this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());
		// Tube
		this.tubeGeometry = new THREE.TubeGeometry(this.curve, 120, 0.02, 4, false);
		this.tubeMaterial = new THREE.MeshStandardMaterial({
			side: THREE.BackSide,
			vertexColors: THREE.FaceColors
		});

		for (const f of this.tubeGeometry.faces) {
			const p = this.tubeGeometry.vertices[f.a];
			const color = new THREE.Color(
				'hsl(' + (Math.floor(
					Math.abs(noise.simplex3(p.x * 2, p.y * 4, p.z * 2)) * 80 * 100
				) * 0.01 + 180) +
				', 70%, 60%)'
			);
			f.color = color;
		}

		this.tube = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
		this.tubeGeometryO = this.tubeGeometry.clone();
		this.scene.add(this.tube);
		this.animate();
	}

	private calculate () {
		let index = 0;
		let verticeO = null;
		let vertice = null;
		// Update geometry
		for (let i = 0; i < this.tubeGeometry.vertices.length; i += 1) {
			verticeO = this.tubeGeometryO.vertices[i];
			vertice = this.tubeGeometry.vertices[i];
			index = Math.floor(i / 120);
			vertice.x +=
			(verticeO.x + (this.splineMesh.geometry as THREE.Geometry).vertices[index].x - vertice.x) /
			15;
			vertice.y +=
			(verticeO.y + (this.splineMesh.geometry as THREE.Geometry).vertices[index].y - vertice.y) /
			15;
			vertice.applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.sin(this.delta + vertice.z * 10) * 0.1);
		}
		this.tubeGeometry.verticesNeedUpdate = true;

		this.delta += 0.02;

		// const mouse = this.mouseControl.getPosition();
		// this.curve.points[2].x = mouse.x * 0.02;
		// this.curve.points[4].x = mouse.x * 0.02;

		// this.curve.points[2].y = mouse.y * 0.02;
		// this.curve.points[4].y = mouse.y * 0.02;

		const mouse = this.mouseControl.getPosition();
		this.curve.points[2].x = - mouse.x * 0.002;
		this.curve.points[2].y = - mouse.y * 0.002;
		this.curve.points[4].x = - mouse.x * 0.002;
		this.curve.points[4].y = - mouse.y * 0.002;

		(this.splineMesh.geometry as THREE.Geometry).verticesNeedUpdate = true;
		(this.splineMesh.geometry as THREE.Geometry).vertices = this.curve.getPoints(120);

		// Update material
		for (const face of this.tubeGeometry.faces) {
			const p = this.tubeGeometry.vertices[face.a];
			const h = (
				Math.floor(
					Math.abs(
						noise.simplex3(p.x * 2, p.y * 4, p.z * 2 + this.delta * 0.1)
					) * 80 * 100
				) * 0.01 + 180) / 360;
			const rgb = hslToRgb(h, 0.7, 0.6);
			const color = new THREE.Color(rgb[0], rgb[1], rgb[2]);
			face.color = color;
		}
		this.tubeGeometry.elementsNeedUpdate = true;
	}

	private setCamera () {
		this.camera.position.z = 2.8;
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