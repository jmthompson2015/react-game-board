const Token = {
  BLACK_KING: "blackKing",
  BLACK_QUEEN: "blackQueen",
  BLACK_ROOK: "blackRook",
  BLACK_BISHOP: "blackBishop",
  BLACK_KNIGHT: "blackKnight",
  BLACK_PAWN: "blackPawn",

  WHITE_KING: "whiteKing",
  WHITE_QUEEN: "whiteQueen",
  WHITE_ROOK: "whiteRook",
  WHITE_BISHOP: "whiteBishop",
  WHITE_KNIGHT: "whiteKnight",
  WHITE_PAWN: "whitePawn",

  properties: {
    blackKing: {
      char: "\u265A",
      fen: "k",
      key: "blackKing"
    },
    blackQueen: {
      char: "\u265B",
      fen: "q",
      key: "blackQueen"
    },
    blackRook: {
      char: "\u265C",
      fen: "r",
      key: "blackRook"
    },
    blackBishop: {
      char: "\u265D",
      fen: "b",
      key: "blackBishop"
    },
    blackKnight: {
      char: "\u265E",
      fen: "n",
      key: "blackKnight"
    },
    blackPawn: {
      char: "\u265F",
      fen: "p",
      key: "blackPawn"
    },
    whiteKing: {
      char: "\u265A",
      fen: "K",
      key: "whiteKing"
    },
    whiteQueen: {
      char: "\u265B",
      fen: "Q",
      key: "whiteQueen"
    },
    whiteRook: {
      char: "\u265C",
      fen: "R",
      key: "whiteRook"
    },
    whiteBishop: {
      char: "\u265D",
      fen: "B",
      key: "whiteBishop"
    },
    whiteKnight: {
      char: "\u265E",
      fen: "N",
      key: "whiteKnight"
    },
    whitePawn: {
      char: "\u265F",
      fen: "P",
      key: "whitePawn"
    }
  }
};

Token.keys = () => Object.keys(Token.properties);

Token.values = () => Object.values(Token.properties);

Token.findByFenChar = fenChar => {
  const tokens = R.filter(t => t.fen === fenChar, Token.values());

  if (tokens.length > 0) {
    return tokens[0];
  }

  return null;
};

Token.findCharByFenChar = fenChar => {
  const tokens = R.filter(t => t.fen === fenChar, Token.values());

  if (tokens.length > 0) {
    return tokens[0].char;
  }

  return null;
};

Object.freeze(Token);

export default Token;
