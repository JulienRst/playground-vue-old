export default class WindowControl {
	private width: number = 0;
	private height: number = 0;
	private bindedResize: any;

	public constructor () {
		this.updateSize();
		this.bindedResize = this.updateSize.bind(this);

		window.addEventListener('resize', this.bindedResize);
	}

	public onDestroy () {
		window.removeEventListener('resize', this.bindedResize);
	}

	public screenSize () {
		return {
			w: this.width,
			h: this.height,
			ratio: this.width / this.height
		};
	}

	public getVisibleHeight (camera: THREE.PerspectiveCamera) {
		let depth = 0;
		// compensate for cameras not positioned at z=0
		const cameraOffset = camera.position.z;
		if (depth < cameraOffset) {
			depth -= cameraOffset;
		} else {
			depth += cameraOffset;
		}
		// vertical fov in radians
		const vFOV = camera.fov * Math.PI / 180;

		// Math.abs to ensure the result is always positive
		return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
	}

	public getVisibleWidth (camera: THREE.PerspectiveCamera) {
		const height = this.getVisibleHeight(camera);
		return height * camera.aspect;
	}

	private updateSize () {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
	}
}
