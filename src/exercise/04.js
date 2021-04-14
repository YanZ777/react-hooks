// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

import {useLocalStorageState} from '../utils'

function Board({ onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
   const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [Array(9).fill(null)]);
   const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', (0));
   const squares = history[currentStep];
   const nextValue = calculateNextValue(squares);
   const winner = calculateWinner(squares);
   const status = calculateStatus(winner, squares, nextValue);

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
   // 🐨 first, if there's already winner or there's already a value at the
   // given square index (like someone clicked a square that's already been
   // clicked), then return early so we don't make any state changes
   //
   if (winner|| squares[square] !== null) {
     return;
   }
  // 🦉 It's typically a bad idea to mutate or directly change state in React.
  // Doing so can lead to subtle bugs that can easily slip into production.
  //
  const newHistory = history.slice(0, currentStep + 1);
  const squaresCopy = [...squares];
  squaresCopy[square] = nextValue;

   setHistory([...newHistory, squaresCopy]);
   setCurrentStep(newHistory.length);
 }

 function restart() {
   // 🐨 reset the squares
   // 💰 `Array(9).fill(null)` will do it!
   setHistory([Array(9).fill(null)]);
   setCurrentStep(0);
 }

 const moves = history.map((step, i) => {
    const description = i === 0 ? "Go to game start": `Go to move #${i}`
    const isCurrentStep = i === currentStep;
   return (
      <li key={description}>
         <button disabled={isCurrentStep} onClick={() => {setCurrentStep(i)}}>
            {description} {isCurrentStep ? '(current)' : null}
         </button>
      </li>
   );
 });

  return (
      <div className="game">
      <div className="game-board">
      <Board onClick={selectSquare} squares={squares} />
      <button className="restart" onClick={restart}>
         restart
      </button>
      </div>
      <div className="game-info">
      <div className="status">{status}</div>
      <ol>{moves}</ol>
      </div>
   </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
