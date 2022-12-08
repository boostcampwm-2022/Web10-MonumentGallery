const shaderMaterial = {
  transparent: true,
  vertexShader: `
		varying vec2 face;
		void main() {
			face = vec2(uv.x - 0.5, uv.y - 0.5) * 2.0;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z -= 0.0001;
		}
	`,
  fragmentShader: `
		varying vec2 face;
		void main() {
			if ( abs(face.x) < 0.85 && abs(face.y) < 0.85 ) discard;
			gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.6 );
		}
	`,
};

export default shaderMaterial;
