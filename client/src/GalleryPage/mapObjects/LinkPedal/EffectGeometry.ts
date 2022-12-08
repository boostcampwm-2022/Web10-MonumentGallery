import { BufferGeometry, Float32BufferAttribute } from "three";

type DirectionIndices = 0 | 1 | 2 | 3;
interface IPosBasis {
  basePos: number[];
  rightBasis: number[];
}

class BoxEffectGeometry extends BufferGeometry {
  constructor(size = 1, height = 0.3) {
    super();

    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i < 4; i++) {
      const { basePos, rightBasis } = this.#getBasis(i as DirectionIndices);
      const { position, uv, normal, index } = this.#buildPlane(
        i as DirectionIndices,
        basePos,
        rightBasis,
        size / 2,
        height,
      );
      positions.push(...position);
      uvs.push(...uv);
      normals.push(...normal);
      indices.push(...index);
    }

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }
  #getBasis(i: DirectionIndices): IPosBasis {
    switch (i) {
      case 0:
        return {
          basePos: [1, 0],
          rightBasis: [0, 1],
        };
      case 1:
        return {
          basePos: [0, 1],
          rightBasis: [-1, 0],
        };
      case 2:
        return {
          basePos: [-1, 0],
          rightBasis: [0, -1],
        };
      case 3:
        return {
          basePos: [0, -1],
          rightBasis: [1, 0],
        };
    }
  }
  #buildPlane(i: DirectionIndices, basePos: number[], rightBasis: number[], width: number, height: number) {
    const pos1 = [basePos[0] * width - rightBasis[0] * width, height, basePos[1] * width - rightBasis[1] * width];
    const pos2 = [basePos[0] * width + rightBasis[0] * width, height, basePos[1] * width + rightBasis[1] * width];
    const pos3 = [basePos[0] * width - rightBasis[0] * width, 0, basePos[1] * width - rightBasis[1] * width];
    const pos4 = [basePos[0] * width + rightBasis[0] * width, 0, basePos[1] * width + rightBasis[1] * width];

    console.log({ pos1, pos2, pos3, pos4 });

    const uv1 = [i / 4, 0];
    const uv2 = [(i + 1) / 4, 0];
    const uv3 = [i / 4, 1];
    const uv4 = [(i + 1) / 4, 1];

    const normal = [basePos[0], 0, basePos[1]];
    const normal4 = new Array(4).fill(normal).flat();

    return {
      position: [...pos1, ...pos2, ...pos3, ...pos4],
      normal: normal4,
      uv: [...uv1, ...uv2, ...uv3, ...uv4],
      index: [0, 2, 3, 0, 3, 1].map((n) => n + 4 * i),
    };
  }
}

export default BoxEffectGeometry;
