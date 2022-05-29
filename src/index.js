import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  console.log(`prop highlited : ${props.highlited}`)
  if(!props.highlited)
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  else 
    return (
      <button className="square" onClick={props.onClick} style={{ color: 'green' }}>
         {props.value} 
      </button>
    ); 
}

class Board extends React.Component {

  renderSquare(i, highlited=0) {
    if (highlited === 0)
      return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.handleClick(i)} />;
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.handleClick(i)} highlited={1}/>;
  }

  renderSquares() {
    //lets generate a matrix of rendered objects
    let result = []
    for (let i = 0; i < 3; i++) {
      let line = []
      for (let j = 0; j < 3; j++) {
        line.push(this.renderSquare(i * 3 + j))
      }
      result.push(line)
    }
    const p = result.map((square, idx) => {//foreach line 
      return ( //start with a board row div 
        //foreach element in this line just return it 
        <li key={idx} className="board-row">
          {square.map(el => el)}
        </li>
      )
    })
    return p
  }

  renderRow(rowId, first=-1, second=-1, third=-1) {
    const row = []
    // console.log(first)
    // console.log(second)
    // console.log(third)
    for(let c = 0; c < 3; c++){
      const idx = rowId*3+c
      if(idx === first || idx === second || idx === third)
        row.push(this.renderSquare(rowId*3+c, 1))
      else 
        row.push(this.renderSquare(idx))
    }
    return (
      <div className="board-row">
        {row} 
      </div>
    )
  }

  render() {
    let status = 'Next player : ' + ((this.props.xIsNext) ? 'X' : '0')
    const winner = calculateWinner(this.props.squares)
    if (winner) {
      status = 'Winner is ' + winner.char + ' ! ';
    }
    const checkDraw = checkIfDraw(this.props.squares)
    if(checkDraw){
      status = 'Game draw';
    }
    const rows = []
    for(let col = 0; col < 3; col++){
      if(winner){
        console.log(winner)
        rows.push(this.renderRow(col, winner.a, winner.b, winner.c))
      }
      else 
        rows.push(this.renderRow(col))
    }


    return (
      <div>
        <div className="status">{status}</div>
        <div>
          {rows}
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
        line: null,
        col: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    squares[i] = (this.state.xIsNext) ? 'X' : '0';
    const col = i % 3 + 1
    const line = Math.floor(i / 3) + 1
    const newHistory = this.state.history.concat({ squares: squares, line, col }); //concatenam noua mutare la history 
    this.setState({ history: newHistory, xIsNext: !this.state.xIsNext, stepNumber: history.length })
    console.log(this.state.xIsNext)
  }

  historyClick(index) { //un fel de jump to equivalent
    console.log(index)
    console.log(this.state.history)
    const newHistory = this.state.history.slice(0, index + 1);
    console.log('new history')
    console.log(newHistory)
    this.setState({ stepNumber: index, xIsNext: index % 2 === 0, history: newHistory })
  }

  renderHistoryBoards() {
    return this.state.history.map((movement, index) => {
      return (
        <li key={index}> <button value={index} onClick={() => this.historyClick(index)}
          style={
            //punem un style de bold pe movement-ul selectat
            (index === this.state.stepNumber) ? { fontWeight: 'bold' } : { fontWeight: 'normal' }
          }>
          reset to history {index}  movement - line :  {movement.line} and column : {movement.col} </button> </li>
      )
    }
    )
  }

  sortHistory(){
    const history = this.state.history.map( el => el)
    console.log(history)
    history.reverse()
    this.setState({history})
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
            squares={current.squares}
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
        <div>
          <button onClick={() => this.sortHistory()}> history reverse </button>
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
      return {a, b, c, char: squares[a]};
    }
  }
  return null;
}

function checkIfDraw(squares){
  return squares.every( (el) => el !== null ) && !calculateWinner(squares)
}