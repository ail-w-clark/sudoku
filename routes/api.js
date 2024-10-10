const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      if (typeof puzzle !== 'string' || puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult); 
      }

      const row = coordinate.charAt(0).toUpperCase();
      const col = parseInt(coordinate.slice(1), 10);

      if (isNaN(col) || col < 1 || col > 9 || !'ABCDEFGHI'.includes(row)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (isNaN(value) || value < 1 || value > 9) {
        return res.json({ error: 'Invalid value' });
      }

      const result = solver.checkPlacement(puzzle, row, col, value);
      if (result.valid) {
        return res.json({ valid: true });
      }

      return res.json({ valid: false, conflict: result.conflict });
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const validationResult = solver.validate(puzzle);
      if (validationResult.error) {
        return res.json(validationResult); 
      }

      const solution = solver.solve(puzzle);

      if (solution.error) {
        return res.json({ error: solution.error }); 
      }

      return res.json({ solution: solution });
    });
};
