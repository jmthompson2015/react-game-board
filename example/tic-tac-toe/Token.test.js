import Token from "./Token.js";

QUnit.module("Token");

QUnit.test("findByFenChar", assert => {
  assert.equal(Token.findByFenChar("X").key, "x");
  assert.equal(Token.findByFenChar("O").key, "o");
});

const TokenTest = {};
export default TokenTest;
