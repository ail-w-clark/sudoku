const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {

  setup(() => {
    solver = new SudokuSolver();
  });

  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(puzzle);
    assert.deepEqual(result, true, 'Valid puzzle should pass validation');
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37z';
    const result = solver.validate(puzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' }, 'Puzzle with invalid characters should fail validation');
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '1.3....5..9....6.5.....8..4.3....9...5....4....8..6...3.....7..2..6....3..4';
    const result = solver.validate(puzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' }, 'Puzzle with incorrect length should fail validation');
  });

  test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'A', 2, '3');
    assert.deepEqual(result, { valid: true, conflict: [] }, 'Valid row placement should pass');
  });

  test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'A', 2, '4'); 
    assert.deepEqual(result, { valid: false, conflict: ['row'] }, 'Invalid row placement should fail');
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'A', 2, '3');
    assert.deepEqual(result, { valid: true, conflict: [] }, 'Valid column placement should pass');
  });

  test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'D', 1, '4'); 
    assert.deepEqual(result, { valid: false, conflict: ['column'] }, 'Invalid column placement should fail');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'A', 2, '3');
    assert.deepEqual(result, { valid: true, conflict: [] }, 'Valid region placement should pass');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkPlacement(puzzle, 'B', 2, '5'); // '5' is already in the same 3x3 region
    assert.deepEqual(result, { valid: false, conflict: ['region'] }, 'Invalid region placement should fail');
  });

  test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzle);
    assert.isString(result, 'Solver should return a string (solved puzzle)');
    assert.equal(result.length, 81, 'Solved puzzle should be 81 characters long');
  });

  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '!.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' }, 'Solver should return error for invalid characters');
  });

  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const solution = solver.solve(puzzle);
    const expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.equal(solution, expectedSolution, 'Solver should return the expected solution');
  });
});
