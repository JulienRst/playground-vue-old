export const fragmentShader = `
	uniform vec3 uColor;
	void main () {
		vec3 color = vec3(uColor);
		gl_FragColor = vec4(color, 1.);
	}
`;

export const vertexShader = `
	attribute vec3 aOffset;
	attribute vec2 aMetrics;
	uniform float uTime;
	uniform float uSpeed;
	uniform float uTravelLength;

	#include

	void main () {
		vec3 transformed = position.xyz;

		float radius = aMetrics.r;
		float length = aMetrics.g;

		// 1. Set radius and length
		transformed.xy *= radius;
		transformed.z *= length;

		// 2. Place them
		float zOffset = uTime * uSpeed + aOffset.z;
		zOffset = length - mod(zOffset, uTravelLength);
		transformed.z += zOffset;
		transformed.xy += aOffset.xy;

		float progress = abs(transformed.z / uTravelLength);
		transformed.xyz += getDistortion(progress);

		vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
		gl_Position = projectionMatrix * mvPosition;
	}
`;
