import BoardCalculator from "../../src/BoardCalculator.js";
import GameBoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

import Token from "./Token.js";

const IS_SQUARE = true;
const IS_FLAT = true;

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(3, 3);

const drawO = (context0, center, size, color) => {
  const radius = 0.25 * size;
  const startAngle = 0;
  const endAngle = 2.0 * Math.PI;

  const context = context0;
  context.save();
  context.lineWidth = 10;
  context.strokeStyle = color;

  context.beginPath();
  context.arc(center.x, center.y, radius, startAngle, endAngle);
  context.stroke();
  context.restore();
};

const drawX = (context0, center, size, color) => {
  const x0 = center.x - 0.25 * size;
  const y0 = center.y - 0.25 * size;
  const x1 = center.x + 0.25 * size;
  const y1 = center.y + 0.25 * size;

  const context = context0;
  context.save();
  context.lineWidth = 10;
  context.strokeStyle = color;

  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.moveTo(x1, y0);
  context.lineTo(x0, y1);
  context.stroke();
  context.restore();
};

const drawTokenFunction = (context0, center, size, an, token) => {
  const context = context0;
  context.save();

  if (token) {
    switch (token.key) {
      case Token.X:
        drawX(context, center, size, "Red");
        break;
      case Token.O:
        drawO(context, center, size, "Blue");
        break;
      default:
      // Nothing to do.
    }
  } else {
    context.fillStyle = "Black";
    context.font = "16px serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(an, center.x, center.y);
  }

  context.restore();
};

class TTTBoardUI extends React.PureComponent {
  render() {
    const { anToTokens, myKey, onClick } = this.props;

    return React.createElement(GameBoardUI, {
      anToTokens,
      boardCalculator,
      coordinateCalculator,
      drawTokenFunction,

      backgroundColor: "White",
      gridLineWidth: 3,
      height: 300,
      myKey,
      onClick,
      width: 300
    });
  }
}

TTTBoardUI.propTypes = {
  anToTokens: PropTypes.arrayOf(PropTypes.string).isRequired,

  myKey: PropTypes.string,
  onClick: PropTypes.func
};

TTTBoardUI.defaultProps = {
  myKey: "squareBoardCanvas",
  onClick: undefined
};

export default TTTBoardUI;
