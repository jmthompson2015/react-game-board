import Token from "./Token.js";
import TTTBoardUI from "./TTTBoardUI.js";

const X = Token.properties[Token.X];
const O = Token.properties[Token.O];

const anToTokens1 = {
  a1: X,
  // b1: null,
  // c1: null,
  // a2: null,
  b2: O,
  // c2: null,
  a3: X
  // b3: null,
  // c3: null
};

const element = React.createElement(TTTBoardUI, { anToTokens: anToTokens1 });
ReactDOM.render(element, document.getElementById("board"));
