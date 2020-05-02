<template>
	<div class="render" id="dummy-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';

@Component({
	name: 'Dummy'
})
export default class Dummy extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private framerate = 1000 / 30;
	// Dummy
	private dummy!: THREE.Mesh;


	public mounted () {
		const target: HTMLElement|null = document.querySelector('#dummy-render');
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
			this.initDummy();
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
		this.camera.position.set(0, 0, 10);
		this.camera.lookAt(0, 0, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initDummy () {
		const geo = new THREE.BoxGeometry(2, 2, 2);
		const mat = new THREE.MeshNormalMaterial();
		this.dummy = new THREE.Mesh(geo, mat);
		this.scene.add(this.dummy);
	}

	private calculate () {
		this.dummy.rotation.x += 0.01;
		this.dummy.rotation.y += 0.01;
		this.dummy.rotation.z += 0.01;
	}

	private animate () {
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
	}
}
</script>