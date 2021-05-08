<template>
	<div class="render" @click="initRecording" id="dummy-render"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as THREE from 'three';
import WindowControl from '@/utils/WindowControl';

const NUMBER_OF_BARS = 15;
const BAR_WIDTH = 1;
const BAR_HEIGHT = 5;
const BAR_DEPTH = 0.2;
const BAR_COLOR = new THREE.Color(0 / BAR_HEIGHT, 0.2, 1);
const BAR_GUTTER = 0.5;
const SIGMA = 0.00001;
const FFT_SIZE = 256;

@Component({
	name: 'TheSoundYouNeed'
})
export default class TheSoundYouNeedComponent extends Vue {
	// Three
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	// Utils
	private timeout!: number;
	private windowControl!: WindowControl;
	private screenSize!: { w: number, h: number, ratio: number };
	private framerate = 1000 / 30;
	// Bars
	private bars: THREE.Mesh[] = [];
	private barsGroup: THREE.Group = new THREE.Group();
	// Mic
	private constraints: MediaStreamConstraints = { audio: true, video: false };
	private audioContext!: AudioContext;
	private analyser!: AnalyserNode;
	private track!: MediaStreamAudioSourceNode;


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
			this.initBars();
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
		this.camera.position.set(10, 5, 10);
		this.camera.lookAt(2, -1, 0);
	}

	private setSize () {
		this.screenSize = this.windowControl.screenSize();
		this.camera.aspect = this.screenSize.ratio;
		this.renderer.setSize(this.screenSize.w, this.screenSize.h);
	}

	private initBars () {
		const material = new THREE.MeshBasicMaterial({ color: BAR_COLOR });
		const geometry = new THREE.BoxGeometry(BAR_WIDTH, SIGMA, BAR_DEPTH);
		const offset = - (NUMBER_OF_BARS * (BAR_WIDTH + BAR_GUTTER)) / 2;
		for (let i = 0; i < NUMBER_OF_BARS; i++) {
			const mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(offset + i * (BAR_WIDTH + BAR_GUTTER), 0, 0);
			this.bars.push(mesh);
			this.barsGroup.add(mesh);
		}

		this.scene.add(this.barsGroup);
	}

	private calculate () {
		// Mic
		if (this.analyser) {
			const bufferLength = this.analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			this.analyser.getByteFrequencyData(dataArray);
			const portion = Math.ceil(bufferLength / NUMBER_OF_BARS / 2);
			for (let i = 0; i < NUMBER_OF_BARS; i ++) {
				const v = dataArray.slice(i * portion, (i + 1) * portion).reduce((acc, current) => acc += current, 0);
				const h = Math.max((v / (FFT_SIZE * portion)) * BAR_HEIGHT, SIGMA);
				this.bars[i].geometry = new THREE.BoxGeometry(BAR_WIDTH, h, BAR_DEPTH);
				this.bars[i].material = new THREE.MeshBasicMaterial({ color: new THREE.Color(h / BAR_HEIGHT, 0.2, 1) });
				this.bars[i].position.setY(h / 2 - BAR_HEIGHT / 2);
			}
		}
	}

	private animate () {
		this.calculate();
		this.renderer.render(this.scene, this.camera);
		this.timeout = window.setTimeout(() => { this.animate(); }, this.framerate);
	}

	private initRecording () {
		navigator
			.mediaDevices
			.getUserMedia(this.constraints)
			.then((mediaStream) => {
				console.log('Hello, media stream recording');
				this.audioContext = new AudioContext();
				this.analyser = this.audioContext.createAnalyser();
				this.analyser.fftSize = FFT_SIZE;
				this.track = this.audioContext.createMediaStreamSource(mediaStream);
				this.track.connect(this.analyser);
		});
	}
}
</script>