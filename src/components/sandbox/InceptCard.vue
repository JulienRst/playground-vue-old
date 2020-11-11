<template>
	<div class="render" id="inceptcard-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';
import { MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { createRoundedRect } from '@/utils/Shape';

@Component({
	name: 'InceptCard'
})
export default class InceptCard extends Vue {
	// Three
	private scene!: THREE.Scene;
	private imageScene!: THREE.Scene;
	private mainCamera!: THREE.PerspectiveCamera;
	private imageCamera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	private imageRenderer!: THREE.WebGLRenderer;
	private renderTarget!: THREE.WebGLRenderTarget;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private framerate = 1000 / 30;
	private isDebug = false;
	// Dummy
	private card!: THREE.Group;
	private image!: THREE.Group;


	public mounted () {
		console.log('////. Mounted');
		const target: HTMLElement|null = document.querySelector('#inceptcard-render');
		// Init Utils
		this.windowControl = new WindowControl(target);
		this.screenSize = this.windowControl.screenSize();
		// Init Three
		this.scene = new THREE.Scene();
		this.imageScene = new THREE.Scene();
		this.mainCamera = new THREE.PerspectiveCamera(60, this.screenSize.ratio, 0.1, 500);
		this.imageCamera = new THREE.PerspectiveCamera(20, this.screenSize.ratio, 0.1, 500);
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.autoClear = true;
		this.setSize();
		this.setCamera();

		// Init Dom
		if (target) {
			target.appendChild(this.renderer.domElement);
			this.initMainLight();
			this.initCard();
			this.initImage();
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
		this.mainCamera.position.set(0, 0, 10);
		this.mainCamera.lookAt(0, 0, 0);
		this.imageCamera.position.set(0, 0, 20);
		this.imageCamera.lookAt(0, 0, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.mainCamera.aspect = 0.5 * this.screenSize.ratio;
		this.mainCamera.updateProjectionMatrix();
		this.imageCamera.aspect = 0.5 * this.screenSize.ratio;
		this.imageCamera.updateProjectionMatrix();
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initMainLight () {
		const AL = new THREE.AmbientLight(0xffffff, 1);
		const DL = new THREE.PointLight(0xffffff, 7);
		DL.position.set(-10, 3, 10);
		DL.lookAt(0, 0, 0);
		this.scene.add(AL);
		this.scene.add(DL);
	}

	private initCard () {
		this.card = new THREE.Group();
		// Base Shape
		const baseShape = createRoundedRect(-2, -3, 4, 6, 0.25);
		const baseGeo = new THREE.ShapeGeometry(baseShape);
		const baseMat = new THREE.MeshBasicMaterial({ color: 0xbdc3c7, side: THREE.DoubleSide });
		const base = new THREE.Mesh(baseGeo, baseMat);
		this.card.add(base);
		// Image container
		const imageGeo = new THREE.PlaneGeometry(3.5, 3.5);
		this.renderTarget = new THREE.WebGLRenderTarget(2048, 2048);
		const imageMat = new MeshBasicMaterial({ map: this.renderTarget.texture });
		const image = new THREE.Mesh(imageGeo, imageMat);
		image.position.y = 1;
		image.position.z = 0.001; // Avoid clipping
		this.card.add(image);
		// Encart
		const encartShape = createRoundedRect(1.25, -1, 0.75, 0.75, 0.25);
		const encartGeo = new THREE.ShapeGeometry(encartShape);
		const encartMat = new THREE.MeshBasicMaterial({ color: 0xbdc3c7 });
		const encart = new THREE.Mesh(encartGeo, encartMat);
		encart.position.z = 0.0015; // Avoid clipping
		this.card.add(encart);
		// Text
		const loader = new THREE.FontLoader();
		loader.load('/fonts/Lato_Bold.json', (font) => {
			const textGeo = new THREE.TextGeometry('12', {
				font,
				size: 0.3,
				height: 0.001
			});
			const textMat = new THREE.MeshStandardMaterial({
				color: 0x101010,
				roughness: 0.8,
				metalness: 0.7
			});
			const textMesh = new THREE.Mesh(textGeo, textMat);
			textMesh.position.z = 0.002;
			textMesh.position.x = 1.32;
			textMesh.position.y = -0.72;
			this.card.add(textMesh);
		});
		this.scene.add(this.card);
		this.card.rotation.z = 0.2;
		this.card.rotation.y = 0.3;
	}

	private initImage () {
		const sphereGeo = new THREE.BoxGeometry(2, 2, 2);
		const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false });
		const light = new THREE.AmbientLight(0xffffff, 0.2);
		const dl = new THREE.PointLight(0xffffff, 1);
		dl.position.set(5, 5, -10);
		const box = new THREE.Mesh(sphereGeo, sphereMat);
		this.image = new THREE.Group();
		this.image.add(box);
		const plan = new THREE.PlaneGeometry(3, 3);
		const matStatic = new THREE.MeshStandardMaterial({ color: 0x000fff, side: THREE.DoubleSide });
		const planMesh = new THREE.Mesh(plan, matStatic);
		this.image.add(planMesh);
		this.imageScene.add(light);
		this.imageScene.add(dl);
		this.imageScene.add(this.image);
	}

	private calculate () {
		const rotationCard = (this.card.rotation.y + Math.PI) % (2 * Math.PI) - Math.PI;
		this.imageCamera.position.x = rotationCard * Math.PI;
		this.imageCamera.position.z = 20 + (10 -  this.imageCamera.position.x );
		this.image.rotation.x += 0.1;
		this.image.rotation.y += 0.1;
		this.card.rotation.y += 0.02;
	}

	private innerRender () {
		// Render Target
		this.renderer.setRenderTarget(this.renderTarget);
		this.imageCamera.aspect = 1;
		this.imageCamera.updateProjectionMatrix();
		this.renderer.render(this.imageScene, this.imageCamera);
		this.renderer.setRenderTarget(null);
		this.imageCamera.aspect = 0.5 * this.screenSize.ratio;
		this.imageCamera.updateProjectionMatrix();
		if (this.isDebug) {
			// Left view (main)
			this.renderer.setViewport(0, 0, this.screenSize.w / 2, this.screenSize.h);
			this.renderer.setScissor(0, 0, this.screenSize.w / 2, this.screenSize.h);
			this.renderer.setScissorTest( true );
			this.renderer.render(this.scene, this.mainCamera);
			// Right view (secondary)
			this.renderer.setViewport(this.screenSize.w / 2, 0, this.screenSize.w / 2, this.screenSize.h);
			this.renderer.setScissor(this.screenSize.w / 2, 0, this.screenSize.w / 2, this.screenSize.h);
			this.renderer.setScissorTest(true);
			this.renderer.render(this.imageScene, this.imageCamera);
		} else {
			// Main View
			this.mainCamera.aspect = this.screenSize.ratio;
			this.mainCamera.updateProjectionMatrix();
			this.renderer.render(this.scene, this.mainCamera);
		}
	}

	private animate () {
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
		this.calculate();
		this.innerRender();
	}
}
</script>