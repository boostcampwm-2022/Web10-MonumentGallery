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
type PixelFragmentAttributes = {
  uvs: number[];
  vertexPositions: number[];
  trianglePivots: number[];
  localRotationQuaternions: number[];
  globalRotationQuaternions: number[];
  globalScatteredDistances: number[];
  pickedTriangles: number[];
};

class PixelFragmentGeometry extends BufferGeometry {
  size: number;
  scatterRadius: number;
  rows: number;
  columns: number;
  cellSize: number;
  width: number;
  height: number;
  scatterFragScale: number;
  #lowerVertexPosition: number[];
  #upperVertexPosition: number[];
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

    this.#lowerVertexPosition = [-0.75, 0.25, 0, 0.25, -0.75, 0, 0.25, 0.25, 0].map((e) => e * this.cellSize);
    this.#upperVertexPosition = [-0.25, 0.75, 0, -0.25, -0.25, 0, 0.75, -0.25, 0].map((e) => e * this.cellSize);

    const positions = new Array(this.rows * this.columns * 6 * 3).fill(0);
    const normals = [];
    const colors = [];

    const attributes = {
      uvs: [],
      vertexPositions: [],
      trianglePivots: [],
      localRotationQuaternions: [],
      globalRotationQuaternions: [],
      globalScatteredDistances: [],
      pickedTriangles: [],
    };

    const _color = new Color();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.#setAttributes(x, y, attributes);

        const { r, g, b } = _color.set(pixels[y][x]);
        for (let i = 0; i < 6; i++) {
          normals.push(0, 0, 1);
          colors.push(r, g, b);
        }
      }
    }
    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(attributes.uvs, 2));
    this.setAttribute("vertexPosition", new Float32BufferAttribute(attributes.vertexPositions, 3));
    this.setAttribute("pivot", new Float32BufferAttribute(attributes.trianglePivots, 3));
    this.setAttribute("localRotation", new Float32BufferAttribute(attributes.localRotationQuaternions, 4));
    this.setAttribute("globalRotation", new Float32BufferAttribute(attributes.globalRotationQuaternions, 4));
    this.setAttribute("globalDist", new Float32BufferAttribute(attributes.globalScatteredDistances, 1));
    this.setAttribute("color", new Float32BufferAttribute(colors, 3));
    this.setAttribute("pickedTriangle", new Float32BufferAttribute(attributes.pickedTriangles, 1));

    this.syncronizeVertex(1);
  }
  #setVertexUVAttributes(xIndex: number, yIndex: number, lx: number, ly: number, array: number[]) {
    array.push((xIndex + lx) / this.columns); // ux
    array.push((yIndex + ly) / this.rows); // uy
  }
  #setVertexPosAttributes(xIndex: number, yIndex: number, lx: number, ly: number, array: number[]) {
    const xPos = this.cellSize * (xIndex + lx) - this.width / 2;
    const yPos = this.height / 2 - this.cellSize * (yIndex + ly);

    array.push(xPos, yPos, 0); // [x, y, z]
  }
  #setTriangleAttributes(attributes: PixelFragmentAttributes) {
    // get local rotation, global rotation
    const [l1, l2, l3, l4] = this.#makeRandomAxisAngle();
    const [g1, g2, g3, g4] = this.#makeRandomAxisAngle();

    // get scattered fragment's global distance
    let globalDist = (Math.random() * 0.35 + 0.65) * this.scatterRadius;
    if (Math.random() < 0.05) globalDist = (Math.random() * 0.35 + 0.3) * this.scatterRadius;

    // get picked fragment when scattered
    const pickedTriangle = Math.random() < 100 / (this.rows * this.columns);

    for (let i = 0; i < 3; i++) {
      attributes.localRotationQuaternions.push(l1, l2, l3, l4);
      attributes.globalRotationQuaternions.push(g1, g2, g3, g4);
      attributes.globalScatteredDistances.push(globalDist);
      attributes.pickedTriangles.push(+pickedTriangle);
    }
  }
  #setUpperTriangleAttributes(x: number, y: number, attributes: PixelFragmentAttributes) {
    // set uv
    this.#setVertexUVAttributes(x, y, 0, 0, attributes.uvs);
    this.#setVertexUVAttributes(x, y, 0, 1, attributes.uvs);
    this.#setVertexUVAttributes(x, y, 1, 1, attributes.uvs);

    // set fragment vertex position
    this.#upperVertexPosition.forEach((e) => attributes.vertexPositions.push(e));

    // set fragment triangle pivots
    for (let i = 0; i < 3; i++) {
      this.#setVertexPosAttributes(x, y, 0.25, 0.75, attributes.trianglePivots);
    }

    // set common triangle attributes
    this.#setTriangleAttributes(attributes);
  }
  #setLowerTriangleAttributes(x: number, y: number, attributes: PixelFragmentAttributes) {
    // set uv
    this.#setVertexUVAttributes(x, y, 0, 0, attributes.uvs);
    this.#setVertexUVAttributes(x, y, 0, 1, attributes.uvs);
    this.#setVertexUVAttributes(x, y, 1, 1, attributes.uvs);

    // set fragment vertex position
    this.#lowerVertexPosition.forEach((e) => attributes.vertexPositions.push(e));

    // set fragment triangle pivots
    for (let i = 0; i < 3; i++) {
      this.#setVertexPosAttributes(x, y, 0.75, 0.25, attributes.trianglePivots);
    }

    // set common triangle attributes
    this.#setTriangleAttributes(attributes);
  }
  #setAttributes(x: number, y: number, attributes: PixelFragmentAttributes) {
    // upper-left side
    this.#setUpperTriangleAttributes(x, y, attributes);
    // lower-right side
    this.#setLowerTriangleAttributes(x, y, attributes);
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
  syncronizeVertex(lerp: number) {
    const positions = this.attributes.position;
    const vertexPositions = this.attributes.vertexPosition;
    const localRotations = this.attributes.localRotation;
    const globalRotations = this.attributes.globalRotation;
    const pivots = this.attributes.pivot;
    const globalDists = this.attributes.globalDist;
    const pickedTriangles = this.attributes.pickedTriangle;

    // temporary objects
    const _vertexPos = new Vector3();
    const _pivot = new Vector3();
    const _newPosition = new Vector3();
    const _axisTemp = new Vector3();
    const _localQuat = new Quaternion();
    const _triQuat = new Quaternion();

    function getQuaternion(buffer: IBufferAttribute, index: number, lerp: number, target: Quaternion) {
      const axis = _axisTemp.fromBufferAttribute(buffer, index);
      const angle = buffer.getW(index);

      return target.setFromAxisAngle(axis, angle * lerp);
    }

    for (let i = 0; i < positions.count; i++) {
      // local vertex position rotation
      const vertexPosition = _vertexPos.fromBufferAttribute(vertexPositions, i);
      const localQuaternion = getQuaternion(localRotations, i, lerp, _localQuat);
      const newLocalPosition = vertexPosition.applyQuaternion(localQuaternion);
      const fragScale = pickedTriangles.getX(i) ? this.scatterFragScale * 5 : 0;
      const newLocalScale = MathUtils.lerp(1, fragScale, lerp);
      newLocalPosition.multiplyScalar(newLocalScale);

      // local triangle position rotation
      const pivot = _pivot.fromBufferAttribute(pivots, i);
      const triangleQuaternion = getQuaternion(globalRotations, i, lerp, _triQuat);
      const length = pivot.length();
      const newLength = MathUtils.lerp(length, globalDists.getX(i), lerp);
      const newTriPosition = pivot.applyQuaternion(triangleQuaternion).setLength(newLength);

      const newPosition = _newPosition.addVectors(newLocalPosition, newTriPosition);

      // update particle properties
      positions.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
    }

    // compound bound box
    this.attributes.position.needsUpdate = true;
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}

export default PixelFragmentGeometry;
