import {
  BufferGeometry,
  Color,
  Vector3,
  Quaternion,
  Float32BufferAttribute,
  BufferAttribute,
  InterleavedBufferAttribute,
  MathUtils,
} from "three";

type IColor = Color | string | number;
type IBufferAttribute = BufferAttribute | InterleavedBufferAttribute;

class PixelFragmentGeometry extends BufferGeometry {
  size: number;
  scatterRadius: number;
  rows: number;
  columns: number;
  cellSize: number;
  width: number;
  height: number;
  scatterFragScale: number;
  constructor(pixels: IColor[][], size = 1, scatterRadius = 3) {
    super();

    this.size = size;
    this.scatterRadius = scatterRadius;

    this.rows = pixels.length ?? 0; // height
    this.columns = pixels[0]?.length ?? 0; // width
    const max = Math.max(this.rows, this.columns);
    this.cellSize = size / max;
    this.width = this.columns * this.cellSize;
    this.height = this.rows * this.cellSize;
    this.scatterFragScale = 0.6 * Math.sqrt(max / 8);

    const positions = new Array(this.rows * this.columns * 6 * 3).fill(0);
    const normals = [];
    const uvs = [];
    const vertexPositions = [];
    const trianglePivots = [];
    const localRotationQuaternions = [];
    const globalRotationQuaternions = [];
    const globalScatteredDistances = [];
    const colors = [];
    const pickedTriangles = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const { uv, pivot, vertexPosition, localRot, globalRot, globalDist, pickedTriangle } = this.#setAttributes(
          x,
          y,
        );

        const normal = [];
        const color = [];
        const { r, g, b } = new Color(pixels[y][x]);
        for (let i = 0; i < 6; i++) {
          normal.push(0, 0, 1);
          color.push(r, g, b);
        }

        normals.push(...normal);
        uvs.push(...uv);
        vertexPositions.push(...vertexPosition);
        trianglePivots.push(...pivot);
        localRotationQuaternions.push(...localRot);
        globalRotationQuaternions.push(...globalRot);
        globalScatteredDistances.push(...globalDist);
        colors.push(...color);
        pickedTriangles.push(...pickedTriangle);
      }
    }

    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
    this.setAttribute("vertexPosition", new Float32BufferAttribute(vertexPositions, 3));
    this.setAttribute("pivot", new Float32BufferAttribute(trianglePivots, 3));
    this.setAttribute("localRotation", new Float32BufferAttribute(localRotationQuaternions, 4));
    this.setAttribute("globalRotation", new Float32BufferAttribute(globalRotationQuaternions, 4));
    this.setAttribute("globalDist", new Float32BufferAttribute(globalScatteredDistances, 1));
    this.setAttribute("color", new Float32BufferAttribute(colors, 3));
    this.setAttribute("pickedTriangle", new Float32BufferAttribute(pickedTriangles, 1));

    this.syncronizeVertex(1);
  }
  #setVertexAttributes(xIndex: number, yIndex: number, lx: number, ly: number) {
    const xPos = this.cellSize * (xIndex + lx) - this.width / 2;
    const yPos = this.height / 2 - this.cellSize * (yIndex + ly);
    const ux = (xIndex + lx) / this.columns;
    const uy = (yIndex + ly) / this.rows;

    return {
      position: [xPos, yPos, 0],
      uv: [ux, uy],
    };
  }
  #setTriangleAttributes() {
    const localRot = this.#makeRandomAxisAngle();
    const globalRot = this.#makeRandomAxisAngle();
    let globalDist = (Math.random() * 0.35 + 0.65) * this.scatterRadius;
    if (Math.random() < 0.05) globalDist = (Math.random() * 0.35 + 0.3) * this.scatterRadius;
    const pickedTriangle = Math.random() < 100 / (this.rows * this.columns);

    return {
      localRot: this.#makeTriple<number>(localRot),
      globalRot: this.#makeTriple<number>(globalRot),
      globalDist: [globalDist, globalDist, globalDist],
      pickedTriangle: [+pickedTriangle, +pickedTriangle, +pickedTriangle],
    };
  }
  #setUpperTriangleAttributes(x: number, y: number) {
    const vert1 = this.#setVertexAttributes(x, y, 0, 0);
    const vert2 = this.#setVertexAttributes(x, y, 0, 1);
    const vert3 = this.#setVertexAttributes(x, y, 1, 1);
    const uv = [...vert1.uv, ...vert2.uv, ...vert3.uv];
    const pivot = this.#setVertexAttributes(x, y, 0.25, 0.75).position;
    const vertexPosition = [-0.25, 0.75, 0, -0.25, -0.25, 0, 0.75, -0.25, 0].map((e) => e * this.cellSize);

    return {
      uv,
      vertexPosition,
      pivot: this.#makeTriple<number>(pivot),
      ...this.#setTriangleAttributes(),
    };
  }
  #setLowerTriangleAttributes(x: number, y: number) {
    const vert1 = this.#setVertexAttributes(x, y, 0, 0);
    const vert2 = this.#setVertexAttributes(x, y, 1, 1);
    const vert3 = this.#setVertexAttributes(x, y, 1, 0);
    const uv = [...vert1.uv, ...vert2.uv, ...vert3.uv];
    const pivot = this.#setVertexAttributes(x, y, 0.75, 0.25).position;
    const vertexPosition = [-0.75, 0.25, 0, 0.25, -0.75, 0, 0.25, 0.25, 0].map((e) => e * this.cellSize);

    return {
      uv,
      vertexPosition,
      pivot: this.#makeTriple<number>(pivot),
      ...this.#setTriangleAttributes(),
    };
  }
  #makeTriple<T>(arr: T[]) {
    const result = [];
    for (let i = 0; i < 3; i++) {
      result.push(...arr);
    }
    return result;
  }
  #setAttributes(x: number, y: number) {
    // upper-left side
    const upper = this.#setUpperTriangleAttributes(x, y);
    // lower-right side
    const lower = this.#setLowerTriangleAttributes(x, y);

    return {
      uv: [...upper.uv, ...lower.uv],
      pivot: [...upper.pivot, ...lower.pivot],
      localRot: [...upper.localRot, ...lower.localRot],
      globalRot: [...upper.globalRot, ...lower.globalRot],
      globalDist: [...upper.globalDist, ...lower.globalDist],
      vertexPosition: [...upper.vertexPosition, ...lower.vertexPosition],
      pickedTriangle: [...upper.pickedTriangle, ...lower.pickedTriangle],
    };
  }
  #makeRandomAxisAngle() {
    // Derived from https://mathworld.wolfram.com/SpherePointPicking.html
    const u = (Math.random() - 0.5) * 2;
    const t = Math.random() * Math.PI * 2;
    const f = Math.sqrt(1 - u ** 2);

    const x = f * Math.cos(t);
    const y = f * Math.sin(t);
    const z = u;
    const angle = (Math.random() * 2 - 1) * Math.PI;
    return [x, y, z, angle];
  }
  #getQuaternion(buffer: IBufferAttribute, index: number, lerp: number): Quaternion {
    const axis = new Vector3().fromBufferAttribute(buffer, index);
    const angle = buffer.getW(index);

    return new Quaternion().setFromAxisAngle(axis, angle * lerp);
  }
  syncronizeVertex(lerp: number) {
    const positions = this.attributes.position;
    const vertexPositions = this.attributes.vertexPosition;
    const localRotations = this.attributes.localRotation;
    const globalRotations = this.attributes.globalRotation;
    const pivots = this.attributes.pivot;
    const globalDists = this.attributes.globalDist;
    const pickedTriangles = this.attributes.pickedTriangle;

    for (let i = 0; i < positions.count; i++) {
      // local vertex position rotation
      const vertexPosition = new Vector3().fromBufferAttribute(vertexPositions, i);
      const localQuaternion = this.#getQuaternion(localRotations, i, lerp);
      const newLocalPosition = vertexPosition.applyQuaternion(localQuaternion);
      const fragScale = pickedTriangles.getX(i) ? this.scatterFragScale * 5 : 0;
      const newLocalScale = MathUtils.lerp(1, fragScale, lerp);
      newLocalPosition.multiplyScalar(newLocalScale);

      // local triangle position rotation
      const pivot = new Vector3().fromBufferAttribute(pivots, i);
      const triangleQuaternion = this.#getQuaternion(globalRotations, i, lerp);
      const length = pivot.length();
      const newLength = MathUtils.lerp(length, globalDists.getX(i), lerp);
      const newTriPosition = pivot.applyQuaternion(triangleQuaternion).setLength(newLength);

      const newPosition = new Vector3().addVectors(newLocalPosition, newTriPosition);

      // update particle properties
      positions.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
    }
    this.attributes.position.needsUpdate = true;
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export default PixelFragmentGeometry;
