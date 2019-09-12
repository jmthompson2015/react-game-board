import ChessBoardUI from "./ChessBoardUI.js";
import Token from "./Token.js";

const BLACK_KING = Token.properties[Token.BLACK_KING];
const BLACK_QUEEN = Token.properties[Token.BLACK_QUEEN];
const BLACK_ROOK = Token.properties[Token.BLACK_ROOK];
const BLACK_BISHOP = Token.properties[Token.BLACK_BISHOP];
const BLACK_KNIGHT = Token.properties[Token.BLACK_KNIGHT];
const BLACK_PAWN = Token.properties[Token.BLACK_PAWN];
const WHITE_KING = Token.properties[Token.WHITE_KING];
const WHITE_QUEEN = Token.properties[Token.WHITE_QUEEN];
const WHITE_ROOK = Token.properties[Token.WHITE_ROOK];
const WHITE_BISHOP = Token.properties[Token.WHITE_BISHOP];
const WHITE_KNIGHT = Token.properties[Token.WHITE_KNIGHT];
const WHITE_PAWN = Token.properties[Token.WHITE_PAWN];

const anToTokens1 = {
  a1: WHITE_ROOK,
  b1: WHITE_KNIGHT,
  c1: WHITE_BISHOP,
  d1: WHITE_QUEEN,
  e1: WHITE_KING,
  f1: WHITE_BISHOP,
  g1: WHITE_KNIGHT,
  h1: WHITE_ROOK,
  a2: WHITE_PAWN,
  b2: WHITE_PAWN,
  c2: WHITE_PAWN,
  d2: WHITE_PAWN,
  e2: WHITE_PAWN,
  f2: WHITE_PAWN,
  g2: WHITE_PAWN,
  h2: WHITE_PAWN,
  a7: BLACK_PAWN,
  b7: BLACK_PAWN,
  c7: BLACK_PAWN,
  d7: BLACK_PAWN,
  e7: BLACK_PAWN,
  f7: BLACK_PAWN,
  g7: BLACK_PAWN,
  h7: BLACK_PAWN,
  a8: BLACK_ROOK,
  b8: BLACK_KNIGHT,
  c8: BLACK_BISHOP,
  d8: BLACK_QUEEN,
  e8: BLACK_KING,
  f8: BLACK_BISHOP,
  g8: BLACK_KNIGHT,
  h8: BLACK_ROOK
};

const element1 = React.createElement(ChessBoardUI, { anToTokens: anToTokens1 });
ReactDOM.render(element1, document.getElementById("board"));
