const Token = {
  BLACK_KING: "blackKing",
  BLACK_PAWN: "blackPawn",
  WHITE_KING: "whiteKing",
  WHITE_PAWN: "whitePawn",

  properties: {
    blackKing: {
      fen: "K",
      image: "king-black.png",
      key: "blackKing"
    },
    blackPawn: {
      fen: "P",
      image: "pawn-black.png",
      key: "blackPawn"
    },
    whiteKing: {
      fen: "k",
      image: "king-white.png",
      key: "whiteKing"
    },
    whitePawn: {
      fen: "p",
      image: "pawn-white.png",
      key: "whitePawn"
    }
  }
};

Token.keys = () => Object.keys(Token.properties);

Token.values = () => Object.values(Token.properties);

Token.findImageByFenChar = fenChar => {
  const tokens = R.filter(t => t.fen === fenChar, Token.values());

  if (tokens.length > 0) {
    return tokens[0].image;
  }

  return null;
};

Object.freeze(Token);

export default Token;
