import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.handleClick(i) } />;
  }

  render() {
    let status = 'Next player : ' + ( (this.props.xIsNext) ? 'X' : '0')
    const winner = calculateWinner(this.props.squares) 
    console.log(status)
    if(winner) {
      status = 'Winner is ' + winner + ' ! ';
    }

    return (
      <div>
        <div className="status">{ status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        line : null, 
        col : null
      }],
      xIsNext: true,
      stepNumber : 0
    }
  }

  handleClick(i) {
    const history = this.state.history;  
    const current = history[this.state.stepNumber];    
    const squares = current.squares.slice();
    squares[i] = (this.state.xIsNext) ? 'X' : '0';
    const col = i % 3 + 1
    const line = Math.floor(i / 3) + 1
    const newHistory = this.state.history.concat({squares : squares, line, col }); //concatenam noua mutare la history 
    this.setState({history : newHistory, xIsNext:!this.state.xIsNext, stepNumber: history.length})
    console.log(this.state.xIsNext)
  }

  historyClick(index){ //un fel de jump to equivalent
    console.log(index)
    console.log(this.state.history)
    const newHistory = this.state.history.slice(0, index+1);
    console.log('new history')
    console.log(newHistory)
    this.setState({stepNumber: index, xIsNext : index % 2 === 0, history: newHistory})
  }

  renderHistoryBoards() {
    return this.state.history.map( (movement,index) => { 
          return (
            <li key={index}> <button value={index} onClick={() => this.historyClick(index)}
              style={
                //punem un style de bold pe movement-ul selectat
                (index === this.state.stepNumber) ? {fontWeight: 'bold'} : {fontWeight: 'normal'}
              }>
            reset to history {index}  movement - line :  {movement.line} and column : {movement.col} </button> </li>
          ) 
      } 
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    //console.log(lastSquare)
    return (
      <div className="game">
        <div className="game-history">
          {this.renderHistoryBoards()}
        </div>
        <div className="game-board">
          <Board 
            squares = {current.squares}
            handleClick={(i) => this.handleClick(i)}
            xIsNext={this.state.xIsNext}
          />
        </div>
        <div>
          
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}