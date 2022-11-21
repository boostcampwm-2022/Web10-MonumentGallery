import { BufferGeometry, Float32BufferAttribute, Vector3, Vector2 } from "three";

function buildCircleGeometry(radius: number, segments: number) {
  // buffers
  const indices: Array<number> = [];
  const vertices: Array<number> = [];
  const normals: Array<number> = [];
  const uvs: Array<number> = [];

  // helper variables

  const vertex = new Vector3();
  const uv = new Vector2();

  // center point

  vertices.push(0, 0, 0);
  normals.push(0, 0, 1);
  uvs.push(0.5, 0.5);

  for (let s = 0, i = 3; s <= segments; s++, i += 3) {
    const segment = (s / segments) * Math.PI * 2;

    // vertex
    vertex.x = radius * Math.cos(segment);
    vertex.z = radius * Math.sin(segment);
    vertices.push(vertex.x, vertex.y, vertex.z);

    // normal
    normals.push(0, 0, 1);

    // uvs
    uv.x = (vertices[i] / radius + 1) / 2;
    uv.y = (vertices[i + 1] / radius + 1) / 2;

    uvs.push(uv.x, uv.y);
  }

  // indices
  for (let i = 1; i <= segments; i++) {
    indices.push(i + 1, i, 0);
  }

  return {
    indices,
    vertices,
    normals,
    uvs,
  } as const;
}

function buildZitteredHemisphereGeometry(radius: number, segment: number) {
  const widthSegments = Math.max(3, Math.floor(segment));
  const heightSegments = 5;
  const phiStart = 0;
  const phiLength = Math.PI * 2;
  const thetaStart = Math.PI / 2;
  const thetaLength = Math.PI / 2;
  const thetaEnd = Math.PI;

  let index = 0;
  const grid = [];

  const vertex = new Vector3();
  const normal = new Vector3();

  // buffers
  const indices: Array<number> = [];
  const vertices: Array<number> = [];
  const normals: Array<number> = [];
  const uvs: Array<number> = [];

  // make vertex
  function makeVertex(u: number, v: number, ix: number, iy: number) {
    const circleRadius = radius * Math.sin(thetaStart + v * thetaLength);
    vertex.x = -circleRadius * Math.cos(phiStart + u * phiLength);
    vertex.y = radius * ((Math.cos(thetaStart + v * thetaLength) * 2) / 5 - (v * 3) / 5) * 1.2;
    vertex.z = circleRadius * Math.sin(phiStart + u * phiLength);

    // zitter
    if (ix === widthSegments) {
      vertex.x = vertices[(index - widthSegments) * 3];
      vertex.y = vertices[(index - widthSegments) * 3 + 1];
      vertex.z = vertices[(index - widthSegments) * 3 + 2];
    } else if (iy !== 0 && iy !== heightSegments) {
      const intensity = circleRadius / 8;
      const rand = () => Math.random() - 0.5;
      vertex.x += rand() * intensity;
      vertex.y += rand() * intensity;
      vertex.z += rand() * intensity;
    }

    return vertex;
  }

  // generate vertices, normals and uvs
  for (let iy = 0; iy <= heightSegments; iy++) {
    const verticesRow = [];
    const v = iy / heightSegments;

    // special case for the poles
    let uOffset = 0;
    if (iy == 0 && thetaStart == 0) {
      uOffset = 0.5 / widthSegments;
    } else if (iy == heightSegments && thetaEnd == Math.PI) {
      uOffset = -0.5 / widthSegments;
    }

    for (let ix = 0; ix <= widthSegments; ix++) {
      const u = ix / widthSegments;

      // vertex
      const vertex = makeVertex(u, v, ix, iy);
      vertices.push(vertex.x, vertex.y, vertex.z);

      // normal
      normal.copy(vertex).normalize();
      normals.push(normal.x, normal.y, normal.z);

      // uv
      uvs.push(u + uOffset, 1 - v);

      verticesRow.push(index++);
    }
    grid.push(verticesRow);
  }

  // indices

  for (let iy = 0; iy < heightSegments; iy++) {
    for (let ix = 0; ix < widthSegments; ix++) {
      const a = grid[iy][ix + 1];
      const b = grid[iy][ix];
      const c = grid[iy + 1][ix];
      const d = grid[iy + 1][ix + 1];

      if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
      if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
    }
  }

  return {
    indices,
    vertices,
    normals,
    uvs,
  } as const;
}

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
