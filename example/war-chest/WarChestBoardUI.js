import BoardCalculator from "../../src/BoardCalculator.js";
import BoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

import ControlMarker from "./ControlMarker.js";
import UnitCoin from "./UnitCoin.js";

const images0 = R.map(R.prop("image"), UnitCoin.values());
const images1 = R.map(R.prop("image"), ControlMarker.values());
const images = ["resource/control/NeutralControlMarker.png"].concat(images0.concat(images1));

const IS_SQUARE = false;
const IS_FLAT = true;
const UNUSED_4P = [
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "b1",
  "b2",
  "b3",
  "b4",
  "c1",
  "c2",
  "c3",
  "d1",
  "d2",
  "e1",
  "g7",
  "h6",
  "h7",
  "i5",
  "i6",
  "i7",
  "j4",
  "j5",
  "j6",
  "j7",
  "k3",
  "k4",
  "k5",
  "k6",
  "k7",
];
const HEX_4P = ["a6", "a7", "b5", "b6", "b7", "j1", "j2", "j3", "k1", "k2"];
const UNUSED_2P = HEX_4P.concat(UNUSED_4P);
const CONTROL_POINTS_2P = ["c6", "d4", "d7", "e2", "e5", "g3", "g6", "h1", "h4", "i2"];
const CONTROL_POINTS_4P = ["a7", "b5", "j3", "k1"].concat(CONTROL_POINTS_2P);

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(11, 7);

const drawCoin = (context, center, size, an, token, imageMap) => {
  const corners = boardCalculator.computeCorners(center, size, IS_FLAT);
  const img = imageMap[token.image];

  if (img) {
    BoardCalculator.drawCircularImage(context, corners, img);
  }
};

const drawControl = (context, center, size, an, token, imageMap) => {
  const corners = boardCalculator.computeCorners(center, size, IS_FLAT);
  const img = imageMap[token.image];

  if (img) {
    BoardCalculator.drawRectangularImage(context, corners, img);
  }
};

const drawTokenFunction = (context0, center, size, an, tokens, imageMap) => {
  const context = context0;

  if (tokens) {
    if (Array.isArray(tokens)) {
      for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];
        if (token.image.indexOf("Control") >= 0) {
          drawControl(context, center, size, an, token, imageMap);
        } else {
          drawCoin(context, center, size, an, token, imageMap);
        }
      }
    } else if (tokens.image.indexOf("Control") >= 0) {
      drawControl(context, center, size, an, tokens, imageMap);
    } else {
      drawCoin(context, center, size, an, tokens, imageMap);
    }
  } else {
    context.save();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "Green";
    context.font = "24px serif";
    context.fillText(an, center.x, center.y);
    context.restore();
  }
};

const cellColorFunction = (an) => (HEX_4P.includes(an) ? "hsl(40,30%,45%)" : "hsl(40,30%,60%)");

const cellImageFunction = (isTwoPlayer) => (an) => {
  const controlPoints = isTwoPlayer ? CONTROL_POINTS_2P : CONTROL_POINTS_4P;

  return controlPoints.includes(an) ? "resource/control/NeutralControlMarker.png" : undefined;
};

const isCellUsedFunction = (isTwoPlayer) => (an) => {
  const unused = isTwoPlayer ? UNUSED_2P : UNUSED_4P;

  return !unused.includes(an);
};

class WarChestBoardUI extends React.PureComponent {
  render() {
    const { anToTokens, isTwoPlayer, customKey } = this.props;

    return React.createElement(BoardUI, {
      anToTokens,
      boardCalculator,
      coordinateCalculator,
      drawTokenFunction,

      backgroundColor: "hsl(40,30%,75%)",
      cellColorFunction,
      cellImageFunction: cellImageFunction(isTwoPlayer),
      customKey,
      gridColor: "hsl(40,30%,75%)",
      gridLineWidth: 3,
      images,
      isCellUsedFunction: isCellUsedFunction(isTwoPlayer),
    });
  }
}

WarChestBoardUI.propTypes = {
  anToTokens: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
  isTwoPlayer: PropTypes.bool,
};

WarChestBoardUI.defaultProps = {
  customKey: "hexBoardCanvas",
  isTwoPlayer: true,
};

export default WarChestBoardUI;
