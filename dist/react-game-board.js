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
      console.log(`file=${file} rank=${rank} level=${level}`);

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

      const rank = parseInt(an.trim().substring(1));

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

  /* eslint no-console: ["error", { allow: ["log"] }] */

  const loadImage = src =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        console.log(`Loaded image: ${src} ${img.width}x${img.height}`);
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

    computeCenter(size, offset, f, r) {
      const { boardCalculator } = this.props;

      const dim = boardCalculator.cellDimensions(size);
      const myOffset = Immutable({
        x: dim.w / 2.0 + offset.x,
        y: dim.h / 2.0 + offset.y
      });

      return boardCalculator.cellToPixel(f, r, size, myOffset);
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
            const center = this.computeCenter(size0, offset0, f - 1, r - 1);

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

    drawCells(context) {
      const {
        boardCalculator,
        coordinateCalculator,
        gridColor,
        gridLineWidth,
        cellColorFunction,
        cellImageFunction,
        isCellUsedFunction
      } = this.props;
      const { imageMap, offset, size } = this.state;

      for (let r = 1; r <= coordinateCalculator.rankCount; r += 1) {
        for (let f = 1; f <= coordinateCalculator.fileCount; f += 1) {
          const an = coordinateCalculator.fileRankToAN(f, r);

          if (isCellUsedFunction(an)) {
            const center = this.computeCenter(size, offset, f - 1, r - 1);
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
    }

    drawTokens(context) {
      const {
        coordinateCalculator,
        drawTokenFunction,
        isCellUsedFunction,
        anToTokens
      } = this.props;
      const { imageMap, offset, size } = this.state;
      context.save();

      for (let r = 1; r <= coordinateCalculator.rankCount; r += 1) {
        for (let f = 1; f <= coordinateCalculator.fileCount; f += 1) {
          const an = coordinateCalculator.fileRankToAN(f, r);

          if (isCellUsedFunction(an)) {
            const token = anToTokens[an];
            const center = this.computeCenter(size, offset, f - 1, r - 1);
            drawTokenFunction(context, center, size, an, token, imageMap);
          }
        }
      }

      context.restore();
    }

    handleOnClickFunction(event) {
      const {
        boardCalculator,
        coordinateCalculator,
        isCellUsedFunction,
        onClick
      } = this.props;
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
            const center = this.computeCenter(size, offset, f - 1, r - 1);
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
      const { images } = this.props;

      for (let i = 0; i < images.length; i += 1) {
        loadImage(images[i]).then(img => {
          const { imageMap: oldImageMap } = this.state;
          this.setState({ imageMap: R.assoc(images[i], img, oldImageMap) });
        });
      }
    }

    paint() {
      const { height, myKey, width } = this.props;

      const canvas = document.getElementById(myKey);
      const context = canvas.getContext("2d");

      // Layer 0: Board background color
      context.clearRect(0, 0, width, height);

      // Layer 1: Cells
      this.drawCells(context);

      // Layer 2: Tokens
      this.drawTokens(context);
    }

    render() {
      const { backgroundColor, height, myKey, width } = this.props;

      return ReactDOMFactories.canvas({
        id: myKey,
        key: myKey,
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
    gridColor: PropTypes.string,
    gridLineWidth: PropTypes.number,
    height: PropTypes.number,
    images: PropTypes.arrayOf(),
    isCellUsedFunction: PropTypes.func,
    myKey: PropTypes.string,
    onClick: PropTypes.func,
    width: PropTypes.number
  };

  GameBoardUI.defaultProps = {
    backgroundColor: "Gainsboro",
    cellColorFunction: () => undefined,
    cellImageFunction: () => undefined,
    gridColor: "Black",
    gridLineWidth: 1,
    height: 480,
    images: [],
    isCellUsedFunction: () => true,
    myKey: "hexBoardCanvas",
    onClick: () => {},
    width: 640
  };

  GameBoardUI.BoardCalculator = BoardCalculator;
  GameBoardUI.CoordinateCalculator = CoordinateCalculator;

  return GameBoardUI;

}));
