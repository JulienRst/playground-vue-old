<template>
	<div class="text-rendering">
		<div id="text-render"></div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import vs from '@/models/sandbox/shaders/glitch.vs';
import fs from '@/models/sandbox/shaders/glitch.fs';

@Component({
	name: 'TextRenderingComponent'
})
export default class TextRenderingComponent extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private sceneSize: { w: number, h: number } = { w: 0, h: 0 };
	private framerate = 1000 / 15;
	private fontLoader = new THREE.FontLoader();
	private font!: THREE.Font;
	private lastUpdate: boolean = false;
	private material!: THREE.RawShaderMaterial;
	// Props
	@Prop({ required: true })
	private text!: string;

	@Watch('text')
	public onTextChange () {
		if (this.font) {
			this.displayText(this.text);
		}
	}

	public mounted () {
		console.log('///////////// MOUNTED');
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
		this.initText();

		// Init Dom
		const target: HTMLElement|null = document.querySelector('#text-render');
		if (target) {
			target.appendChild(this.renderer.domElement);
		}

		window.addEventListener('resize', this.setSize);

		this.animate();
	}

	private initText () {
		this.fontLoader.load('fonts/Titilium_Black.json', (font) => {
			this.font = font;
		});
	}

	private displayText (text: string) {
		if (text !== '') {
			const shapes = this.font.generateShapes(text.toUpperCase(), 2);
			const color = new THREE.Color(0xffffff);
			const holeShapes: THREE.Path[] = [];

			const tmpGeometry = new THREE.ShapeBufferGeometry(shapes);
			tmpGeometry.computeBoundingBox();
			const xMid = - 0.5 * (tmpGeometry.boundingBox.max.x - tmpGeometry.boundingBox.min.x);
			const yMid = - 0.5 * (tmpGeometry.boundingBox.max.y - tmpGeometry.boundingBox.min.y);

			shapes.forEach((shape) => {
				if (shape.holes && shape.holes.length > 0) {
					shape.holes.forEach((hole) => {
						holeShapes.push(hole);
					});
				}
			});

			shapes.push.apply(shapes, holeShapes as THREE.Shape[]);
			const style = SVGLoader.getStrokeStyle(0.05, color.getStyle(), 'round', 'round', 0.1);
			const strokeText = new THREE.Group();
			shapes.forEach((shape) => {
				const points = shape.getPoints().map((point) => new THREE.Vector3(point.x, point.y, 0));
				const geometry = SVGLoader.pointsToStroke(points, style, 12, 0);
				geometry.translate( xMid, yMid, 0 );
				const strokeMesh = new THREE.Mesh(geometry, this.material);
				strokeText.add(strokeMesh);
			});
			this.scene.add(strokeText);
		} else {
			this.scene.remove(this.scene.children[0]);
			this.lastUpdate = true;
		}
	}

	private animate () {
		if (this.lastUpdate) {
			this.renderer.render(this.scene, this.camera);
			this.lastUpdate = false;
		}
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
	}

	private setCamera () {
		this.camera.position.set(0, 0, 10);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}
}
</script>