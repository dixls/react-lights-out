import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = Array.from({length: nrows}, cols => Array.from({length: ncols}, cell => {
      return Math.random() < chanceLightStartsOn;
    }));
    // create array-of-arrays of true/false values

    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    let winCond = true;
    for (let row of board) {
      for (let cell of row) {
        if (cell) winCond = false;
      }
    }
    return winCond;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => row.map(cell => cell))

      const cellsToFlip = [
        [y, x], [y - 1, x], [y + 1, x], [y, x - 1], [y, x + 1]
      ];

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      
      // in the copy, flip this cell and the cells around it
      cellsToFlip.forEach(([y,x]) => {
        flipCell(y,x,boardCopy);
      })

      // return the copy
      return boardCopy

    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <h2>You Won!</h2>
    )
  }
  

  // make table board
  return (
    <table>
      <tbody>
      {board.map((row, y) => 
        (<tr>
          {row.map((cell, x) => 
            (<Cell
            isLit={cell} 
            flipCellsAroundMe={flipCellsAround} 
            coords={`${y}-${x}`}
          />))}
        </tr>))}
        </tbody>
    </table>
  )

}

export default Board;
