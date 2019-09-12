import ControlMarker from "./ControlMarker.js";
import UnitCoin from "./UnitCoin.js";
import WarChestBoardUI from "./WarChestBoardUI.js";

const RAVEN = ControlMarker.properties[ControlMarker.RAVEN];
const WOLF = ControlMarker.properties[ControlMarker.WOLF];
const ARCHER = UnitCoin.properties[UnitCoin.ARCHER];
const CAVALRY = UnitCoin.properties[UnitCoin.CAVALRY];
const CROSSBOWMAN = UnitCoin.properties[UnitCoin.CROSSBOWMAN];
const LANCER = UnitCoin.properties[UnitCoin.LANCER];
const PIKEMAN = UnitCoin.properties[UnitCoin.PIKEMAN];
const SWORDSMAN = UnitCoin.properties[UnitCoin.SWORDSMAN];

const anToTokens1 = {
  d7: WOLF,
  e2: RAVEN,
  e3: SWORDSMAN,
  e5: [WOLF, LANCER, LANCER],
  e6: CAVALRY,
  f4: ARCHER,
  g3: [RAVEN, CROSSBOWMAN, CROSSBOWMAN],
  g6: WOLF,
  h1: RAVEN,
  h2: PIKEMAN
};

const element1 = React.createElement(WarChestBoardUI, {
  anToTokens: anToTokens1,
  myKey: "hexPanel1"
});
ReactDOM.render(element1, document.getElementById("board1"));

// /////////////////////////////////////////////////////////////////////////////////////////////////
const anToTokens2 = {
  b5: RAVEN,
  d7: WOLF,
  e2: RAVEN,
  e3: SWORDSMAN,
  e6: CAVALRY,
  f4: ARCHER,
  g6: WOLF,
  h1: RAVEN,
  h2: PIKEMAN,
  j3: WOLF
};

const element2 = React.createElement(WarChestBoardUI, {
  anToTokens: anToTokens2,
  myKey: "hexPanel2",
  isTwoPlayer: false
});
ReactDOM.render(element2, document.getElementById("board2"));
