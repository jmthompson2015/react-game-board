(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ReactGameBoard = factory());
}(this, function () { 'use strict';

  /* eslint no-underscore-dangle: ["error", { "allow": ["_isFlat", "_isSquare"] }] */

  const DEG_TO_RAD = Math.PI / 180.0;
  const COS45 = Math.cos(45.0 * DEG_TO_RAD);
  const SQRT3 = Math.sqrt(3.0);

  const pointsFromPath = path => {
    const answer = [];

    for (let i = 0; i < path.length; i += 1) {
      const point = path[i];
      answer.push(point.x);
      answer.push(point.y);
    }

    // Close path.
    const point = path[0];
    answer.push(point.x);
    answer.push(point.y);

    return answer;
  };

  /*
   * Tests if a point is Left|On|Right of an infinite line.
   *
   * Input: three points P0, P1, and P2
   *
   * Return:
   *
   * >0 for P2 left of the line through P0 and P1
   *
   * =0 for P2 on the line
   *
   * <0 for P2 right of the line
   *
   * See: Algorithm 1 <a href="http://geomalgorithms.com/a01-_area.html">"Area of Triangles and Polygons"</a>
   */
  const isLeft = (x0, y0, x1, y1, x2, y2) => (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);

  /*
   * winding number test for a point in a polygon
   *
   * Input: P = a point,
   *
   * V[] = vertex points of a polygon V[n+1] with V[n]=V[0]
   *
   * Return: wn = the winding number (=0 only when P is outside)
   */
  const determineWindingNumber = (x, y, polygon) => {
    let wn = 0; // the winding number counter
    const points = pointsFromPath(polygon);
    const n = points.length - 2;

    // loop through all edges of the polygon
    for (let i = 0; i < n; i += 2) {
      // edge from V[i] to V[i+1]
      if (points[i + 1] <= y) {
        // start y <= P.y
        if (points[i + 3] > y) {
          // an upward crossing
          if (isLeft(points[i], points[i + 1], points[i + 2], points[i + 3], x, y) > 0) {
            // P
            // left of edge
            wn += 1; // have a valid up intersect
          }
        }
      }
      // start y > P.y (no test needed)
      else if (points[i + 3] <= y) {
        // a downward crossing
        if (isLeft(points[i], points[i + 1], points[i + 2], points[i + 3], x, y) < 0) {
          // P
          // right of edge
          wn -= 1; // have a valid down intersect
        }
      }
    }

    return wn;
  };

  class BoardCalculator {
    constructor(isSquare = true, isFlat = true) {
      this._isSquare = isSquare;
      this._isFlat = isFlat;
    }

    get cornerCount() {
      return this.isSquare ? 4 : 6;
    }

    get isFlat() {
      return this._isFlat;
    }

    get isHexagon() {
      return !this._isSquare;
    }

    get isPointy() {
      return !this._isFlat;
    }

    get isSquare() {
      return this._isSquare;
    }

    cellCorner(center, size, i) {
      const deltaAngle = this.isSquare ? 90.0 : 60.0;
      const factor = this.isSquare ? 0.5 : 1.0;
      let startAngle = 0.0;

      if (this.isSquare && this.isFlat) {
        startAngle = 45.0;
      }

      if (this.isHexagon && this.isPointy) {
        startAngle = 30.0;
      }

      const angle = DEG_TO_RAD * (deltaAngle * i - startAngle);

      return Immutable({
        x: center.x + factor * size * Math.cos(angle),
        y: center.y + factor * size * Math.sin(angle)
      });
    }

    cellDimensions(size) {
      let w;
      let h;

      if (this.isSquare && this.isFlat) {
        w = 2.0 * COS45 * size;
        h = 2.0 * COS45 * size;
      } else if (this.isSquare && this.isPointy) {
        w = 2.0 * size;
        h = 2.0 * size;
      } else if (this.isHexagon && this.isFlat) {
        w = 2.0 * size;
        h = SQRT3 * size;
      } else if (this.isHexagon && this.isPointy) {
        w = SQRT3 * size;
        h = 2 * size;
      }

      return Immutable({ w, h });
    }

    cellToPixel(f, r, size, offset = { x: 0, y: 0 }) {
      let x;
      let y;

      if (this.isSquare && this.isFlat) {
        x = size * COS45 * f;
        y = size * COS45 * r;
      } else if (this.isSquare && this.isPointy) {
        x = (size * f - size * r) / 2.0;
        y = (size * f + size * r) / 2.0;
      } else if (this.isHexagon && this.isFlat) {
        x = size * (1.5 * f);
        y = size * ((SQRT3 / 2) * f + SQRT3 * r);
      } else if (this.isHexagon && this.isPointy) {
        x = size * (SQRT3 * f + (SQRT3 / 2) * r);
        y = size * (1.5 * r);
      }

      return Immutable({ x: x + offset.x, y: y + offset.y });
    }

    computeCorners(center, size) {
      const answer = [];

      for (let i = 0; i < this.cornerCount; i += 1) {
        const corner = this.cellCorner(center, size, i);
        answer.push(corner);
      }

      return answer;
    }
  }

  BoardCalculator.boundingBox = points => {
    const xx = R.map(R.prop("x"), points);
    const yy = R.map(R.prop("y"), points);
    const minX = Math.min(...xx);
    const minY = Math.min(...yy);
    const maxX = Math.max(...xx);
    const maxY = Math.max(...yy);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  BoardCalculator.drawCell = (context0, corners, gridColor, gridLineWidth) => {
    const context = context0;
    context.save();
    context.lineJoin = "miter";
    context.lineWidth = gridLineWidth;
    context.strokeStyle = gridColor;
    BoardCalculator.enterPath(context, corners);
    context.stroke();
    context.restore();
  };

  BoardCalculator.drawCircularImage = (context, corners, img) => {
    const box = BoardCalculator.boundingBox(corners);
    const diameter = 0.9 * Math.min(box.width, box.height);
    const offsetX = (box.width - diameter) / 2.0;
    const offsetY = (box.height - diameter) / 2.0;
    context.drawImage(img, box.x + offsetX, box.y + offsetY, diameter, diameter);
  };

  BoardCalculator.drawRectangularImage = (context, corners, img) => {
    const box = BoardCalculator.boundingBox(corners);
    context.drawImage(img, box.x, box.y, box.width, box.height);
  };

  BoardCalculator.enterPath = (context, points) => {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.closePath();
  };

  BoardCalculator.fillCell = (context0, corners, background) => {
    const context = context0;
    context.save();
    BoardCalculator.enterPath(context, corners);
    context.fillStyle = background;
    context.fill();
    context.restore();
  };

  BoardCalculator.isPointInPolygon = (x, y, polygon) => {
    const wn = determineWindingNumber(x, y, polygon);

    return wn % 2 !== 0;
  };

  /* eslint no-underscore-dangle:
    ["error", { "allow": ["_fileCount", "_rankCount", "_levelCount"] }] */

  // AN = Algebraic Notation
  // file in [1, fileCount]
  // rank in [1, rankCount]
  // level in [1, levelCount]

  const isFileLetterOutOfBounds = (fileCount, letter) => {
    const max = String.fromCodePoint("a".codePointAt(0) + fileCount - 1);

    return letter < "a" || letter > max;
  };

  const isFileOutOfBounds = (fileCount, file) => file < 1 || file > fileCount;

  const isLevelLetterOutOfBounds = (levelCount, letter) => {
    const max = String.fromCodePoint("A".codePointAt(0) + levelCount - 1);

    return letter < "A" || letter > max;
  };

  const isLevelOutOfBounds = (levelCount, rank) => rank < 1 || rank > levelCount;

  const isNil = value => value === undefined || value === null;

  const isRankOutOfBounds = (rankCount, rank) => rank < 1 || rank > rankCount;

  class CoordinateCalculator {
    constructor(fileCount = 8, rankCount = 8, levelCount = 1) {
      this._fileCount = fileCount;
      this._rankCount = rankCount;
      this._levelCount = levelCount;
    }

    get fileCount() {
      return this._fileCount;
    }

    get rankCount() {
      return this._rankCount;
    }

    get levelCount() {
      return this._levelCount;
    }

    anToFile(an) {
      if (isNil(an)) {
        return null;
      }

      const letter = an.trim().charAt(0);

      if (isNil(letter) || isFileLetterOutOfBounds(this.fileCount, letter)) {
        return null;
      }

      return letter.codePointAt(0) - "a".codePointAt(0) + 1;
    }

    anToIndex(an) {
      if (isNil(an)) {
        return null;
      }

      const file = this.anToFile(an);
      const rank = this.anToRank(an);
      const level = this.anToLevel(an);
      // console.log(`file=${file} rank=${rank} level=${level}`);

      if (isNil(file) || isNil(rank)) {
        return null;
      }

      if (isNil(level)) {
        return (rank - 1) * this.fileCount + (file - 1);
      }

      return (level - 1) * this.rankCount * this.fileCount + (rank - 1) * this.fileCount + (file - 1);
    }

    anToLevel(an) {
      if (isNil(an)) {
        return null;
      }

      const an2 = an.trim();
      const letter = an2.charAt(an2.length - 1);

      if (isNil(letter) || isLevelLetterOutOfBounds(this.levelCount, letter)) {
        return null;
      }

      return letter.codePointAt(0) - "A".codePointAt(0) + 1;
    }

    anToRank(an) {
      if (isNil(an)) {
        return null;
      }

      const rank = parseInt(an.trim().substring(1), 10);

      return isRankOutOfBounds(this.rankCount, rank) ? null : rank;
    }

    fileRankToAN(file, rank) {
      if (isFileOutOfBounds(this.fileCount, file) || isRankOutOfBounds(this.rankCount, rank)) {
        return null;
      }

      const letter = String.fromCodePoint("a".codePointAt(0) + file - 1);

      if (isNil(letter) || isFileLetterOutOfBounds(this.fileCount, letter)) {
        return null;
      }

      return `${letter}${rank}`;
    }

    fileRankLevelToAN(file, rank, level) {
      if (
        isFileOutOfBounds(this.fileCount, file) ||
        isRankOutOfBounds(this.rankCount, rank) ||
        isLevelOutOfBounds(this.levelCount, level)
      ) {
        return null;
      }

      const fileLetter = String.fromCodePoint("a".codePointAt(0) + file - 1);

      if (isNil(fileLetter) || isFileLetterOutOfBounds(this.fileCount, fileLetter)) {
        return null;
      }

      const levelLetter = String.fromCodePoint("A".codePointAt(0) + level - 1);

      if (isNil(levelLetter) || isLevelLetterOutOfBounds(this.levelCount, levelLetter)) {
        return null;
      }

      return `${fileLetter}${rank}${levelLetter}`;
    }
  }

  // see https://www.redblobgames.com/grids/hexagons/
  // Cube coordinates constraint: x + y + z = 0

  const HexBoardUtilities = {};

  // const DEG_TO_RAD = Math.PI / 180.0;
  // const SQRT3 = Math.sqrt(3.0);

  HexBoardUtilities.createCube = ({ x = 0, y = 0, z = 0 } = {}) => Immutable({ x, y, z });

  HexBoardUtilities.createDimension = ({ w = 0, h = 0 } = {}) => Immutable({ w, h });

  HexBoardUtilities.createHex = ({ q = 0, r = 0 } = {}) => Immutable({ q, r });

  HexBoardUtilities.createPoint = ({ x = 0, y = 0 } = {}) => Immutable({ x, y });

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

  /* eslint no-console: ["error", { allow: ["log"] }] */

  const computeCenter = boardCalculator => (size, offset, f, r) => {
    const dim = boardCalculator.cellDimensions(size);
    const myOffset = Immutable({
      x: dim.w / 2.0 + offset.x,
      y: dim.h / 2.0 + offset.y
    });

    return boardCalculator.cellToPixel(f, r, size, myOffset);
  };

  const drawCells = (
    boardCalculator,
    coordinateCalculator,
    gridColor,
    gridLineWidth,
    cellColorFunction,
    cellImageFunction,
    isCellUsedFunction
  ) => (imageMap, offset, size) => context => {
    for (let r = 1; r <= coordinateCalculator.rankCount; r += 1) {
      for (let f = 1; f <= coordinateCalculator.fileCount; f += 1) {
        const an = coordinateCalculator.fileRankToAN(f, r);

        if (isCellUsedFunction(an)) {
          const center = computeCenter(boardCalculator)(size, offset, f - 1, r - 1);
          const corners = boardCalculator.computeCorners(center, size);

          // Layer 0: Cell background color
          const background = cellColorFunction(an);

          if (background) {
            BoardCalculator.fillCell(context, corners, background);
          }

          // Layer 1: Cell background image
          const image = cellImageFunction(an);

          if (image) {
            const img = imageMap[image];

            if (img) {
              BoardCalculator.drawRectangularImage(context, corners, img);
            }
          }

          // Layer 2: Cell outline
          BoardCalculator.drawCell(context, corners, gridColor, gridLineWidth);
        }
      }
    }
  };

  const drawTokens = (
    boardCalculator,
    coordinateCalculator,
    drawTokenFunction,
    isCellUsedFunction,
    anToTokens
  ) => (imageMap, offset, size) => context => {
    context.save();

    for (let r = 1; r <= coordinateCalculator.rankCount; r += 1) {
      for (let f = 1; f <= coordinateCalculator.fileCount; f += 1) {
        const an = coordinateCalculator.fileRankToAN(f, r);

        if (isCellUsedFunction(an)) {
          const token = anToTokens[an];
          const center = computeCenter(boardCalculator)(size, offset, f - 1, r - 1);
          drawTokenFunction(context, center, size, an, token, imageMap);
        }
      }
    }

    context.restore();
  };

  const loadImage = (src, isVerbose) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        if (isVerbose) {
          console.log(`Loaded image: ${src} ${img.width}x${img.height}`);
        }
        resolve(img);
      });
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });

  // /////////////////////////////////////////////////////////////////////////////////////////////////
  class GameBoardUI extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = {
        imageMap: {},
        offset: Immutable({ x: 0, y: 0 }),
        size: 1.0
      };

      this.handleOnClick = this.handleOnClickFunction.bind(this);
    }

    componentDidMount() {
      this.loadImages();
      this.computeSize();
      this.paint();
    }

    componentDidUpdate() {
      this.paint();
    }

    computeSize() {
      const {
        boardCalculator,
        coordinateCalculator,
        gridLineWidth,
        height,
        isCellUsedFunction,
        width
      } = this.props;
      const { cornerCount } = boardCalculator;

      const size0 = 1.0;
      const offset0 = Immutable({ x: 0, y: 0 });
      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;

      for (let r = 1; r <= coordinateCalculator.rankCount; r += 1) {
        for (let f = 1; f <= coordinateCalculator.fileCount; f += 1) {
          const an = coordinateCalculator.fileRankToAN(f, r);

          if (isCellUsedFunction(an)) {
            const center = computeCenter(boardCalculator)(size0, offset0, f - 1, r - 1);

            for (let i = 0; i < cornerCount; i += 1) {
              const corner = boardCalculator.cellCorner(center, size0, i);
              minX = Math.min(corner.x, minX);
              minY = Math.min(corner.y, minY);
              maxX = Math.max(corner.x, maxX);
              maxY = Math.max(corner.y, maxY);
            }
          }
        }
      }

      const width0 = maxX - minX;
      const height0 = maxY - minY;
      const sizeW = (width - gridLineWidth) / width0;
      const sizeH = (height - gridLineWidth) / height0;
      const size = Math.min(sizeW, sizeH);

      const margin = {
        w: (width - size * width0) / 2.0,
        h: (height - size * height0) / 2.0
      };
      const offset = Immutable({
        x: margin.w - size * minX,
        y: margin.h - size * minY
      });

      this.setState({ size, offset });
    }

    handleOnClickFunction(event) {
      const { boardCalculator, coordinateCalculator, isCellUsedFunction, onClick } = this.props;
      const { offset, size } = this.state;

      const canvas = event.currentTarget;
      const clientRect = canvas.getBoundingClientRect();
      const point = Immutable({
        x: Math.round(event.clientX - clientRect.left),
        y: Math.round(event.clientY - clientRect.top)
      });

      let answer = null;

      for (let r = 1; !answer && r <= coordinateCalculator.rankCount; r += 1) {
        for (let f = 1; !answer && f <= coordinateCalculator.fileCount; f += 1) {
          const an = coordinateCalculator.fileRankToAN(f, r);

          if (isCellUsedFunction(an)) {
            const center = computeCenter(boardCalculator)(size, offset, f - 1, r - 1);
            const corners = boardCalculator.computeCorners(center, size);

            if (BoardCalculator.isPointInPolygon(point.x, point.y, corners)) {
              answer = an;
            }
          }
        }
      }

      onClick(answer);
    }

    loadImages() {
      const { images, isVerbose } = this.props;

      for (let i = 0; i < images.length; i += 1) {
        loadImage(images[i], isVerbose).then(img => {
          const { imageMap: oldImageMap } = this.state;
          this.setState({ imageMap: R.assoc(images[i], img, oldImageMap) });
        });
      }
    }

    paint() {
      const {
        anToTokens,
        boardCalculator,
        cellColorFunction,
        cellImageFunction,
        coordinateCalculator,
        customKey,
        drawTokenFunction,
        gridColor,
        gridLineWidth,
        height,
        isCellUsedFunction,
        width
      } = this.props;
      const { imageMap, offset, size } = this.state;

      const canvas = document.getElementById(customKey);
      const context = canvas.getContext("2d");

      // Layer 0: Board background color
      context.clearRect(0, 0, width, height);

      // Layer 1: Cells
      drawCells(
        boardCalculator,
        coordinateCalculator,
        gridColor,
        gridLineWidth,
        cellColorFunction,
        cellImageFunction,
        isCellUsedFunction
      )(imageMap, offset, size)(context);
      // Layer 2: Tokens
      drawTokens(
        boardCalculator,
        coordinateCalculator,
        drawTokenFunction,
        isCellUsedFunction,
        anToTokens
      )(imageMap, offset, size)(context);
    }

    render() {
      const { backgroundColor, customKey, height, width } = this.props;

      return ReactDOMFactories.canvas({
        id: customKey,
        key: customKey,
        onClick: this.handleOnClick,
        style: { backgroundColor },
        width,
        height
      });
    }
  }

  GameBoardUI.propTypes = {
    anToTokens: PropTypes.shape().isRequired,
    boardCalculator: PropTypes.shape().isRequired,
    coordinateCalculator: PropTypes.shape().isRequired,
    drawTokenFunction: PropTypes.func.isRequired,

    backgroundColor: PropTypes.string,
    cellColorFunction: PropTypes.func,
    cellImageFunction: PropTypes.func,
    customKey: PropTypes.string,
    gridColor: PropTypes.string,
    gridLineWidth: PropTypes.number,
    height: PropTypes.number,
    images: PropTypes.arrayOf(PropTypes.string),
    isCellUsedFunction: PropTypes.func,
    isVerbose: PropTypes.bool,
    onClick: PropTypes.func,
    width: PropTypes.number
  };

  GameBoardUI.defaultProps = {
    backgroundColor: "Gainsboro",
    cellColorFunction: () => undefined,
    cellImageFunction: () => undefined,
    customKey: "hexBoardCanvas",
    gridColor: "Black",
    gridLineWidth: 1,
    height: 480,
    images: [],
    isCellUsedFunction: () => true,
    isVerbose: false,
    onClick: () => {},
    width: 640
  };

  GameBoardUI.BoardCalculator = BoardCalculator;
  GameBoardUI.CoordinateCalculator = CoordinateCalculator;
  GameBoardUI.HexBoardUtilities = HexBoardUtilities;

  return GameBoardUI;

}));
