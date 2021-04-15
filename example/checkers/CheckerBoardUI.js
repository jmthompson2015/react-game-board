import BoardCalculator from "../../src/BoardCalculator.js";
import GameBoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

import Token from "./Token.js";

const images = R.map(R.prop("image"), Token.values());

const IS_SQUARE = true;
const IS_FLAT = true;

const isEven = (value) => value % 2 === 0;
const isOdd = (value) => !isEven(value);
const bothEven = (a, b) => isEven(a) && isEven(b);
const bothOdd = (a, b) => isOdd(a) && isOdd(b);

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(8, 8);

const drawTokenFunction = (context, center, size, an, token, imageMap) => {
  if (token) {
    const corners = boardCalculator.computeCorners(center, size);
    const img = imageMap[token.image];

    if (img) {
      BoardCalculator.drawCircularImage(context, corners, img);
    }
  }
};

const cellColorFunction = (an) => {
  const file = coordinateCalculator.anToFile(an);
  const rank = coordinateCalculator.anToRank(an);

  return bothEven(file, rank) || bothOdd(file, rank) ? "hsl(0,0%,20%)" : "Red";
};

class CheckerBoardUI extends React.PureComponent {
  render() {
    const { anToTokens, customKey } = this.props;

    return React.createElement(GameBoardUI, {
      anToTokens,
      boardCalculator,
      coordinateCalculator,
      drawTokenFunction,

      backgroundColor: "White",
      cellColorFunction,
      customKey,
      gridColor: "Yellow",
      gridLineWidth: 3,
      images,
    });
  }
}

CheckerBoardUI.propTypes = {
  anToTokens: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
};

CheckerBoardUI.defaultProps = {
  customKey: "squareBoardCanvas",
};

export default CheckerBoardUI;
