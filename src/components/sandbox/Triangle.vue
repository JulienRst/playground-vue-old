<template>
	<div class="render" id="triangle-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';

@Component({
	name: 'TriangleComponent'
})
export default class TriangleComponent extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private sceneSize: { w: number, h: number } = { w: 0, h: 0 };
	private time: number = 0;

	// Params
	private frameRate = 1000 / 30;
	private triangleSize = 5;
	private triangleCount = 15;
	private loopDuration = 500;
	private direction = -1;

	// Triangles
	private trianges: THREE.Line[] = [];

	public mounted () {
		console.log('///////////// Mounted');
		const target: HTMLElement|null = document.querySelector('#triangle-render');
		// Init Utils
		this.windowControl = new WindowControl(target);
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, this.screenSize.ratio, 0.1, 500);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		// Add Alpha
		this.renderer.setClearColor(0x151515, 1);
		this.setSize();
		this.setCamera();
		this.sceneSize.w = this.windowControl.getVisibleWidth(this.camera);
		this.sceneSize.h = this.windowControl.getVisibleHeight(this.camera);

		// Init Dom
		if (target) {
			target.appendChild(this.renderer.domElement);
		}
		window.addEventListener('resize', this.setSize);

		// Init Render
		this.initAllTriangles();
		this.animate();
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	}

	private setCamera () {
		this.camera.position.set(0, 0, 10);
		this.camera.lookAt(0, 0, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private drawEquilateralTriangle (size: number, rotation: number = 0) {
		const d = Math.tan(Math.PI / 6) * size;
		const geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0, size / 2, 0));
		geometry.vertices.push(new THREE.Vector3(d, -size / 2, 0));
		geometry.vertices.push(new THREE.Vector3(-d, -size / 2, 0));
		geometry.vertices.push(new THREE.Vector3(0, size / 2, 0));

		const line = new THREE.Line(
			geometry,
			new THREE.LineBasicMaterial({ color: 0xbdc3c7 })
		);

		line.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotation);
		this.trianges.push(line);
		this.scene.add(line);
	}

	private initAllTriangles () {
		for (let i = this.triangleCount; i > 0; i--) {
			const size = this.triangleSize * i / this.triangleCount;
			this.drawEquilateralTriangle(size);
		}
	}

	private calculate () {
		this.trianges.forEach((triangle, key) => {
			triangle.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0);
			triangle.rotation.z = key * this.time;
		});
	}

	private animate () {
		this.time += this.direction * (2 * Math.PI / 110) / (this.loopDuration / this.frameRate);
		if (this.time > Math.PI / 110 || this.time < - Math.PI / 110) { this.direction = -this.direction; }
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.frameRate);
	}
}
</script>