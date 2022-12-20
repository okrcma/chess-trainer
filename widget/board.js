function BoardWidget(boardElem) {
  var squareClickCallback = (square) => {};
  var flipped = false;

  function initialize() {
    boardElem.onclick = (e) => handleClick(e);
    boardElem.classList.add("board");
    initializeBackgroundElements();
    initializePieceElements();
  }

  function setSquareClickCallback(callback) {
    squareClickCallback = callback;
  }

  function handleClick(event) {
    let rect = boardElem.getBoundingClientRect();
    let x = (event.clientX - rect.left) / rect.width;
    let y = (event.clientY - rect.top) / rect.height;

    if (flipped) {
      x = 1 - x;
      y = 1 - y;
    }

    let file = "abcdefghh".charAt(Math.floor(x * 8));
    let rank = "876543211".charAt(Math.floor(y * 8));

    squareClickCallback(file + rank);
  }

  function initializeBackgroundElements() {
    let squareColorIndex = 0;

    for (let file of "abcdefgh") {
      for (let rank of "12345678") {
        let colorClass = "square-light";
        if (squareColorIndex % 2 === 0) colorClass = "square-dark";

        let elem = document.createElement("div");
        elem.classList.add("square", "square-" + file + rank, colorClass);
        boardElem.appendChild(elem);

        squareColorIndex += 1;
      }
      squareColorIndex += 1;
    }
  }

  function initializePieceElements() {
    for (let file of "abcdefgh") {
      for (let rank of "12345678") {
        let elem = document.createElement("div");
        elem.classList.add("square", "square-" + file + rank, "piece");
        boardElem.appendChild(elem);
      }
    }

    for (let file of "abcdefgh") setPiece(file + "2", "wp");
    setPiece("a1", "wr");
    setPiece("b1", "wn");
    setPiece("c1", "wb");
    setPiece("d1", "wq");
    setPiece("e1", "wk");
    setPiece("f1", "wb");
    setPiece("g1", "wn");
    setPiece("h1", "wr");

    for (let file of "abcdefgh") setPiece(file + "7", "bp");
    setPiece("a8", "br");
    setPiece("b8", "bn");
    setPiece("c8", "bb");
    setPiece("d8", "bq");
    setPiece("e8", "bk");
    setPiece("f8", "bb");
    setPiece("g8", "bn");
    setPiece("h8", "br");
  }

  function flipBoard() {
    flipped ^= true;
    boardElem.classList.toggle("flipped");
    for (let elem of boardElem.getElementsByClassName("square")) {
      elem.classList.toggle("flipped");
    }
  }

  function getPiece(square) {
    for (let elem of boardElem.getElementsByClassName(
      "piece square-" + square
    )) {
      for (let piece of [
        "wp",
        "wr",
        "wn",
        "wb",
        "wq",
        "wk",
        "bp",
        "br",
        "bn",
        "bb",
        "bq",
        "bk",
      ]) {
        if (elem.classList.contains("piece-" + piece)) return piece;
      }
    }
    return null;
  }

  function setPiece(square, piece) {
    removePiece(square);
    for (let elem of boardElem.getElementsByClassName(
      "piece square-" + square
    )) {
      elem.classList.add("piece-" + piece);
    }
  }

  function removePiece(square) {
    for (let elem of boardElem.getElementsByClassName(
      "piece square-" + square
    )) {
      elem.classList.remove(
        "piece-wp",
        "piece-wr",
        "piece-wn",
        "piece-wb",
        "piece-wq",
        "piece-wk",
        "piece-bp",
        "piece-br",
        "piece-bn",
        "piece-bb",
        "piece-bq",
        "piece-bk"
      );
    }
  }

  function highlightSquare(square) {
    for (let elem of boardElem.querySelectorAll(
      `.square-dark.square-${square}`
    )) {
      elem.classList.remove("square-dark");
      elem.classList.add("square-dark-highlighted");
    }

    for (let elem of boardElem.querySelectorAll(
      `.square-light.square-${square}`
    )) {
      elem.classList.remove("square-light");
      elem.classList.add("square-light-highlighted");
    }
  }

  function unhighlightSquare(square) {
    for (let elem of boardElem.querySelectorAll(
      `.square-dark-highlighted.square-${square}`
    )) {
      elem.classList.add("square-dark");
      elem.classList.remove("square-dark-highlighted");
    }

    for (let elem of boardElem.querySelectorAll(
      `.square-light-highlighted.square-${square}`
    )) {
      elem.classList.add("square-light");
      elem.classList.remove("square-light-highlighted");
    }
  }

  function toggleSquareHighlight(square) {
    for (let elem of boardElem.querySelectorAll(
      `.square-dark.square-${square},
            .square-dark-highlighted.square-${square}`
    )) {
      elem.classList.toggle("square-dark");
      elem.classList.toggle("square-dark-highlighted");
    }

    for (let elem of boardElem.querySelectorAll(
      `.square-light.square-${square},
            .square-light-highlighted.square-${square}`
    )) {
      elem.classList.toggle("square-light");
      elem.classList.toggle("square-light-highlighted");
    }
  }

  function unhighlightAllSquares() {
    for (let elem of boardElem.querySelectorAll(".square-dark-highlighted")) {
      elem.classList.toggle("square-dark");
      elem.classList.toggle("square-dark-highlighted");
    }

    for (let elem of boardElem.querySelectorAll(".square-light-highlighted")) {
      elem.classList.toggle("square-light");
      elem.classList.toggle("square-light-highlighted");
    }
  }

  function addHint(square) {
    if (
      boardElem.querySelectorAll(
        `.hint.square-${square},.capture-hint.square-${square}`
      ).length > 0
    )
      return;

    let elem = document.createElement("div");
    elem.classList.add("square", "square-" + square);
    let piece = getPiece(square);
    if (piece === null) elem.classList.add("hint");
    else {
      elem.classList.add("capture-hint");
      elem.style.borderWidth = boardElem.getBoundingClientRect().width / 100;
    }
    boardElem.appendChild(elem);
  }

  function removeAllHints() {
    for (let elem of boardElem.querySelectorAll(".capture-hint,.hint"))
      elem.remove();
  }

  return {
    initialize,
    setSquareClickCallback,
    flipBoard,
    getPiece,
    setPiece,
    highlightSquare,
    unhighlightSquare,
    toggleSquareHighlight,
    unhighlightAllSquares,
    addHint,
    removeAllHints,
  };
}
