import CoordinateCalculator from "./CoordinateCalculator.js";

QUnit.module("CoordinateCalculator");

const FILE_COUNT = 4;
const RANK_COUNT = 3;
const LEVEL_COUNT = 2;

QUnit.test("anToFile 2D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToFile("a1"), 1);
  assert.equal(calculator.anToFile("b1"), 2);
  assert.equal(calculator.anToFile("c1"), 3);
  assert.equal(calculator.anToFile("d1"), 4);

  assert.equal(calculator.anToFile("a2"), 1);
  assert.equal(calculator.anToFile("b2"), 2);
  assert.equal(calculator.anToFile("c2"), 3);
  assert.equal(calculator.anToFile("d2"), 4);

  assert.equal(calculator.anToFile("a3"), 1);
  assert.equal(calculator.anToFile("b3"), 2);
  assert.equal(calculator.anToFile("c3"), 3);
  assert.equal(calculator.anToFile("d3"), 4);

  assert.equal(calculator.anToFile("Z1"), null);
  assert.equal(calculator.anToFile("e1"), null);
});

QUnit.test("anToFile 3D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToFile("a1A"), 1);
  assert.equal(calculator.anToFile("b1A"), 2);
  assert.equal(calculator.anToFile("c1A"), 3);
  assert.equal(calculator.anToFile("d1A"), 4);

  assert.equal(calculator.anToFile("a2A"), 1);
  assert.equal(calculator.anToFile("b2A"), 2);
  assert.equal(calculator.anToFile("c2A"), 3);
  assert.equal(calculator.anToFile("d2A"), 4);

  assert.equal(calculator.anToFile("a3A"), 1);
  assert.equal(calculator.anToFile("b3A"), 2);
  assert.equal(calculator.anToFile("c3A"), 3);
  assert.equal(calculator.anToFile("d3A"), 4);

  assert.equal(calculator.anToFile("a1B"), 1);
  assert.equal(calculator.anToFile("b1B"), 2);
  assert.equal(calculator.anToFile("c1B"), 3);
  assert.equal(calculator.anToFile("d1B"), 4);

  assert.equal(calculator.anToFile("a2B"), 1);
  assert.equal(calculator.anToFile("b2B"), 2);
  assert.equal(calculator.anToFile("c2B"), 3);
  assert.equal(calculator.anToFile("d2B"), 4);

  assert.equal(calculator.anToFile("a3B"), 1);
  assert.equal(calculator.anToFile("b3B"), 2);
  assert.equal(calculator.anToFile("c3B"), 3);
  assert.equal(calculator.anToFile("d3B"), 4);

  assert.equal(calculator.anToFile("Z1A"), null);
  assert.equal(calculator.anToFile("e1A"), null);
});

QUnit.test("anToIndex 2D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToIndex("a1"), 0);
  assert.equal(calculator.anToIndex("b1"), 1);
  assert.equal(calculator.anToIndex("c1"), 2);
  assert.equal(calculator.anToIndex("d1"), 3);

  assert.equal(calculator.anToIndex("a2"), 4);
  assert.equal(calculator.anToIndex("b2"), 5);
  assert.equal(calculator.anToIndex("c2"), 6);
  assert.equal(calculator.anToIndex("d2"), 7);

  assert.equal(calculator.anToIndex("a3"), 8);
  assert.equal(calculator.anToIndex("b3"), 9);
  assert.equal(calculator.anToIndex("c3"), 10);
  assert.equal(calculator.anToIndex("d3"), 11);

  assert.equal(calculator.anToIndex("Z1"), null);
  assert.equal(calculator.anToIndex("e1"), null);
});

QUnit.test("anToIndex 3D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToIndex("a1A"), 0);
  assert.equal(calculator.anToIndex("b1A"), 1);
  assert.equal(calculator.anToIndex("c1A"), 2);
  assert.equal(calculator.anToIndex("d1A"), 3);

  assert.equal(calculator.anToIndex("a2A"), 4);
  assert.equal(calculator.anToIndex("b2A"), 5);
  assert.equal(calculator.anToIndex("c2A"), 6);
  assert.equal(calculator.anToIndex("d2A"), 7);

  assert.equal(calculator.anToIndex("a3A"), 8);
  assert.equal(calculator.anToIndex("b3A"), 9);
  assert.equal(calculator.anToIndex("c3A"), 10);
  assert.equal(calculator.anToIndex("d3A"), 11);

  assert.equal(calculator.anToIndex("a1B"), 12);
  assert.equal(calculator.anToIndex("b1B"), 13);
  assert.equal(calculator.anToIndex("c1B"), 14);
  assert.equal(calculator.anToIndex("d1B"), 15);

  assert.equal(calculator.anToIndex("a2B"), 16);
  assert.equal(calculator.anToIndex("b2B"), 17);
  assert.equal(calculator.anToIndex("c2B"), 18);
  assert.equal(calculator.anToIndex("d2B"), 19);

  assert.equal(calculator.anToIndex("a3B"), 20);
  assert.equal(calculator.anToIndex("b3B"), 21);
  assert.equal(calculator.anToIndex("c3B"), 22);
  assert.equal(calculator.anToIndex("d3B"), 23);

  assert.equal(calculator.anToIndex("Z1"), null);
  assert.equal(calculator.anToIndex("e1"), null);
});

QUnit.test("anToLevel", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToLevel("a1A"), 1);
  assert.equal(calculator.anToLevel("b1A"), 1);
  assert.equal(calculator.anToLevel("c1A"), 1);
  assert.equal(calculator.anToLevel("d1A"), 1);

  assert.equal(calculator.anToLevel("a2A"), 1);
  assert.equal(calculator.anToLevel("b2A"), 1);
  assert.equal(calculator.anToLevel("c2A"), 1);
  assert.equal(calculator.anToLevel("d2A"), 1);

  assert.equal(calculator.anToLevel("a3A"), 1);
  assert.equal(calculator.anToLevel("b3A"), 1);
  assert.equal(calculator.anToLevel("c3A"), 1);
  assert.equal(calculator.anToLevel("d3A"), 1);

  assert.equal(calculator.anToLevel("a1B"), 2);
  assert.equal(calculator.anToLevel("b1B"), 2);
  assert.equal(calculator.anToLevel("c1B"), 2);
  assert.equal(calculator.anToLevel("d1B"), 2);

  assert.equal(calculator.anToLevel("a2B"), 2);
  assert.equal(calculator.anToLevel("b2B"), 2);
  assert.equal(calculator.anToLevel("c2B"), 2);
  assert.equal(calculator.anToLevel("d2B"), 2);

  assert.equal(calculator.anToLevel("a3B"), 2);
  assert.equal(calculator.anToLevel("b3B"), 2);
  assert.equal(calculator.anToLevel("c3B"), 2);
  assert.equal(calculator.anToLevel("d3B"), 2);

  assert.equal(calculator.anToLevel("a1z"), null);
  assert.equal(calculator.anToLevel("a3C"), null);
  assert.equal(calculator.anToLevel("a1"), null);
});

QUnit.test("anToRank 2D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToRank("a1"), 1);
  assert.equal(calculator.anToRank("b1"), 1);
  assert.equal(calculator.anToRank("c1"), 1);
  assert.equal(calculator.anToRank("d1"), 1);

  assert.equal(calculator.anToRank("a2"), 2);
  assert.equal(calculator.anToRank("b2"), 2);
  assert.equal(calculator.anToRank("c2"), 2);
  assert.equal(calculator.anToRank("d2"), 2);

  assert.equal(calculator.anToRank("a3"), 3);
  assert.equal(calculator.anToRank("b3"), 3);
  assert.equal(calculator.anToRank("c3"), 3);
  assert.equal(calculator.anToRank("d3"), 3);

  assert.equal(calculator.anToRank("a0"), null);
  assert.equal(calculator.anToRank("a4"), null);
});

QUnit.test("anToRank 3D", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.anToRank("a1A"), 1);
  assert.equal(calculator.anToRank("b1A"), 1);
  assert.equal(calculator.anToRank("c1A"), 1);
  assert.equal(calculator.anToRank("d1A"), 1);

  assert.equal(calculator.anToRank("a2A"), 2);
  assert.equal(calculator.anToRank("b2A"), 2);
  assert.equal(calculator.anToRank("c2A"), 2);
  assert.equal(calculator.anToRank("d2A"), 2);

  assert.equal(calculator.anToRank("a3A"), 3);
  assert.equal(calculator.anToRank("b3A"), 3);
  assert.equal(calculator.anToRank("c3A"), 3);
  assert.equal(calculator.anToRank("d3A"), 3);

  assert.equal(calculator.anToRank("a1B"), 1);
  assert.equal(calculator.anToRank("b1B"), 1);
  assert.equal(calculator.anToRank("c1B"), 1);
  assert.equal(calculator.anToRank("d1B"), 1);

  assert.equal(calculator.anToRank("a2B"), 2);
  assert.equal(calculator.anToRank("b2B"), 2);
  assert.equal(calculator.anToRank("c2B"), 2);
  assert.equal(calculator.anToRank("d2B"), 2);

  assert.equal(calculator.anToRank("a3B"), 3);
  assert.equal(calculator.anToRank("b3B"), 3);
  assert.equal(calculator.anToRank("c3B"), 3);
  assert.equal(calculator.anToRank("d3B"), 3);

  assert.equal(calculator.anToRank("a0A"), null);
  assert.equal(calculator.anToRank("a4A"), null);
});

QUnit.test("fileCount", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.fileCount, FILE_COUNT);
});

QUnit.test("fileRankToAN", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.fileRankToAN(1, 1), "a1");
  assert.equal(calculator.fileRankToAN(2, 1), "b1");
  assert.equal(calculator.fileRankToAN(3, 1), "c1");
  assert.equal(calculator.fileRankToAN(4, 1), "d1");

  assert.equal(calculator.fileRankToAN(1, 2), "a2");
  assert.equal(calculator.fileRankToAN(2, 2), "b2");
  assert.equal(calculator.fileRankToAN(3, 2), "c2");
  assert.equal(calculator.fileRankToAN(4, 2), "d2");

  assert.equal(calculator.fileRankToAN(1, 3), "a3");
  assert.equal(calculator.fileRankToAN(2, 3), "b3");
  assert.equal(calculator.fileRankToAN(3, 3), "c3");
  assert.equal(calculator.fileRankToAN(4, 3), "d3");

  assert.equal(calculator.fileRankToAN(0, 1), null);
  assert.equal(calculator.fileRankToAN(1, 0), null);
  assert.equal(calculator.fileRankToAN(5, 1), null);
  assert.equal(calculator.fileRankToAN(1, 4), null);
});

QUnit.test("fileRankLevelToAN", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.fileRankLevelToAN(1, 1, 1), "a1A");
  assert.equal(calculator.fileRankLevelToAN(2, 1, 1), "b1A");
  assert.equal(calculator.fileRankLevelToAN(3, 1, 1), "c1A");
  assert.equal(calculator.fileRankLevelToAN(4, 1, 1), "d1A");

  assert.equal(calculator.fileRankLevelToAN(1, 2, 1), "a2A");
  assert.equal(calculator.fileRankLevelToAN(2, 2, 1), "b2A");
  assert.equal(calculator.fileRankLevelToAN(3, 2, 1), "c2A");
  assert.equal(calculator.fileRankLevelToAN(4, 2, 1), "d2A");

  assert.equal(calculator.fileRankLevelToAN(1, 3, 1), "a3A");
  assert.equal(calculator.fileRankLevelToAN(2, 3, 1), "b3A");
  assert.equal(calculator.fileRankLevelToAN(3, 3, 1), "c3A");
  assert.equal(calculator.fileRankLevelToAN(4, 3, 1), "d3A");

  assert.equal(calculator.fileRankLevelToAN(0, 1, 1), null);
  assert.equal(calculator.fileRankLevelToAN(1, 0, 1), null);
  assert.equal(calculator.fileRankLevelToAN(5, 1, 1), null);
  assert.equal(calculator.fileRankLevelToAN(1, 4, 1), null);
  assert.equal(calculator.fileRankLevelToAN(1, 1, 0), null);
  assert.equal(calculator.fileRankLevelToAN(1, 3, 3), null);
});

QUnit.test("rankCount", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT);

  // Run / Verify.
  assert.equal(calculator.rankCount, RANK_COUNT);
});

QUnit.test("levelCount", assert => {
  // Setup.
  const calculator = new CoordinateCalculator(FILE_COUNT, RANK_COUNT, LEVEL_COUNT);

  // Run / Verify.
  assert.equal(calculator.levelCount, LEVEL_COUNT);
});

const CoordinateCalculatorTest = {};
export default CoordinateCalculatorTest;
