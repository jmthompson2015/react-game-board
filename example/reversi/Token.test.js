import Token from "./Token.js";

QUnit.module("Token");

QUnit.test("findCharByFenChar", assert => {
  assert.equal(Token.findCharByFenChar("P"), "\u26AB");

  assert.equal(Token.findCharByFenChar("p"), "\u26AA");

  assert.equal(Token.findCharByFenChar(), null);
  assert.equal(Token.findCharByFenChar(null), null);
  assert.equal(Token.findCharByFenChar(""), null);
  assert.equal(Token.findCharByFenChar("L"), null);
});

const CoordinateCalculatorTest = {};
export default CoordinateCalculatorTest;
