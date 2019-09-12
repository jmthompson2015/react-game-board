import BoardCalculator from "../../src/BoardCalculator.js";
import GameBoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

const IS_SQUARE = true;
const IS_FLAT = true;

const isEven = value => value % 2 === 0;
const isOdd = value => !isEven(value);
const isUpperCase = value => value && value.toUpperCase() === value;
const bothEven = (a, b) => isEven(a) && isEven(b);
const bothOdd = (a, b) => isOdd(a) && isOdd(b);

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(8, 8);

const drawTokenFunction = (context0, center, size, an, token) => {
  const context = context0;
  context.save();

  let ch = an;
  let isWhite = true;

  if (token) {
    ch = token.char;
    isWhite = isUpperCase(token.fen);
    context.fillStyle = isWhite ? "White" : "Black";
    context.font = "48px serif";
  } else {
    context.fillStyle = "Black";
    context.font = "16px serif";
  }
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(ch, center.x, center.y);
  context.restore();
};

const cellColorFunction = an => {
  const file = coordinateCalculator.anToFile(an);
  const rank = coordinateCalculator.anToRank(an);

  return bothEven(file, rank) || bothOdd(file, rank) ? "Green" : "LightGray";
};

class ChessBoardUI extends React.PureComponent {
  render() {
    const { anToTokens, myKey } = this.props;

    return React.createElement(GameBoardUI, {
      anToTokens,
      boardCalculator,
      coordinateCalculator,
      drawTokenFunction,

      backgroundColor: "White",
      cellColorFunction,
      gridLineWidth: 3,
      myKey
    });
  }
}

ChessBoardUI.propTypes = {
  anToTokens: PropTypes.arrayOf(PropTypes.string).isRequired,

  myKey: PropTypes.string
};

ChessBoardUI.defaultProps = {
  myKey: "squareBoardCanvas"
};

export default ChessBoardUI;
