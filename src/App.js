import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 10;

// _(x-1, y-1) _(x-1, y) _(x-1, y+1)
// _(x  , y-1) o(x  , y) _(x  , y+1)
// _(x+1, y-1) _(x+1, y) _(x+1, y+1)
const App = () => {
  const calculateVals = (board) => {
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (board[row][col] !== 9) {
          let val = 0;

          if (row - 1 >= 0 && board[row - 1][col] !== 9) {
            val += 1;
          }
          if (row + 1 < BOARD_HEIGHT && board[row + 1][col] !== 9) {
            val += 1;
          }
          if (col - 1 >= 0 && board[row][col - 1] !== 9) {
            val += 1;
          }
          if (col + 1 < BOARD_WIDTH && board[row][col + 1] !== 9) {
            val += 1;
          }
          if (row - 1 >= 0 && col - 1 >= 0 && board[row - 1][col - 1] !== 9) {
            val += 1;
          }
          if (
            row - 1 >= 0 &&
            col + 1 <= BOARD_WIDTH &&
            board[row - 1][col + 1] !== 9
          ) {
            val += 1;
          }
          if (
            row + 1 < BOARD_HEIGHT &&
            col - 1 >= 0 &&
            board[row + 1][col - 1] !== 9
          ) {
            val += 1;
          }
          if (
            row + 1 < BOARD_HEIGHT &&
            col + 1 < BOARD_WIDTH &&
            board[row + 1][col + 1] !== 9
          ) {
            val += 1;
          }
          board[row][col] = val;
        }
      }
    }
    return board;
  };

  const board = useMemo(() => {
    return calculateVals([
      [0, 0, 0, 0, 0, 0, 9, 0, 0, 9, 0],
      [0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0],
      [9, 0, 0, 0, 9, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
      [9, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9],
      [0, 9, 0, 0, 9, 0, 9, 0, 0, 9, 0],
      [0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 9, 0, 0, 0, 0, 9, 0, 9, 9],
    ]);
  }, []);

  const [openedCells, setOpenedCells] = useState([]);
  const [isGameOver, setGameOver] = useState(false);
  const [isMineFound, setMineFound] = useState(false);
  const [latestSelection, setLatestSelection] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isMineFound) {
      setGameOver(true);
    }
  }, [isMineFound]);

  useEffect(() => {
    if (openedCells.length === BOARD_HEIGHT * BOARD_WIDTH) {
      setGameOver(true);
    }
  }, [openedCells]);

  const isOpened = (id) => {
    return !!openedCells.find((mineID) => mineID === id);
  };

  const onCellClick = (row, column) => {
    const id = `${row}-${column}`;
    // check if the clicked button is a mine, if so game over
    if (!isOpened(id)) {
      setLatestSelection([row, column]);
      setOpenedCells([...openedCells, id]);
      const isMine = board[row][column] === 9;
      if (isMine) {
        setMineFound(true);
      } else {
        setScore((score) => score + 1);
      }
    }
  };

  const getBoard = () => {
    const rows = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const cells = [];
      for (let j = 0; j < BOARD_WIDTH; j++) {
        cells.push(
          <button
            id={`cell-${i}-${j}`}
            className={
              "board__cell " +
              (isGameOver &&
              latestSelection[0] === i &&
              latestSelection[1] === j
                ? "boom"
                : "")
            }
            onClick={() => onCellClick(i, j)}
            disabled={isGameOver}
          >
            {isGameOver || isOpened(`${i}-${j}`) ? (
              board[i][j] === 9 ? (
                <i className={"fa-solid fa-bomb"}></i>
              ) : (
                board[i][j]
              )
            ) : (
              " "
            )}
          </button>
        );
      }
      rows.push(
        <div id={`row-${i}`} className="board__row">
          {cells}
        </div>
      );
    }
    return rows;
  };
  return (
    <div className="minesweeper">
      <button
        onClick={() => {
          setGameOver(false);
          setMineFound(false);
          setOpenedCells([]);
          setLatestSelection(null);
        }}
      >
        Restart
      </button>
      <div className="board">{getBoard()}</div>

      {isGameOver && <div className="game-over">Game Over</div>}
      <div>
        <span>Score:</span>
        <span>{score}</span>
      </div>
    </div>
  );
};

export default App;
