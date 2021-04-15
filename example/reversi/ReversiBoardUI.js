import BoardCalculator from "../../src/BoardCalculator.js";
import GameBoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

const IS_SQUARE = true;
const IS_FLAT = true;

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(8, 8);

const drawTokenFunction = (context0, center, size, an, token) => {
  const context = context0;
  context.save();

  let ch = an;
  context.textAlign = "center";
  context.textBaseline = "middle";

  if (token) {
    ch = token.char;
    context.font = "48px serif";
    const offset = 5;
    context.strokeText(ch, center.x, center.y + offset);
  } else {
    context.fillStyle = "Black";
    context.font = "16px serif";
    context.fillText(ch, center.x, center.y);
  }
  context.restore();
};

const cellColorFunction = () => "Green";

class ReversiBoardUI extends React.PureComponent {
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
      gridLineWidth: 3,
    });
  }
}

ReversiBoardUI.propTypes = {
  anToTokens: PropTypes.shape().isRequired,

  customKey: PropTypes.string,
};

ReversiBoardUI.defaultProps = {
  customKey: "squareBoardCanvas",
};

export default ReversiBoardUI;
