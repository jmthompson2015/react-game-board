const { terser } = require("rollup-plugin-terser");

export default {
  input: "src/GameBoardUI.js",
  output: {
    file: "./dist/react-game-board.min.js",
    format: "umd",
    name: "ReactGameBoard"
  },
  plugins: [terser()]
};
