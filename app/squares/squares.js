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
