const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');  

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'; 
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzleString })
      .end((err, res) => {
        assert.equal(res.status, 200);
        const response = res.body;
        const solution = response.solution;
        assert.isString(solution);
        assert.lengthOf(solution, 81);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field missing' });
        done();
      });
  });

  test('Solve a puzzle with invalid characters', (done) => {
    const invalidPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...Z'; 
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidPuzzle })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Solve a puzzle with incorrect length', (done) => {
    const invalidLengthPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...'; 
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: invalidLengthPuzzle })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Solve a puzzle that cannot be solved', (done) => {
    const unsolvablePuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.729993'; 
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: unsolvablePuzzle })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
        done();
      });
  });

  test('Check a puzzle placement with all fields', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A1',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: true
        });
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A1',
        value: '2'  
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row']
        });
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A1',
        value: '9'  
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row', 'region']
        });
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A1',
        value: '3'  
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ['row', 'column', 'region']
        });
        done();
      });
  });

  test('Check a puzzle placement with missing required fields', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: ''
      })  
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });

  test('Check a puzzle placement with invalid characters', (done) => {
    const invalidPuzzle = 'Z..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'; 
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidPuzzle,
        coordinate: 'A3',
        value: '9'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
        done();
      });
  });

  test('Check a puzzle placement with incorrect length', (done) => {
    const invalidLengthPuzzle = '..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidLengthPuzzle,
        coordinate: 'A3',
        value: '9'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'M1',  
        value: '5'
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid coordinate' });
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value', (done) => {
    const puzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzleString,
        coordinate: 'A1',
        value: 'X'  
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value' });
        done();
      });
  });

});


