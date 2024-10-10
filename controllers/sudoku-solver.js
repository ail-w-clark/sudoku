class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9.]{81}$/;
  
    if (!puzzleString) {
      return { error: 'Required field missing' };
    }
    if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (!regex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
  
    return true;
  }
  

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const columnIndex = column - 1;

    const start = rowIndex * 9;
    const end = start + 9;
    const rowString = puzzleString.slice(start, end);

    const filteredRow = rowString.slice(0, columnIndex) + rowString.slice(columnIndex + 1);

    return !filteredRow.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const columnIndex = column - 1;

    for (let i = 0; i < 9; i++) {
      if (i === rowIndex) continue;

      const cellValue = puzzleString[i * 9 + columnIndex];

      if (cellValue === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const columnIndex = column - 1;

    const regionStartRow = Math.floor(rowIndex / 3) * 3;
    const regionStartCol = Math.floor(columnIndex / 3) * 3;

    for (let i = regionStartRow; i < regionStartRow + 3; i++) {
      for (let j = regionStartCol; j < regionStartCol + 3; j++) {
        const index = i * 9 + j;

        if (i === rowIndex && j === columnIndex) continue;

        const cellValue = puzzleString[index];

        if (cellValue === value) {
          return false; 
        }
      }
    }

    return true; 
  }

  checkPlacement(puzzleString, row, column, value) {
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0);
    const columnIndex = column - 1;

    const index = rowIndex * 9 + columnIndex;
    if (puzzleString[index] !== '.' && puzzleString[index] === value) {
      return { valid: true };
    }

    const result = { valid: true, conflict: [] };

    if (!this.checkRowPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict.push('row');
    }

    if (!this.checkColPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict.push('column');
    }

    if (!this.checkRegionPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict.push('region');
    }

    return result;
  }

  solve(puzzleString) {

    if (this.validate(puzzleString) != true) {
      return (this.validate(puzzleString));
    }
    let puzzleArray = puzzleString.split('');

    const findEmptyCell = () => {
        for (let i = 0; i < 81; i++) {
            if (puzzleArray[i] === '.') {
                return i;
            }
        }
        return -1; 
    };

    const isValidPlacement = (index, value) => {
        const row = String.fromCharCode('A'.charCodeAt(0) + Math.floor(index / 9)); 
        const column = (index % 9) + 1;
        return this.checkPlacement(puzzleArray.join(''), row, column, value).valid;
    };

    const solve = () => {
        const emptyIndex = findEmptyCell();

        if (emptyIndex === -1) {
            return true; 
        }

        for (let num = 1; num <= 9; num++) {
            const value = num.toString();
            if (isValidPlacement(emptyIndex, value)) {
                puzzleArray[emptyIndex] = value;

                if (solve()) {
                    return true; 
                }

                puzzleArray[emptyIndex] = '.'; 
            }
        }

        return false; 
    };

    if (solve()) {
        return puzzleArray.join('');
    } else {
        return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;



