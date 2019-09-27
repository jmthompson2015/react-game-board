/* eslint no-console: ["error", { allow: ["log"] }] */

// see https://www.redblobgames.com/grids/hexagons/
import BoardCalculator from "./BoardCalculator.js";
import CoordinateCalculator from "./CoordinateCalculator.js";

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
  images: PropTypes.arrayOf(PropTypes.string),
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

export default GameBoardUI;
