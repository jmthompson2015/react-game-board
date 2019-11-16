import BoardCalculator from "./BoardCalculator.js";

QUnit.module("BoardCalculator");

const round4 = value => Math.round(value * 10000.0) / 10000.0;

QUnit.test("BoardCalculator() hex pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(false, false);

  // Run / Verify.
  assert.equal(calculator.isSquare, false);
  assert.equal(calculator.isFlat, false);
  assert.equal(calculator.cornerCount, 6);
});

QUnit.test("BoardCalculator() square flat", assert => {
  // Setup.
  const calculator = new BoardCalculator();

  // Run / Verify.
  assert.equal(calculator.isSquare, true);
  assert.equal(calculator.isFlat, true);
  assert.equal(calculator.cornerCount, 4);
});

QUnit.test("cellCorner() hex flat 0", assert => {
  // Setup.
  const calculator = new BoardCalculator(false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.cellCorner(center, size, 0);

  // Verify.
  assert.ok(result);
  assert.equal(result.x, 15);
  assert.equal(result.y, 5);
});

QUnit.test("cellCorner() hex pointy 0", assert => {
  // Setup.
  const calculator = new BoardCalculator(false, false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.cellCorner(center, size, 0);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 13.6603);
  assert.equal(round4(result.y), 0);
});

QUnit.test("cellCorner() square flat 0", assert => {
  // Setup.
  const calculator = new BoardCalculator();
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.cellCorner(center, size, 0);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 8.5355);
  assert.equal(round4(result.y), 1.4645);
});

QUnit.test("cellCorner() square pointy 0", assert => {
  // Setup.
  const calculator = new BoardCalculator(true, false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.cellCorner(center, size, 0);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 10);
  assert.equal(round4(result.y), 5);
});

QUnit.test("cellDimensions() hex flat", assert => {
  // Setup.
  const calculator = new BoardCalculator(false);
  const size = 10;

  // Run.
  const result = calculator.cellDimensions(size);

  // Verify.
  assert.ok(result);
  assert.equal(result.w, 20);
  assert.equal(round4(result.h), 17.3205);
});

QUnit.test("cellDimensions() hex pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(false, false);
  const size = 10;

  // Run.
  const result = calculator.cellDimensions(size);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.w), 17.3205);
  assert.equal(result.h, 20);
});

QUnit.test("cellDimensions() square flat", assert => {
  // Setup.
  const calculator = new BoardCalculator();
  const size = 10;

  // Run.
  const result = calculator.cellDimensions(size);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.w), 14.1421);
  assert.equal(round4(result.h), 14.1421);
});

QUnit.test("cellDimensions() square pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(true, false);
  const size = 10;

  // Run.
  const result = calculator.cellDimensions(size);

  // Verify.
  assert.ok(result);
  assert.equal(result.w, 20);
  assert.equal(result.h, 20);
});

QUnit.test("cellToPixel() hex flat", assert => {
  // Setup.
  const calculator = new BoardCalculator(false);
  const f = 1;
  const r = 2;
  const size = 10;
  const offset = { x: 5, y: 6 };

  // Run.
  const result = calculator.cellToPixel(f, r, size, offset);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 20);
  assert.equal(round4(result.y), 49.3013);
});

QUnit.test("cellToPixel() hex pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(false, false);
  const f = 1;
  const r = 2;
  const size = 10;
  const offset = { x: 5, y: 6 };

  // Run.
  const result = calculator.cellToPixel(f, r, size, offset);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 39.641);
  assert.equal(round4(result.y), 36);
});

QUnit.test("cellToPixel() square flat", assert => {
  // Setup.
  const calculator = new BoardCalculator();
  const f = 1;
  const r = 2;
  const size = 10;
  const offset = { x: 5, y: 6 };

  // Run.
  const result = calculator.cellToPixel(f, r, size, offset);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 12.0711);
  assert.equal(round4(result.y), 20.1421);
});

QUnit.test("cellToPixel() square pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(true, false);
  const f = 1;
  const r = 2;
  const size = 10;
  const offset = { x: 5, y: 6 };

  // Run.
  const result = calculator.cellToPixel(f, r, size, offset);

  // Verify.
  assert.ok(result);
  assert.equal(round4(result.x), 0);
  assert.equal(round4(result.y), 21);
});

QUnit.test("computeCorners() hex flat", assert => {
  // Setup.
  const calculator = new BoardCalculator(false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.computeCorners(center, size);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 6);
  const corner0 = result[0];
  assert.ok(corner0);
  assert.equal(round4(corner0.x), 15);
  assert.equal(round4(corner0.y), 5);
  const cornerLast = result[5];
  assert.ok(corner0);
  assert.equal(round4(cornerLast.x), 10);
  assert.equal(round4(cornerLast.y), -3.6603);
});

QUnit.test("computeCorners() hex pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(false, false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.computeCorners(center, size);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 6);
  const corner0 = result[0];
  assert.ok(corner0);
  assert.equal(round4(corner0.x), 13.6603);
  assert.equal(round4(corner0.y), 0);
  const cornerLast = result[5];
  assert.ok(corner0);
  assert.equal(round4(cornerLast.x), 5);
  assert.equal(round4(cornerLast.y), -5);
});

QUnit.test("computeCorners() square flat", assert => {
  // Setup.
  const calculator = new BoardCalculator();
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.computeCorners(center, size);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 4);
  const corner0 = result[0];
  assert.ok(corner0);
  assert.equal(round4(corner0.x), 8.5355);
  assert.equal(round4(corner0.y), 1.4645);
  const cornerLast = result[3];
  assert.ok(corner0);
  assert.equal(round4(cornerLast.x), 1.4645);
  assert.equal(round4(cornerLast.y), 1.4645);
});

QUnit.test("computeCorners() square pointy", assert => {
  // Setup.
  const calculator = new BoardCalculator(true, false);
  const center = { x: 5, y: 5 };
  const size = 10;

  // Run.
  const result = calculator.computeCorners(center, size);

  // Verify.
  assert.ok(result);
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 4);
  const corner0 = result[0];
  assert.ok(corner0);
  assert.equal(round4(corner0.x), 10);
  assert.equal(round4(corner0.y), 5);
  const cornerLast = result[3];
  assert.ok(corner0);
  assert.equal(round4(cornerLast.x), 5);
  assert.equal(round4(cornerLast.y), 0);
});

QUnit.test("BoardCalculator.isPointInPolygon()", assert => {
  // Setup.
  const point1 = { x: 5, y: 5 };
  const point2 = { x: 15, y: 5 };
  const point3 = { x: 5, y: 15 };
  const corners1 = [{ x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }, { x: 10, y: 0 }];
  const corners2 = [{ x: 10, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 10 }, { x: 20, y: 0 }];
  const corners3 = [{ x: 0, y: 10 }, { x: 0, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 10 }];

  // Run / Verify.
  assert.equal(BoardCalculator.isPointInPolygon(point1.x, point1.y, corners1), true);
  assert.equal(BoardCalculator.isPointInPolygon(point2.x, point2.y, corners1), false);
  assert.equal(BoardCalculator.isPointInPolygon(point3.x, point3.y, corners1), false);

  assert.equal(BoardCalculator.isPointInPolygon(point1.x, point1.y, corners2), false);
  assert.equal(BoardCalculator.isPointInPolygon(point2.x, point2.y, corners2), true);
  assert.equal(BoardCalculator.isPointInPolygon(point3.x, point3.y, corners2), false);

  assert.equal(BoardCalculator.isPointInPolygon(point1.x, point1.y, corners3), false);
  assert.equal(BoardCalculator.isPointInPolygon(point2.x, point2.y, corners3), false);
  assert.equal(BoardCalculator.isPointInPolygon(point3.x, point3.y, corners3), true);
});

const BoardCalculatorTest = {};
export default BoardCalculatorTest;
