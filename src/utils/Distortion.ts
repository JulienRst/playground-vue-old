import * as THREE from 'three';

const distortionUniforms = {
	uDistortionX: new THREE.Uniform(new THREE.Vector2(120, 3)),
	uDistortionY: new THREE.Uniform(new THREE.Vector2(15, 4.5))
};

const distortionVertex = `
	#define PI 3.1415926538979
	uniform vec2 uDistortionX;
	uniform vec2 uDistortionY;

	float nsin (float val) {
		return sin(val) * 0.5 + 0.5;
	}

	vec3 getDistortion(float progress) {
		progress = clamp(progress, 0., 1.);
		float xAmp = uDistortionX.r;
		float xFreq = uDistortionX.g;
		float yAmp = uDistortionY.r;
		float yFreq = uDistortionY.g;

		return vec3(
			xAmp * nsin(progress * PI * xFreq - PI / 2.),
			yAmp * nsin(progress * PI * yFreq - PI / 2.),
			0.
		);
	}
`;

export const myCustomDistortion = {
	uniforms : distortionUniforms,
	getDistortion: distortionVertex
};
