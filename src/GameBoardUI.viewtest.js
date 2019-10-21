/* eslint no-console: ["error", { allow: ["log"] }] */

import BoardCalculator from "./BoardCalculator.js";
import GameBoardUI from "./GameBoardUI.js";
import CoordinateCalculator from "./CoordinateCalculator.js";

const drawTokenFunction = (context0, center, an, token) => {
  const context = context0;
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "24px serif";
  context.fillText(token || an, center.x, center.y);
  context.restore();
};

const myOnClick = an => {
  console.log(`myOnClick() an = ${an}`);
};

// /////////////////////////////////////////////////////////////////////////////////////////////////
const anToTokens1 = {
  a1: "X",
  d1: "Y",
  b2: "Z",
  c3: "X"
};
const size = 100;
const boardCalculator1 = new BoardCalculator(true, true);
const coordinateCalculator1 = new CoordinateCalculator(3, 4);

const element1 = React.createElement(GameBoardUI, {
  anToTokens: anToTokens1,
  boardCalculator: boardCalculator1,
  coordinateCalculator: coordinateCalculator1,
  drawTokenFunction,

  customKey: "hexPanel1",
  onClick: myOnClick,
  height: 4 * size,
  width: 3 * size
});
ReactDOM.render(element1, document.getElementById("panel1"));

// /////////////////////////////////////////////////////////////////////////////////////////////////
const anToTokens2 = {
  a1: "X",
  d1: "Y",
  b2: "Z",
  c3: "X"
};
const boardCalculator2 = new BoardCalculator(true, false);
const coordinateCalculator2 = new CoordinateCalculator(4, 3);

const element2 = React.createElement(GameBoardUI, {
  anToTokens: anToTokens2,
  boardCalculator: boardCalculator2,
  coordinateCalculator: coordinateCalculator2,
  drawTokenFunction,

  backgroundColor: "OliveDrab",
  customKey: "hexPanel2",
  gridColor: "Maroon",
  gridLineWidth: 5,
  onClick: myOnClick,
  height: 3 * size,
  width: 4 * size
});
ReactDOM.render(element2, document.getElementById("panel2"));

// /////////////////////////////////////////////////////////////////////////////////////////////////
const anToTokens3 = {
  a1: "X",
  d1: "Y",
  b2: "Z",
  c3: "X"
};
const boardCalculator3 = new BoardCalculator(false, true);
const coordinateCalculator3 = new CoordinateCalculator(3, 4);

const element3 = React.createElement(GameBoardUI, {
  anToTokens: anToTokens3,
  boardCalculator: boardCalculator3,
  coordinateCalculator: coordinateCalculator3,
  drawTokenFunction,

  customKey: "hexPanel3",
  onClick: myOnClick,
  height: 4 * size,
  width: 3 * size
});
ReactDOM.render(element3, document.getElementById("panel3"));

// /////////////////////////////////////////////////////////////////////////////////////////////////
const anToTokens4 = {
  a1: "X",
  d1: "Y",
  b2: "Z",
  c3: "X"
};
const boardCalculator4 = new BoardCalculator(false, false);
const coordinateCalculator4 = new CoordinateCalculator(4, 3);

const element4 = React.createElement(GameBoardUI, {
  anToTokens: anToTokens4,
  boardCalculator: boardCalculator4,
  coordinateCalculator: coordinateCalculator4,
  drawTokenFunction,

  backgroundColor: "OliveDrab",
  customKey: "hexPanel4",
  gridColor: "Maroon",
  gridLineWidth: 5,
  onClick: myOnClick,
  height: 3 * size,
  width: 4 * size
});
ReactDOM.render(element4, document.getElementById("panel4"));
