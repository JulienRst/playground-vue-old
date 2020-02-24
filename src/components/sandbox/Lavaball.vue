<template>
	<div id="home-render"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as THREE from 'three';
import LavaBall from '@/models/sandbox/LavaBall';
import WindowControl from '@/utils/WindowControl';

@Component({})
export default class App extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Models
	private lavaballs!: LavaBall[];
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private sceneSize: { w: number, h: number } = { w: 0, h: 0 };

	public mounted () {
		// Init Utils
		this.windowControl = new WindowControl();
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, this.screenSize.ratio, 0.1, 500);
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		// Add Alpha
		this.renderer.setClearColor(0xffffff, 0);
		this.setSize();
		this.setCamera();
		this.sceneSize.w = this.windowControl.getVisibleWidth(this.camera);
		this.sceneSize.h = this.windowControl.getVisibleHeight(this.camera);

		// Init Dom
		const target: HTMLElement|null = document.querySelector('#home-render');
		if (target) {
			target.appendChild(this.renderer.domElement);
		}

		window.addEventListener('resize', this.setSize);

		this.initLavaBall();
		this.animate();
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	}

	private setCamera () {
		this.camera.position.set(0, 0, 10);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initLavaBall () {
		this.lavaballs = [
			new LavaBall(this.scene, new THREE.Vector3(- this.sceneSize.w / 6, - this.sceneSize.h / 4, 5.0), [0.71, 0.28]),
			new LavaBall(this.scene, new THREE.Vector3(this.sceneSize.w / 2.8, - this.sceneSize.h / 5, 1.0), [0.71, 0.28]),
			new LavaBall(this.scene, new THREE.Vector3(this.sceneSize.w / 8, this.sceneSize.h / 4, 5.0), [0.71, 0.28]),
			new LavaBall(this.scene, new THREE.Vector3(-this.sceneSize.w / 1.4, this.sceneSize.h / 3, -4.0), [0.71, 0.28])
		];
	}

	private animate () {
		this.lavaballs.forEach((lavaball) => {
			lavaball.calculate();
		});

		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, 1000 / 30);
	}
}
</script>

<style lang="scss">
	canvas {
		width: 100%;
		height: 100%;
	}
</style>
