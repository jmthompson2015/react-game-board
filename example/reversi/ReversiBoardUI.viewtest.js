import ReversiBoardUI from "./ReversiBoardUI.js";
import Token from "./Token.js";

const BLACK_PAWN = Token.properties[Token.BLACK_PAWN];
const WHITE_PAWN = Token.properties[Token.WHITE_PAWN];

const anToTokens1 = {
  d4: WHITE_PAWN,
  e4: BLACK_PAWN,
  d5: BLACK_PAWN,
  e5: WHITE_PAWN
};

const element1 = React.createElement(ReversiBoardUI, {
  anToTokens: anToTokens1
});
ReactDOM.render(element1, document.getElementById("board"));
