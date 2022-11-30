import { DoubleSide, UniformsUtils, UniformsLib } from "three";

export const pixelFragmentShaderUniforms = () => {
  return UniformsUtils.merge([
    UniformsLib.lights,
    UniformsLib.fog,
    { lerp: { value: 1 }, scatterFragScale: { value: 1 } },
  ]);
};

const pixelFragmentShader = {
  side: DoubleSide,
  vertexColors: true,
  lights: true,
  fog: true,
  vertexShader: /* glsl */ `
    attribute vec3 pivot;
    attribute vec3 vertexPosition;
    attribute vec4 localRotation;
    attribute vec4 globalRotation;
    attribute float globalDist;

    uniform float lerp;
    uniform float scatterFragScale;

    varying vec3 vNormal;
    varying vec3 vViewPosition;
    #include <color_pars_vertex>
    #include <fog_pars_vertex>

    vec4 getQuaternion(vec4 axisAngle, float amount) {
      vec3 axis = axisAngle.xyz;
      float angle = axisAngle.w * amount;
      return vec4( sin(angle / 2.0) * axis, cos(angle / 2.0) ); 
    }
    vec4 multiplyQuaternion(vec4 q1, vec4 q2)
    { 
      vec4 result;
      result.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
      result.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
      result.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
      result.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
      return result;
    }
    vec3 applyQuaternionToVector(vec3 position, vec4 quaternion) {
      vec4 conjQuaternion = vec4( -quaternion.xyz, quaternion.w );
      vec4 temp = multiplyQuaternion(quaternion, vec4(position, 0.0));
      vec4 result = multiplyQuaternion(temp, conjQuaternion);
      return result.xyz;
    }

    void main() {
      #include <color_vertex>

      // local vertex position rotation
      vec4 localQuaternion = getQuaternion(localRotation, lerp);
      vec3 newLocalPosition = applyQuaternionToVector(vertexPosition, localQuaternion);
      vNormal = applyQuaternionToVector(normal, localQuaternion);

      // local triangle position rotation
      vec4 triangleQuaternion = getQuaternion(globalRotation, lerp);
      vec3 newTriPositionDirection = normalize( applyQuaternionToVector(pivot, triangleQuaternion) );
      float triPositionLength = mix(length(pivot), globalDist, lerp);
      vec3 newTriPosition = triPositionLength * newTriPositionDirection;

      vec3 newPosition = newLocalPosition * mix(1.0, scatterFragScale, lerp) + newTriPosition;

      // vec4 modelViewPosition = modelViewMatrix * vec4( position.xy, globalDist, 1.0 );
      vec4 modelViewPosition = modelViewMatrix * vec4( newPosition, 1.0 );
      vViewPosition = - modelViewPosition.xyz;
      gl_Position = projectionMatrix * modelViewPosition;

      #ifdef USE_FOG
        vFogDepth = - modelViewPosition.z;
      #endif
    }`,
  fragmentShader: /* glsl */ `
    #undef USE_SHADOWMAP

    uniform float lerp;
    varying vec3 vNormal;
    #include <common>
    #include <color_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars_begin>
    #include <lights_phong_pars_fragment>

    void main() {
      vec4 diffuseColor = vec4( vColor, 1.0 );
      ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
      vec3 specular = vec3( mix(0.1, 0.4, lerp) );
      float shininess = 120.0;
      float specularStrength = 1.0;
      vec3 normal = vNormal;

      #include <lights_phong_fragment>
      #include <lights_fragment_begin>
      #include <lights_fragment_maps>
      #include <lights_fragment_end>

      vec3 diffuseResult = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
      vec3 specularResult = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
      vec3 outgoingLight = diffuseResult + specularResult;
      gl_FragColor = vec4(outgoingLight, 1);

      #include <fog_fragment>
    }`,
};

export default pixelFragmentShader;
