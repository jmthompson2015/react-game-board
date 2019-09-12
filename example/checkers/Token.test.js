import Token from "./Token.js";

QUnit.module("Token");

QUnit.test("findImageByFenChar", assert => {
  assert.equal(Token.findImageByFenChar("K"), "king-black.png");
  assert.equal(Token.findImageByFenChar("P"), "pawn-black.png");

  assert.equal(Token.findImageByFenChar("k"), "king-white.png");
  assert.equal(Token.findImageByFenChar("p"), "pawn-white.png");

  assert.equal(Token.findImageByFenChar(), null);
  assert.equal(Token.findImageByFenChar(null), null);
  assert.equal(Token.findImageByFenChar(""), null);
  assert.equal(Token.findImageByFenChar("L"), null);
});

const TokenTest = {};
export default TokenTest;
