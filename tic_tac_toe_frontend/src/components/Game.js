import React, { useMemo, useState } from 'react';

/**
 * Simple Tic Tac Toe implementation using functional components and hooks.
 * Components:
 * - Game: Top-level component managing game state, status, and reset.
 * - Board: Renders a 3x3 grid of Square components.
 * - Square: Single button cell with accessibility metadata.
 *
 * Theme (light):
 * - primary: #3b82f6
 * - success: #06b6d4
 * - background: #f9fafb
 * - surface: #ffffff
 * - text: #111827
 */

// Square: single cell button
function Square({ value, onClick, row, col, isWinning }) {
  const baseButtonStyle = {
    width: 96,
    height: 96,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 32,
    fontWeight: 700,
    border: '2px solid #e5e7eb',
    backgroundColor: '#ffffff',
    color: '#111827',
    cursor: value ? 'default' : 'pointer',
    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
    borderRadius: 12,
    outline: 'none',
    boxShadow: isWinning ? '0 0 0 3px rgba(59,130,246,0.4)' : 'none',
  };

  const hoverStyle = !value
    ? { backgroundColor: '#f9fafb' }
    : {};

  return (
    <button
      type="button"
      className="ttt-square"
      aria-label={`Cell ${row + 1}, ${col + 1}${value ? `, ${value}` : ''}`}
      aria-pressed={!!value}
      onClick={onClick}
      style={baseButtonStyle}
      onMouseOver={(e) => {
        if (!value) e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor || '#ffffff';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#ffffff';
      }}
    >
      {value}
    </button>
  );
}

// Board: 3x3 grid
function Board({ board, onSquareClick, winningLine }) {
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
  };

  const isWinningCell = (index) => winningLine && winningLine.includes(index);

  return (
    <div role="grid" aria-label="Tic Tac Toe Board" style={containerStyle}>
      {board.map((val, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        return (
          <Square
            key={idx}
            value={val}
            onClick={() => onSquareClick(idx)}
            row={row}
            col={col}
            isWinning={isWinningCell(idx)}
          />
        );
      })}
    </div>
  );
}

// Helpers: winner detection
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // cols
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diags
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export default function Game() {
  /**
   * Game state
   * - board: 9-item array of 'X' | 'O' | null
   * - xIsNext: whose turn
   * - moveCount: for detecting draw
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [moveCount, setMoveCount] = useState(0);

  // Derived status
  const { winner, line } = useMemo(() => calculateWinner(board), [board]);
  const isDraw = !winner && moveCount === 9;

  const currentPlayer = xIsNext ? 'X' : 'O';

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /**
     * Handles a click on a square.
     * - If the game is finished or the square is not empty, ignore.
     * - Otherwise place the current player's mark and toggle the player.
     */
    if (winner || isDraw || board[index]) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
    setMoveCount((cnt) => cnt + 1);

    // Extension point: send move to backend
    // Example (to be implemented later):
    // try {
    //   await fetch(`${process.env.REACT_APP_API_BASE}/move`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ index, player: currentPlayer }),
    //   });
    // } catch (e) {
    //   console.error('Failed to send move:', e);
    // }
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /**
     * Resets the game to initial state.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setMoveCount(0);

    // Extension point: start/reset game on backend
    // Example:
    // fetch(`${process.env.REACT_APP_API_BASE}/games`, { method: 'POST' })
    //   .catch(err => console.error('Failed to start new game', err));
  }

  const pageStyle = {
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    color: '#111827',
    maxWidth: 420,
    width: '100%',
    padding: 24,
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 20px rgba(0,0,0,0.04)',
  };

  const titleStyle = {
    margin: 0,
    marginBottom: 16,
    fontSize: 24,
    color: '#111827',
    textAlign: 'center',
    fontWeight: 800,
    letterSpacing: 0.2,
  };

  const statusStyle = {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    textAlign: 'center',
    color: '#111827',
    fontWeight: 600,
  };

  const resetBtnStyle = {
    width: '100%',
    marginTop: 16,
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid #3b82f6',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontWeight: 700,
    letterSpacing: 0.3,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
  };

  const subtitleStyle = {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: 600,
  };

  // Accessible status message
  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw!'
    : `Turn: ${currentPlayer}`;

  return (
    <main style={pageStyle}>
      <section style={cardStyle} aria-label="Tic Tac Toe Game">
        <h1 style={titleStyle}>Tic Tac Toe</h1>
        <p style={subtitleStyle}>Two players take turns. First to 3 in a row wins.</p>

        <Board
          board={board}
          onSquareClick={handleSquareClick}
          winningLine={line}
        />

        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={statusStyle}
        >
          {statusText}
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset or start a new game"
          style={resetBtnStyle}
          onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.25)'; }}
          onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          New Game
        </button>

        {/* Extension point: fetch status from backend periodically or on demand
            Example:
            useEffect(() => {
              const id = setInterval(async () => {
                const res = await fetch(`${process.env.REACT_APP_API_BASE}/status`);
                const json = await res.json();
                // update local state accordingly
              }, 2000);
              return () => clearInterval(id);
            }, []);
        */}
      </section>
    </main>
  );
}
