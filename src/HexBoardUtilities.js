// see https://www.redblobgames.com/grids/hexagons/
// Cube coordinates constraint: x + y + z = 0

const HexBoardUtilities = {};

// const DEG_TO_RAD = Math.PI / 180.0;
// const SQRT3 = Math.sqrt(3.0);

HexBoardUtilities.createCube = ({ x = 0, y = 0, z = 0 } = {}) => ({ x, y, z });

HexBoardUtilities.createDimension = ({ w = 0, h = 0 } = {}) => ({ w, h });

HexBoardUtilities.createHex = ({ q = 0, r = 0 } = {}) => ({ q, r });

HexBoardUtilities.createPoint = ({ x = 0, y = 0 } = {}) => ({ x, y });

// const axialDirections = [
//   HexBoardUtilities.createHex({ q: +1, r: 0 }),
//   HexBoardUtilities.createHex({ q: +1, r: -1 }),
//   HexBoardUtilities.createHex({ q: 0, r: -1 }),
//   HexBoardUtilities.createHex({ q: -1, r: 0 }),
//   HexBoardUtilities.createHex({ q: -1, r: +1 }),
//   HexBoardUtilities.createHex({ q: 0, r: +1 })
// ];

// const cubeDiagonals = [
//   HexBoardUtilities.createCube({ x: +2, y: -1, z: -1 }),
//   HexBoardUtilities.createCube({ x: +1, y: +1, z: -2 }),
//   HexBoardUtilities.createCube({ x: -1, y: +2, z: -1 }),
//   HexBoardUtilities.createCube({ x: -2, y: +1, z: +1 }),
//   HexBoardUtilities.createCube({ x: -1, y: -1, z: +2 }),
//   HexBoardUtilities.createCube({ x: +1, y: -2, z: +1 })
// ];

const cubeDirections = [
  HexBoardUtilities.createCube({ x: +1, y: -1, z: 0 }),
  HexBoardUtilities.createCube({ x: +1, y: 0, z: -1 }),
  HexBoardUtilities.createCube({ x: 0, y: +1, z: -1 }),
  HexBoardUtilities.createCube({ x: -1, y: +1, z: 0 }),
  HexBoardUtilities.createCube({ x: -1, y: 0, z: +1 }),
  HexBoardUtilities.createCube({ x: 0, y: -1, z: +1 })
];

const cubeAdd = (a, b) =>
  HexBoardUtilities.createCube({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

// Linear interpolation for floats.
// const interpolate = (a, b, t) => a + (b - a) * t;

// Linear interpolation for hexes.
// const cubeInterpolate = (a, b, t) =>
//   HexBoardUtilities.createCube({
//     x: interpolate(a.x, b.x, t),
//     y: interpolate(a.y, b.y, t),
//     z: interpolate(a.z, b.z, t)
//   });

// const cubeRound = cube => {
//   let rx = Math.round(cube.x);
//   let ry = Math.round(cube.y);
//   let rz = Math.round(cube.z);
//
//   const xDiff = Math.abs(rx - cube.x);
//   const yDiff = Math.abs(ry - cube.y);
//   const zDiff = Math.abs(rz - cube.z);
//
//   if (xDiff > yDiff && xDiff > zDiff) {
//     rx = -ry - rz;
//   } else if (yDiff > zDiff) {
//     ry = -rx - rz;
//   } else {
//     rz = -rx - ry;
//   }
//
//   return HexBoardUtilities.createCube({ x: rx, y: ry, z: rz });
// };

// const hexRound = hex =>
//   HexBoardUtilities.cubeToAxial(cubeRound(HexBoardUtilities.axialToCube(hex)));

// /////////////////////////////////////////////////////////////////////////////////////////////////
HexBoardUtilities.axialToCube = hex => {
  const x = hex.q;
  const z = hex.r;
  const y = -x - z;
  return HexBoardUtilities.createCube({ x, y, z });
};

// HexBoardUtilities.cubeDiagonalNeighbor = (cube, direction) =>
//   cubeAdd(cube, cubeDiagonals[direction]);

HexBoardUtilities.cubeDirection = direction => cubeDirections[direction];

HexBoardUtilities.cubeDistance = (a, b) =>
  (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;

// HexBoardUtilities.cubeLinedraw = (a, b) => {
//   const N = HexBoardUtilities.cubeDistance(a, b);
//   const results = [];
//   for (let i = 0; i <= N; i += 1) {
//     results.push(HexBoardUtilities.cubeRound(cubeInterpolate(a, b, (1.0 / N) * i)));
//   }
//   return results;
// };

HexBoardUtilities.cubeNeighbor = (cube, direction) =>
  cubeAdd(cube, HexBoardUtilities.cubeDirection(direction));

HexBoardUtilities.cubeNeighbors = cube => {
  const reduceFunction = (accum, cubeDirection) => {
    return R.append(cubeAdd(cube, cubeDirection), accum);
  };

  return R.reduce(reduceFunction, [], cubeDirections);
};

HexBoardUtilities.cubeToAxial = cube => {
  const q = cube.x;
  const r = cube.z;
  return HexBoardUtilities.createHex({ q, r });
};

// HexBoardUtilities.flatHexCorner = (center, size, i) => {
//   const angleDeg = 60 * i;
//   const angleRad = DEG_TO_RAD * angleDeg;
//   return HexBoardUtilities.createPoint({
//     x: center.x + size * Math.cos(angleRad),
//     y: center.y + size * Math.sin(angleRad)
//   });
// };
//
// HexBoardUtilities.flatHexDimensions = size =>
//   HexBoardUtilities.createDimension({ w: 2.0 * size, h: SQRT3 * size });
//
// HexBoardUtilities.flatHexSpacing = size => {
//   const dim = HexBoardUtilities.flatHexDimensions(size);
//   return HexBoardUtilities.createDimension({ w: 0.75 * dim.w, h: dim.h });
// };
//
// HexBoardUtilities.flatHexToPixel = (hex, size, offset = { x: 0, y: 0 }) => {
//   const x = size * ((3 / 2) * hex.q);
//   const y = size * ((SQRT3 / 2) * hex.q + SQRT3 * hex.r);
//   return HexBoardUtilities.createPoint({ x: x + offset.x, y: y + offset.y });
// };
//
// HexBoardUtilities.hexDiagonalNeighbor = (hex, direction) => {
//   const cube = HexBoardUtilities.axialToCube(hex);
//   const neighbor = HexBoardUtilities.cubeDiagonalNeighbor(cube, direction);
//   return HexBoardUtilities.cubeToAxial(neighbor);
// };
//
// HexBoardUtilities.hexDirection = direction => axialDirections[direction];

HexBoardUtilities.hexDistance = (a, b) => {
  const ac = HexBoardUtilities.axialToCube(a);
  const bc = HexBoardUtilities.axialToCube(b);
  return HexBoardUtilities.cubeDistance(ac, bc);
};

HexBoardUtilities.hexNeighbor = (hex, direction) => {
  const cube = HexBoardUtilities.axialToCube(hex);
  const neighbor = HexBoardUtilities.cubeNeighbor(cube, direction);
  return HexBoardUtilities.cubeToAxial(neighbor);
};

HexBoardUtilities.hexNeighbors = hex => {
  const cube = HexBoardUtilities.axialToCube(hex);
  const cubeNeighbors = HexBoardUtilities.cubeNeighbors(cube);
  const mapFunction = c => HexBoardUtilities.cubeToAxial(c);

  return R.map(mapFunction, cubeNeighbors);
};

// HexBoardUtilities.pixelToPointyHex = (point, size) => {
//   // 2 * sin(60 deg) = sqrt(3)
//   const q = ((SQRT3 / 3) * point.x - (1 / 3) * point.y) / size;
//   const r = ((2 / 3) * point.y) / size;
//   return hexRound(HexBoardUtilities.createHex({ q, r }));
// };
//
// HexBoardUtilities.pixelToFlatHex = (point, size) => {
//   const q = ((2 / 3) * point.x) / size;
//   const r = ((-1 / 3) * point.x + (SQRT3 / 3) * point.y) / size;
//   return hexRound(HexBoardUtilities.createHex({ q, r }));
// };
//
// HexBoardUtilities.pointyHexCorner = (center, size, i) => {
//   const angleDeg = 60 * i - 30;
//   const angleRad = DEG_TO_RAD * angleDeg;
//   return HexBoardUtilities.createPoint({
//     x: center.x + size * Math.cos(angleRad),
//     y: center.y + size * Math.sin(angleRad)
//   });
// };
//
// HexBoardUtilities.pointyHexDimensions = size =>
//   HexBoardUtilities.createDimension({ w: SQRT3 * size, h: 2 * size });
//
// HexBoardUtilities.pointyHexSpacing = size => {
//   const dim = HexBoardUtilities.pointyHexDimensions(size);
//   return HexBoardUtilities.createDimension({ w: dim.w, h: 0.75 * dim.h });
// };
//
// HexBoardUtilities.pointyHexToPixel = (hex, size, offset = { x: 0, y: 0 }) => {
//   const x = size * (SQRT3 * hex.q + (SQRT3 / 2) * hex.r);
//   const y = size * ((3 / 2) * hex.r);
//   return HexBoardUtilities.createPoint({ x: x + offset.x, y: y + offset.y });
// };

// /////////////////////////////////////////////////////////////////////////////////////////////////
// HexBoardUtilities.boundingBox = points => {
//   const xx = R.map(R.prop("x"), points);
//   const yy = R.map(R.prop("y"), points);
//   const minX = Math.min(...xx);
//   const minY = Math.min(...yy);
//   const maxX = Math.max(...xx);
//   const maxY = Math.max(...yy);
//
//   return {
//     x: minX,
//     y: minY,
//     width: maxX - minX,
//     height: maxY - minY
//   };
// };
//
// HexBoardUtilities.computeCorners = (center, size, isFlat) => {
//   const answer = [];
//
//   for (let i = 0; i < 6; i += 1) {
//     const corner = isFlat
//       ? HexBoardUtilities.flatHexCorner(center, size, i)
//       : HexBoardUtilities.pointyHexCorner(center, size, i);
//     answer.push(corner);
//   }
//
//   return answer;
// };
//
// HexBoardUtilities.enterPath = (context, points) => {
//   context.beginPath();
//   context.moveTo(points[0].x, points[0].y);
//
//   for (let i = 1; i < points.length; i += 1) {
//     context.lineTo(points[i].x, points[i].y);
//   }
//   context.closePath();
// };
//
// HexBoardUtilities.drawCircularImage = (context, corners, img) => {
//   const box = HexBoardUtilities.boundingBox(corners);
//   const diameter = 0.9 * Math.min(box.width, box.height);
//   const offsetX = (box.width - diameter) / 2.0;
//   const offsetY = (box.height - diameter) / 2.0;
//   context.drawImage(img, box.x + offsetX, box.y + offsetY, diameter, diameter);
// };
//
// HexBoardUtilities.drawHex = (context0, corners, gridColor, gridLineWidth) => {
//   const context = context0;
//   context.save();
//   context.lineJoin = "miter";
//   context.lineWidth = gridLineWidth;
//   context.strokeStyle = gridColor;
//   HexBoardUtilities.enterPath(context, corners);
//   context.stroke();
//   context.restore();
// };
//
// HexBoardUtilities.drawRectangularImage = (context, corners, img) => {
//   const box = HexBoardUtilities.boundingBox(corners);
//   context.drawImage(img, box.x, box.y, box.width, box.height);
// };
//
// HexBoardUtilities.fillHex = (context0, corners, background) => {
//   const context = context0;
//   context.save();
//   HexBoardUtilities.enterPath(context, corners);
//   context.fillStyle = background;
//   context.fill();
//   context.restore();
// };

export default HexBoardUtilities;
