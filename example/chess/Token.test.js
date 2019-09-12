import Token from "./Token.js";

QUnit.module("Token");

QUnit.test("findByFenChar", assert => {
  assert.equal(Token.findByFenChar("K").key, "whiteKing");
  assert.equal(Token.findByFenChar("Q").key, "whiteQueen");
  assert.equal(Token.findByFenChar("R").key, "whiteRook");
  assert.equal(Token.findByFenChar("B").key, "whiteBishop");
  assert.equal(Token.findByFenChar("N").key, "whiteKnight");
  assert.equal(Token.findByFenChar("P").key, "whitePawn");

  assert.equal(Token.findByFenChar("k").key, "blackKing");
  assert.equal(Token.findByFenChar("q").key, "blackQueen");
  assert.equal(Token.findByFenChar("r").key, "blackRook");
  assert.equal(Token.findByFenChar("b").key, "blackBishop");
  assert.equal(Token.findByFenChar("n").key, "blackKnight");
  assert.equal(Token.findByFenChar("p").key, "blackPawn");
});

QUnit.test("findCharByFenChar", assert => {
  assert.equal(Token.findCharByFenChar("K"), "\u265A");
  assert.equal(Token.findCharByFenChar("Q"), "\u265B");
  assert.equal(Token.findCharByFenChar("R"), "\u265C");
  assert.equal(Token.findCharByFenChar("B"), "\u265D");
  assert.equal(Token.findCharByFenChar("N"), "\u265E");
  assert.equal(Token.findCharByFenChar("P"), "\u265F");

  assert.equal(Token.findCharByFenChar("k"), "\u265A");
  assert.equal(Token.findCharByFenChar("q"), "\u265B");
  assert.equal(Token.findCharByFenChar("r"), "\u265C");
  assert.equal(Token.findCharByFenChar("b"), "\u265D");
  assert.equal(Token.findCharByFenChar("n"), "\u265E");
  assert.equal(Token.findCharByFenChar("p"), "\u265F");
});

const TokenTest = {};
export default TokenTest;
