import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Components/Board'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>8-Tiles</h1>
        <Board />
      </header>
    </div>
  );
}

export default App;
