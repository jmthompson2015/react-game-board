import CheckerBoardUI from "./CheckerBoardUI.js";
import Token from "./Token.js";

const BLACK_KING = Token.properties[Token.BLACK_KING];
const BLACK_PAWN = Token.properties[Token.BLACK_PAWN];
const WHITE_KING = Token.properties[Token.WHITE_KING];
const WHITE_PAWN = Token.properties[Token.WHITE_PAWN];

const anToTokens1 = {
  a1: WHITE_PAWN,
  c1: WHITE_PAWN,
  e1: WHITE_PAWN,
  g1: WHITE_PAWN,

  b2: WHITE_PAWN,
  d2: WHITE_PAWN,
  f2: WHITE_PAWN,
  h2: WHITE_PAWN,

  a3: WHITE_KING,
  c3: WHITE_PAWN,
  e3: WHITE_PAWN,
  g3: WHITE_PAWN,

  b6: BLACK_KING,
  d6: BLACK_PAWN,
  f6: BLACK_PAWN,
  h6: BLACK_PAWN,

  a7: BLACK_PAWN,
  c7: BLACK_PAWN,
  e7: BLACK_PAWN,
  g7: BLACK_PAWN,

  b8: BLACK_PAWN,
  d8: BLACK_PAWN,
  f8: BLACK_PAWN,
  h8: BLACK_PAWN
};

const element1 = React.createElement(CheckerBoardUI, { anToTokens: anToTokens1 });
ReactDOM.render(element1, document.getElementById("board"));
