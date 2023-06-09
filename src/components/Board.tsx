import { useState } from "react";
import calculateWinner from "./calculateWinner";
import Square from "./Square";

export type SquareValue = "X" | "O";

interface HistoryItem {
  squares: SquareValue[];
}

export default function Board() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [history, setHistory] = useState<HistoryItem[]>([{ squares }]);
  const [prevSquare, setPrevSquare] = useState<SquareValue>(Math.random() > 0.5 ? "X" : "O");
  const [stepNumber, setStepNumber] = useState<number>(0);

  let status: string;
  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (prevSquare === "X" ? "X" : "O");
  }

  function handleClick(i: number) {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const nextSquares = [...current.squares];

    if (calculateWinner(nextSquares) || nextSquares[i]) {
      return;
    }

    nextSquares[i] = prevSquare;
    setPrevSquare(prevSquare === "X" ? "O" : "X");
    setSquares(nextSquares);
    setHistory(newHistory.concat([{ squares: nextSquares }]));
    setStepNumber(newHistory.length);
  }

  function jumpTo(step: number) {
    setStepNumber(step);
    setPrevSquare(step % 2 === 0 ? "X" : "O");
  }

  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={current.squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={current.squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={current.squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={current.squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={current.squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={current.squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={current.squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={current.squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={current.squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <ol>{moves}</ol>
    </>
  );
}
