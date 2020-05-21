<template>
	<div class="render" id="road-light-render" @mousedown="onMouseDown" @mouseup="onMouseUp"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';
import Road from '@/models/sandbox/Road';
import CarLights from '@/models/sandbox/CarLights';
import lerp from '@/utils/Lerp';

@Component({
	name: 'RoadLight'
})
export default class RoadLight extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private framerate = 1000 / 25;
	private time = 0;
	// Models
	private road!: Road;
	private leftLights!: CarLights;
	private rightLights!: CarLights;
	// Params
	private roadWidth = 40;
	private roadDepth = 400;
	private numberOfLights = 40;
	private gutter = 2;
	// Animation
	private speedUpTarget = 0;
	private speedUp = 0;
	private timeOffset = 0;
	private fovTarget = 90;


	public mounted () {
		const target: HTMLElement|null = document.querySelector('#road-light-render');
		// Init Utils
		this.windowControl = new WindowControl(target);
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(90, this.screenSize.ratio, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.setSize();
		this.setCamera();

		// Init Dom
		if (target) {
			target.appendChild(this.renderer.domElement);
			this.initRoad();
			this.initCarLights();
			this.animate();
		}
		window.addEventListener('resize', this.setSize);
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	}

	public onMouseDown () {
		this.speedUpTarget = 0.5;
		this.fovTarget = 140;
	}

	public onMouseUp () {
		this.speedUpTarget = 0;
		this.fovTarget = 90;
	}

	private setCamera () {
		this.camera.position.set(0, 10, this.roadDepth / 4);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initRoad () {
		this.road = new Road({ width: this.roadWidth, depth: this.roadDepth });
		this.road.init();
		this.scene.add(this.road.mesh);
	}

	private initCarLights () {
		this.leftLights = new CarLights({
			n: this.numberOfLights,
			roadWidth: this.roadWidth,
			roadDepth: this.roadDepth,
			roadSections: 6,
			color: new THREE.Color(0xFAFAFA),
			speed: -40
		});
		this.rightLights = new CarLights({
			n: this.numberOfLights,
			roadWidth: this.roadWidth,
			roadDepth: this.roadDepth,
			roadSections: 6,
			color: new THREE.Color(0xFF102A),
			speed: 40
		});
		this.leftLights.init();
		this.rightLights.init();

		this.leftLights.mesh.position.setX(
			- (this.gutter / 2)
		);

		this.rightLights.mesh.position.setX(
			this.roadWidth / 2 + this.gutter / 2
		);

		this.scene.add(this.leftLights.mesh);
		this.scene.add(this.rightLights.mesh);
	}

	private calculate () {
		this.speedUp += lerp(
			this.speedUp,
			this.speedUpTarget,
			0.1,
			0.00001
		);
		this.timeOffset += this.speedUp;
		this.time += 0.1;

		const elapsedTime = this.time + this.timeOffset;

		const fovChange = lerp(this.camera.fov, this.fovTarget, 0.1, 0.00001);
		if (fovChange !== 0) {
			this.camera.fov += fovChange;
			this.camera.updateProjectionMatrix();
		}

		this.leftLights.update(elapsedTime);
		this.rightLights.update(elapsedTime);
	}

	private animate () {
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
	}
}
</script>