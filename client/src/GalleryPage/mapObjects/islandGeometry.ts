import { BufferGeometry, Float32BufferAttribute } from "three";
import { buildCircleGeometry, buildZitteredHemisphereGeometry } from "./buildGeometry.js";

class IslandGeometry extends BufferGeometry {
  constructor(radius = 1) {
    super();

    this.type = "IslandGeometry";

    const segment = 24;
    const circlePart = buildCircleGeometry(radius, segment);
    const spherePart = buildZitteredHemisphereGeometry(radius, segment);
    const spherePartLength = spherePart.vertices.length / 3;
    const circleIndices = circlePart.indices.map((e) => e + spherePartLength);

    const indices = [...spherePart.indices, ...circleIndices];
    const vertices = [...spherePart.vertices, ...circlePart.vertices];
    const normals = [...spherePart.normals, ...circlePart.normals];
    const uvs = [...spherePart.uvs, ...circlePart.uvs];

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
}

export default IslandGeometry;
