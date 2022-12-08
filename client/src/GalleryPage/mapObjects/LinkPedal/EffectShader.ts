import { DoubleSide } from "three";

function effectShaderUniforms() {
  return { time: { value: 0 } };
}

const effectShader = {
  transparent: true,
  depthWrite: false,
  side: DoubleSide,
  vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,
  fragmentShader: `
		varying vec2 vUv;

		uniform float time;
		const float period = 4.0;
		const float reverseMix = 0.7;

		vec2 hash( vec2 p ) {
			p = vec2( dot(p,vec2(127.1,311.7)),
					  dot(p,vec2(269.5,183.3)) );

			return -1.0 + 2.0*fract(sin(p) * 43758.5453123);
		}
		float noise( in vec2 p ) {
			const float K1 = 0.366025404; // (sqrt(3)-1)/2;
			const float K2 = 0.211324865; // (3-sqrt(3))/6;

			vec2 i = floor( p + (p.x+p.y) * K1 );

			vec2 a = p - i + (i.x+i.y) * K2;
			vec2 o = step(a.yx,a.xy);
			vec2 b = a - o + K2;
			vec2 c = a - 1.0 + 2.0*K2;

			vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

			vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

			return dot( n, vec3(70.0) );
		}
		float fbm ( in vec2 p ) {
			float f = 0.0;
			mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
			f  = 0.5000*noise(p); p = m*p;
			f += 0.2500*noise(p); p = m*p;
			f += 0.1250*noise(p); p = m*p;
			f += 0.0625*noise(p); p = m*p;
			f = 0.5 + 0.5 * f;
			return f;
		}
		
		void main() {
			float time_ = time * 0.5;
			float height = fbm( vec2(vUv.x * period, time_) );
			if (vUv.x > reverseMix) {
				float inverseHeight = fbm( vec2((1.0 - vUv.x) * period, time_) );
				height = mix(height, inverseHeight, (vUv.x - reverseMix) / (1.0 - reverseMix) );
			}
			if (vUv.y < height) discard;

			float opacity = (vUv.y - height) / (1.0 - height);
			gl_FragColor = vec4( 1.0, 1.0, 1.0, opacity * opacity * opacity * 0.75 + 0.15 * opacity );
		}
	`,
};

export { effectShader as default, effectShaderUniforms };
