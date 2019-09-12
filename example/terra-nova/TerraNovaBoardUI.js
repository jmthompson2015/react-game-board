import BoardCalculator from "../../src/BoardCalculator.js";
import GameBoardUI from "../../src/GameBoardUI.js";
import CoordinateCalculator from "../../src/CoordinateCalculator.js";

const IS_SQUARE = false;
const IS_FLAT = true;
const DENSE_FOREST = [
  "l4",
  "l5",
  "l8",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "n3",
  "n4",
  "n5",
  "n6",
  "n7",
  "o1",
  "o2",
  "o3",
  "o7",
  "o8",
  "o9",
  "p8",
  "p9"
];
const FOOTHILLS = [
  "a12",
  "a13",
  "a14",
  "b11",
  "b12",
  "b13",
  "b14",
  "b15",
  "c9",
  "c10",
  "c11",
  "c12",
  "c13",
  "c14",
  "d8",
  "d9",
  "d10",
  "d13",
  "d14",
  "e9",
  "e14"
];
const LAKE = [
  "d11",
  "d12",
  "e10",
  "e11",
  "e12",
  "f5",
  "f8",
  "f9",
  "f10",
  "g5",
  "g6",
  "g7",
  "g8",
  "g9",
  "h5",
  "h6",
  "h7",
  "i5"
];
const LIGHT_FOREST = [
  "b8",
  "b9",
  "c5",
  "c6",
  "c7",
  "c8",
  "d5",
  "d6",
  "d7",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "f4",
  "f6",
  "f7",
  "g4",
  "h4",
  "i3",
  "i4"
];
const MOUNTAIN = [
  "f11",
  "g10",
  "g11",
  "g12",
  "h8",
  "h9",
  "h10",
  "h11",
  "i6",
  "i7",
  "i8",
  "i9",
  "i10",
  "j7",
  "j8",
  "j9",
  "j10",
  "k7",
  "k8",
  "k9",
  "k10",
  "l7",
  "l9",
  "l10"
];
const PASTURE = [
  "h3",
  "i2",
  "j2",
  "j3",
  "j4",
  "j5",
  "j6",
  "k1",
  "k2",
  "k3",
  "k4",
  "k5",
  "k6",
  "l1",
  "l2",
  "l3",
  "l6",
  "m1",
  "m2",
  "n1",
  "n2"
];
const PLAINS = [
  "h13",
  "i11",
  "i13",
  "j11",
  "j12",
  "j13",
  "k11",
  "k12",
  "k13",
  "l11",
  "l12",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
  "n8",
  "n9",
  "n10",
  "n11",
  "o10"
];
const SWAMP = [
  "b16",
  "b17",
  "c15",
  "c16",
  "c17",
  "d15",
  "d16",
  "e13",
  "e15",
  "e16",
  "f12",
  "f13",
  "f14",
  "f15",
  "g13",
  "g14",
  "h12",
  "h14",
  "i12",
  "i14",
  "j14"
];

const USED = DENSE_FOREST.concat(
  FOOTHILLS,
  LAKE,
  LIGHT_FOREST,
  MOUNTAIN,
  PASTURE,
  PLAINS,
  SWAMP
);

const boardCalculator = new BoardCalculator(IS_SQUARE, IS_FLAT);
const coordinateCalculator = new CoordinateCalculator(16, 17);

const drawTokenFunction = (context0, center, size, an, token) => {
  const context = context0;
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "Green";
  context.font = "12px serif";
  context.fillText(token || an, center.x, center.y);
  context.restore();
};

const cellColorFunction = an => {
  let answer;

  if (DENSE_FOREST.includes(an)) {
    answer = "DarkGreen";
  } else if (FOOTHILLS.includes(an)) {
    answer = "SaddleBrown";
  } else if (LAKE.includes(an)) {
    answer = "SkyBlue";
  } else if (LIGHT_FOREST.includes(an)) {
    answer = "OliveDrab";
  } else if (MOUNTAIN.includes(an)) {
    answer = "DarkKhaki";
  } else if (PASTURE.includes(an)) {
    answer = "LawnGreen";
  } else if (PLAINS.includes(an)) {
    answer = "Gold";
  } else if (SWAMP.includes(an)) {
    answer = "YellowGreen";
  }

  return answer;
};

const isCellUsedFunction = an => USED.includes(an);

class TerraNovaBoardUI extends React.PureComponent {
  render() {
    const { anToTokens } = this.props;

    return React.createElement(GameBoardUI, {
      anToTokens,
      boardCalculator,
      coordinateCalculator,
      drawTokenFunction,

      cellColorFunction,
      gridColor: "White",
      isCellUsedFunction
    });
  }
}

TerraNovaBoardUI.propTypes = {
  anToTokens: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default TerraNovaBoardUI;
