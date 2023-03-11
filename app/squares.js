function loadSquares(appElem) {
  appElem.innerHTML = `
      <div id="square">bla</div>
      <button onclick="game.flipBoard()">Flip</button>
      <div id="board"></div>
    `;
  game = new SquaresTrainer(document.getElementById("board"));
}

function SquaresTrainer(boardElem) {
  var boardWidget = new BoardWidget(boardElem);
  boardWidget.initialize();
  boardWidget.setSquareClickCallback(handleSquareClick);
  var chosenSquare = null;
  chooseRandomSquare();

  function handleSquareClick(square) {
    if (chosenSquare !== square) {
      alert(chosenSquare + square);
    }
    chooseRandomSquare();
  }

  function flipBoard() {
    boardWidget.flipBoard();
  }

  function getRandomSquare() {
    fileIndex = Math.floor(Math.random() * 8);
    rankIndex = Math.floor(Math.random() * 8);
    return "abcdefgh"[fileIndex] + "12345678"[rankIndex];
  }

  function chooseRandomSquare() {
    square = getRandomSquare();
    chosenSquare = square;
    document.getElementById("square").innerHTML = square;
    return square;
  }

  return { flipBoard };
}
