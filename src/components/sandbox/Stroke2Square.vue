<template>
	<div class="render" id="stroke2square-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';

const THETA = 0.001;

@Component({
	name: 'Stroke2Square'
})
export default class Stroke2Square extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private framerate = 1000 / 30;
	// StrokeToSquare
	private numberOfStrokes = 7;
	private strokes: THREE.LineSegments[] = [];
	// Clock
	private clock = new THREE.Clock(true);
	private speed = 1.2;


	public mounted () {
		const target: HTMLElement|null = document.querySelector('#stroke2square-render');
		// Init Utils
		this.windowControl = new WindowControl(target);
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, this.screenSize.ratio, 0.1, 500);
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.setSize();
		this.setCamera();

		// Init Dom
		if (target) {
			target.appendChild(this.renderer.domElement);
			this.initStroke2Square();
			this.animate();
		}
		window.addEventListener('resize', this.setSize);
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	}

	private setCamera () {
		this.camera.position.set(10, 10, 10);
		this.camera.lookAt(0, 0, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initStroke2Square () {
		const geometry = new THREE.BoxGeometry(THETA, THETA, 1);
		const edges = new THREE.EdgesGeometry(geometry);
		for (let i = 0; i < this.numberOfStrokes; i++) {
			const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
			line.position.set(0, 0, this.numberOfStrokes / 2 - 2 * i);
			this.strokes.push(line);
			this.scene.add(line);
		}
	}

	private timeToMovement = (time: number) => Math.cos(time) + 1;

	private calculate () {
		const time = this.clock.getElapsedTime() * this.speed;
		this.strokes.forEach((stroke: THREE.LineSegments, index) => {
			const tDelta = time - (Math.PI / this.numberOfStrokes / 1.5) * index;
			const x = this.timeToMovement(tDelta) * 4;
			const y = this.timeToMovement(tDelta) * 4;
			const z = this.timeToMovement(tDelta + Math.PI) * 0.5;
			stroke.geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(x, y , z));
		});
	}

	private animate () {
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
	}
}
</script>