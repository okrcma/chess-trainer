function ChessGame(boardElem) {
  var boardWidget = new BoardWidget(boardElem);
  boardWidget.initialize();
  boardWidget.setSquareClickCallback(handleSquareClick);

  var boardState = new BoardState();

  var selectedSquare = null;

  function handleSquareClick(square) {
    document.getElementById("demo").innerHTML =
      square + " " + boardWidget.getPiece(square);

    boardWidget.removeAllHints();
    if (selectedSquare !== null) boardWidget.unhighlightSquare(selectedSquare);

    if (boardState.squareHasPieceOfActivePlayer(square)) {
      selectedSquare = square;
      boardWidget.highlightSquare(square);
      for (let moveSquare of boardState.getLegalMoves(square))
        boardWidget.addHint(moveSquare);
    } else if (
      selectedSquare !== null &&
      boardState.getLegalMoves(selectedSquare).includes(square)
    ) {
      boardState.playPseudoLegalMove(selectedSquare, square);
      updatePieces();

      boardWidget.unhighlightAllSquares();
      boardWidget.highlightSquare(selectedSquare);
      boardWidget.highlightSquare(square);

      selectedSquare = null;
    } else {
      selectedSquare = null;
    }
  }

  function updatePieces() {
    for (let file of "abcdefgh") {
      for (let rank of "12345678") {
        let square = file + rank;
        let piece = boardState.getPieceOnSquare(square);
        boardWidget.setPiece(square, piece);
      }
    }
  }

  function flipBoard() {
    boardWidget.flipBoard();
  }

  return { flipBoard };
}
