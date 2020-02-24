<template>
	<div class="render" id="infinite-cube-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';

@Component({
	name: 'InfiniteCubeComponent'
})
export default class InfiniteCubeComponent extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private sceneSize: { w: number, h: number } = { w: 0, h: 0 };
	// Cube
	private cubeSize: number = 0.3;
	private cubeGroup: THREE.Group = new THREE.Group();
	private cubeGeometry: THREE.BoxBufferGeometry = new THREE.BoxBufferGeometry(
		this.cubeSize,
		this.cubeSize,
		this.cubeSize
	);
	// private cubeGeometry: THREE.SphereBufferGeometry = new THREE.SphereBufferGeometry(this.cubeSize / 2, 16, 16);

	// Params
	private numberPerSide = 13;
	private offset = 3;
	private speed = 0.05;
	// Colors
	private red = { r: 255, g: 0, b: 255 };
	private blue = { r: 0, g: 0, b: 255 };

	private loopDuration = 1500; // in MS;
	private currentTime = 0;
	private frameRate = 1000 / 30;

	public mounted () {
		const target: HTMLElement|null = document.querySelector('#infinite-cube-render');
		// Init Utils
		this.windowControl = new WindowControl(target);
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(60, this.screenSize.ratio, 0.1, 500);
		this.renderer = new THREE.WebGLRenderer();
		// Add Alpha
		this.renderer.setClearColor(0x101010, 1);
		this.setSize();
		this.setCamera();

		// Init Dom
		if (target) {
			target.appendChild(this.renderer.domElement);
		}

		window.addEventListener('resize', this.setSize);

		this.initCube();
		this.animate();
	}

	public beforeDestroy () {
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		}
	}

	private setCamera () {
		this.camera.position.set(0, 4, 8);
		this.camera.lookAt(0, 0, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private getColorForPercent (percentOfDistant: number): string {
		// Percent of distant is between 0 and 1

		const color = {
			r: Math.round(this.red.r + percentOfDistant * (this.blue.r - this.red.r)),
			g: Math.round(this.red.g + percentOfDistant * (this.blue.g - this.red.g)),
			b: Math.round(this.red.b + percentOfDistant * (this.blue.b - this.red.b))
		};
		const colorString = {
			r: ('0' + color.r.toString(16)).slice(-2),
			g: ('0' + color.g.toString(16)).slice(-2),
			b: ('0' + color.b.toString(16)).slice(-2)
		};
		return `#${colorString.r}${colorString.g}${colorString.b}`;
	}

	private initCube () {
		for (let i = 1; i <= this.numberPerSide; i++) {
			for (let j = 1; j <= this.numberPerSide; j++) {
				const index = (i - 1) * this.numberPerSide + (j - 1);
				const percentOfDistant =
					this.calcDistFromIndex(index) /
					this.calcDistFromIndex(this.numberPerSide * this.numberPerSide);
				const color = this.getColorForPercent(percentOfDistant);
				const cubeMaterial = new THREE.MeshBasicMaterial({ color });
				const cubeMesh = new THREE.Mesh(this.cubeGeometry, cubeMaterial);
				cubeMesh.position.x = (i - 0.5 - this.numberPerSide / 2) * this.cubeSize * 1;
				cubeMesh.position.z = (j - 0.5 - this.numberPerSide / 2) * this.cubeSize * 1;
				this.cubeGroup.add(cubeMesh);
			}
		}

		this.cubeGroup.position.y = 0;
		this.scene.add(this.cubeGroup);
	}

	private calcDistFromIndex (i: number): number {
		const x = i % this.numberPerSide;
		const y = Math.floor(i / this.numberPerSide);
		const center = Math.floor(this.numberPerSide / 2);
		return Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
	}

	private easeInOut (currentTime: number, startValue: number, endValue: number, totalDuration: number): number {
		currentTime /= totalDuration / 2;
		if (currentTime < 1) {
			return endValue / 2 * Math.pow(currentTime, 3) + startValue;
		} else {
			currentTime -= 2;
			return endValue / 2 * (Math.pow(currentTime, 3) + 2) + startValue;
		}
	}

	private calculate () {
		this.cubeGroup.children.forEach((cube, i) => {
			const ratioDist = this.calcDistFromIndex(i) / this.calcDistFromIndex(this.numberPerSide * this.numberPerSide);
			const timeDist = this.currentTime / this.loopDuration;
			if (ratioDist < timeDist) {
				cube.position.y = this.easeInOut(
					this.currentTime - ratioDist * this.loopDuration,
					0,
					this.offset,
					this.loopDuration - ratioDist * this.loopDuration
				);
			}
		});
		this.cubeGroup.position.y -= this.offset / (this.loopDuration / this.frameRate);
		this.cubeGroup.rotation.y -= this.speed / 3;
	}

	private animate () {
		this.currentTime += this.frameRate;
		if (this.currentTime < this.loopDuration) {
			this.calculate();
			this.renderer.render(this.scene, this.camera);
			this.timeout = window.setTimeout(() => { this.animate(); }, this.frameRate);
		} else {
			this.currentTime = 0;
			this.cubeGroup.position.y = 0;
			this.cubeGroup.children.forEach((cube) => { cube.position.y = 0; });
			this.animate();
		}
	}
}
</script>