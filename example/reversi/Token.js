const Token = {
  BLACK_PAWN: "blackPawn",
  WHITE_PAWN: "whitePawn",

  properties: {
    blackPawn: {
      char: "\u26AB",
      fen: "P",
      key: "blackPawn"
    },
    whitePawn: {
      char: "\u26AA",
      fen: "p",
      key: "whitePawn"
    }
  }
};

Token.keys = () => Object.keys(Token.properties);

Token.values = () => Object.values(Token.properties);

Token.findCharByFenChar = fenChar => {
  const tokens = R.filter(
    t => t.fen === fenChar,
    Object.values(Token.properties)
  );

  if (tokens.length > 0) {
    return tokens[0].char;
  }

  return null;
};

Object.freeze(Token);

export default Token;
