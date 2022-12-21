/**
 * Represents board state of a chess game.
 *
 * Keeps track of all variables needed to determine whether a move is valid
 * and whether the game has ended.
 *
 * The game can only end in checkmate or stalemate (when there are no legal
 * moves). Other forms of draws are not implemented, such as a dead position,
 * a threefold repetition, or the fifty-move rule.
 *
 * // TODO pawn promotion
 *
 */
function BoardState() {
  /** Current position of pieces on the board.
   *
   * First index is for files, second is for ranks. For example the piece
   * at e1 is position[4][0].
   *
   * Each piece is represented by a two-char string. The first char
   * indicates the color. Char "w" is for white and "b" is for black.
   * The second char indicates the piece type. Char "p" is for pawn,
   * "r" is for rook, "n" is for knight, "b" is for bishop, "q" is for queen
   * and "k" is for king. String "ee" represents an empty square.
   *
   * Because the position is represented as a two dimensional array, it
   * is simpler to work with files and ranks as integers 0 to 7, not letters
   * "a" to "h" and numbers 1 to 8. For this reason all variables for files
   * and ranks in this object shall contain values 0 to 7. All variables
   * for squares (i.e. square coordinates) shall be two-char strings
   * where the first char indicates the file and can have values "a" to "h"
   * and the second char indicates the rank and can have values "1" to "8".
   */
  var position = [
    ["wr", "wp", "ee", "ee", "ee", "ee", "bp", "br"],
    ["wn", "wp", "ee", "ee", "ee", "ee", "bp", "bn"],
    ["wb", "wp", "ee", "ee", "ee", "ee", "bp", "bb"],
    ["wq", "wp", "ee", "ee", "ee", "ee", "bp", "bq"],
    ["wk", "wp", "ee", "ee", "ee", "ee", "bp", "bk"],
    ["wb", "wp", "ee", "ee", "ee", "ee", "bp", "bb"],
    ["wn", "wp", "ee", "ee", "ee", "ee", "bp", "bn"],
    ["wr", "wp", "ee", "ee", "ee", "ee", "bp", "br"],
  ];

  /** Color of the player whose turn it is. Can be "w" or "b". */
  var activeColor = "w";

  /** Whether castling is available for all four possible castles. */
  var blackCastleKingsideAvailable = true;
  var blackCastleQueensideAvailable = true;
  var whiteCastleKingsideAvailable = true;
  var whiteCastleQueensideAvailable = true;

  /** Square coordinates of the last move if the last moves was a two-square
   * pawn move. If any other move was the last played, then the value of this
   * variable is "-".
   */
  var twoSquarePawnMove = "-";

  /** Number of full and half moves played in a row.
   *
   * Full move is any move, so this counts the number of moves since the
   * beginning of the game.
   *
   * Half moves are moves which are neither capture moves nor pawn moves.
   * The counter resets after any other move.
   */
  var numberOfHalfMoves = 0;
  var numberOfFullMoves = 0;

  /** The current squares of both kings. */
  var blackKingSquare = "e8";
  var whiteKingSquare = "e1";

  /**
   * Sets all the variables of this object.
   *
   * Used when creating a copy. Normally shouldn't be used.
   */
  function _initialize(
    newPosition,
    newActiveColor,
    newBlackCastleKingsideAvailable,
    newBlackCastleQueensideAvailable,
    newWhiteCastleKingsideAvailable,
    newWhiteCastleQueensideAvailable,
    newTwoSquarePawnMove,
    newNumberOfHalfMoves,
    newNumberOfFullMoves,
    newBlackKingSquare,
    newWhiteKingSquare
  ) {
    position = newPosition;
    activeColor = newActiveColor;
    blackCastleKingsideAvailable = newBlackCastleKingsideAvailable;
    blackCastleQueensideAvailable = newBlackCastleQueensideAvailable;
    whiteCastleKingsideAvailable = newWhiteCastleKingsideAvailable;
    whiteCastleQueensideAvailable = newWhiteCastleQueensideAvailable;
    twoSquarePawnMove = newTwoSquarePawnMove;
    numberOfHalfMoves = newNumberOfHalfMoves;
    numberOfFullMoves = newNumberOfFullMoves;
    blackKingSquare = newBlackKingSquare;
    whiteKingSquare = newWhiteKingSquare;
  }

  /**
   * Creates a deep copy of this object.
   */
  function copy() {
    let newPosition = [...Array(8)].map((e) => Array(8));
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        newPosition[file][rank] = position[file][rank];
      }
    }

    let newBoardState = new BoardState();
    newBoardState._initialize(
      newPosition,
      activeColor,
      blackCastleKingsideAvailable,
      blackCastleQueensideAvailable,
      whiteCastleKingsideAvailable,
      whiteCastleQueensideAvailable,
      twoSquarePawnMove,
      numberOfHalfMoves,
      numberOfFullMoves,
      blackKingSquare,
      whiteKingSquare
    );

    return newBoardState;
  }

  /**
   * Returns integer representation of the file for the given square.
   *
   * The integer representation of a file can have values from 0 up to 7,
   * corresponding to files "a" up to "h".
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {integer} Integer representing the file.
   */
  function fileFromSquare(square) {
    return square.charCodeAt(0) - 97;
  }

  /**
   * Return integer representation of the rank for the given square.
   *
   * The integer representation of a rank can have values from 0 up to 7,
   * corresponding to ranks 1 up to 8.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns Integer representing the rank.
   */
  function rankFromSquare(square) {
    return parseInt(square[1]) - 1;
  }

  /**
   * Returns string square coordinates for the given integer file and rank.
   *
   * @param {integer} file Any valid integer file.
   * @param {integer} rank Any valid integer rank.
   * @returns {string} String square coordinates representing the square.
   */
  function squareFromFileRank(file, rank) {
    return String.fromCharCode(97 + file) + (rank + 1);
  }

  /**
   * Gets color of the player whose turn it is.
   * @returns {string} Color of the active player as either "w" or "b".
   */
  function getActivePlayer() {
    return activeColor;
  }

  /**
   * Checks whether the square has a piece which belongs to the active player.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {boolean} True if the square has piece belonging to the active
   *    player, false otherwise.
   */
  function squareHasPieceOfActivePlayer(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    return piece[0] === activeColor;
  }

  /**
   * Gets piece on the given square.
   *
   * If there is no piece, null is returned. This method is to be used
   * publicly.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {string} Two-char string representing the piece or null.
   */
  function getPieceOnSquare(square) {
    let piece = _getPieceOnSquare(square);
    if (piece === "ee") return null;
    return piece;
  }

  /**
   * Gets piece on the given square.
   *
   * If there is no piece, "ee" is returned. This method is to be used
   * privatly.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {string} Two-char string representing the piece.
   */
  function _getPieceOnSquare(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    return position[file][rank];
  }

  /**
   * Sets the piece of the given suare to be the given piece.
   *
   * @param {string} square Any valid string square coordinates.
   * @param {string} piece Any valid string piece, including "ee".
   */
  function setPieceOnSquare(square, piece) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    position[file][rank] = piece;
  }

  /**
   * Returns an array of squares to where it is legal to move from the given
   * square considering the current board state.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {Array.<string>} Array of string squares to where it is legal to
   *    move from the given square.
   */
  function getLegalMoves(square) {
    let legalMoves = [];
    for (let toSquare of getPseudoLegalMoves(square)) {
      // TODO checks for castles
      if (!kingWouldBeInCheck(activeColor, square, toSquare))
        legalMoves.push(toSquare);
    }
    return legalMoves;
  }

  /**
   * Checks whether the move from one square to another is legal considering
   * the current board state.
   *
   * @param {string} fromSquare Any valid string square coordinates.
   * @param {string} toSquare Any valid string square coordinates.
   * @returns {boolean} True if it is legal to move from the from-square
   *    to the to-square, false otherwise.
   */
  function moveIsLegal(fromSquare, toSquare) {
    return getLegalMoves(fromSquare).includes(toSquare);
  }

  /**
   * Checks whether the king of the given color is currently in check.
   *
   * @param {string} color Color as string "w" or "b".
   * @returns {boolean} True if the king of the given color is in check,
   *    false otherwise.
   */
  function kingIsInCheck(color) {
    let kingSquare = color === "w" ? whiteKingSquare : blackKingSquare;

    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        let piece = position[file][rank];
        if (piece[0] === color || piece === "ee") continue;

        let square = squareFromFileRank(file, rank);
        for (let attackedSquare of getPseudoLegalMoves(square)) {
          if (attackedSquare === kingSquare) return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks whether the king of the given color would be in check
   * if a piece moved from the given from-square to the given to-square.
   *
   * @param {string} color Color as string "w" or "b".
   * @param {string} fromSquare Any valid string square coordinates.
   * @param {string} toSquare Valid string square coordinates which together
   *    with the from-square represent a pseudo legal move.
   * @returns {boolean} True if the king of the given color would be in check
   *    after the given move.
   */
  function kingWouldBeInCheck(color, fromSquare, toSquare) {
    let boardStateCopy = copy();
    boardStateCopy.playPseudoLegalMove(fromSquare, toSquare);
    return boardStateCopy.kingIsInCheck(color);
  }

  /**
   * Checks whether the player of the given color has any legal moves left.
   *
   * @param {string} color Color as string "w" or "b".
   * @returns {boolean} True if the player has at least one legal move,
   *     false otherwise.
   */
  function playerHasLegalMoves(color) {
    for (let file = 0; file < 8; file++) {
      for (let rank = 0; rank < 8; rank++) {
        if (position[file][rank][0] !== color) continue;
        if (getLegalMoves(squareFromFileRank(file, rank)).length > 0)
          return true;
      }
    }
    return false;
  }

  /**
   * Checks whether the game is in a state of checkmate.
   *
   * @returns {boolean} True if there is a checkmate on the board,
   *     false otherwise.
   */
  function isCheckmate() {
    return !playerHasLegalMoves(activeColor) && kingIsInCheck(activeColor);
  }

  /**
   * Checks whether the game is in a state of stalemate.
   *
   * @returns {boolean} True if the game is in stalemate, false otherwise.
   */
  function isStalemate() {
    return !playerHasLegalMoves(activeColor) && !kingIsInCheck(activeColor);
  }

  /**
   * Returns an array of squares to where it is pseudo-legal to move from
   * the given square considering the current board state.
   *
   * Pseudo legal moves are the same as legal moves except that they can
   * ignore king checks.
   *
   * @param {string} square Any valid string square coordinates.
   * @returns {Array.<string>} Array of string squars to where it is pseudo
   *    legal to move from the given square.
   */
  function getPseudoLegalMoves(square) {
    let piece = _getPieceOnSquare(square);
    if (piece === "ee") return [];

    switch (piece[1]) {
      case "p":
        return getPawnPseudoLegalMoves(square);
      case "r":
        return getRookPseudoLegalMoves(square);
      case "n":
        return getKnightPseudoLegalMoves(square);
      case "b":
        return getBishopPseudoLegalMoves(square);
      case "q":
        return getQueenPseudoLegalMoves(square);
      case "k":
        return getKingPseudoLegalMoves(square);
    }

    return [];
  }

  /**
   * Checks whether the move from one square to another is pseudo legal
   * considering the current board state.
   *
   * @param {string} fromSquare Any valid string square coordinates.
   * @param {string} toSquare Any valid string square coordinates.
   * @returns {boolean} True if it is pseudo legal to move from the from-square
   *    to the to-square, false otherwise.
   */
  function moveIsPseudoLegal(fromSquare, toSquare) {
    return getPseudoLegalMoves(fromSquare).includes(toSquare);
  }

  /**
   * Play a legal move from one square to another.
   *
   * This method moves the pieces and also updates all the other variables
   * keeping the consistent board state.
   *
   * @param {string} fromSquare Any valid string square coordinates.
   * @param {string} toSquare Valid string square coordinates which together
   *    with the from-square represent a legal move.
   */
  function playLegalMove(fromSquare, toSquare) {
    if (!moveIsLegal(fromSquare, toSquare)) {
      console.log(`Move from ${fromSquare} to ${toSquare} is not legal.`);
      return;
    }

    playPseudoLegalMove(fromSquare, toSquare);
  }

  /**
   * Play a pseudo legal move from one square to another.
   *
   * This method moves the pieces and also updates all the other variables
   * keeping the consistent board state.
   *
   * @param {string} fromSquare Any valid string square coordinates.
   * @param {string} toSquare Valid string square coordinates which together
   *    with the from-square represent a pseudo legal move.
   */
  function playPseudoLegalMove(fromSquare, toSquare) {
    if (!moveIsPseudoLegal(fromSquare, toSquare)) {
      console.log(
        `Move from ${fromSquare} to ${toSquare} is not pseudo legal.`
      );
      return;
    }

    let fromPiece = _getPieceOnSquare(fromSquare);
    let toPiece = _getPieceOnSquare(toSquare);

    // swap active player color
    if (activeColor === "w") activeColor = "b";
    else activeColor = "w";

    // update castling availability
    if (fromSquare === "a1" || toSquare === "a1")
      whiteCastleQueensideAvailable = false;
    if (fromSquare === "h1" || toSquare === "h1")
      whiteCastleKingsideAvailable = false;
    if (fromSquare === "e1" || toSquare === "e1") {
      whiteCastleQueensideAvailable = false;
      whiteCastleKingsideAvailable = false;
    }
    if (fromSquare === "a8" || toSquare === "a8")
      blackCastleQueensideAvailable = false;
    if (fromSquare === "h8" || toSquare === "h8")
      blackCastleKingsideAvailable = false;
    if (fromSquare === "e8" || toSquare === "e8") {
      blackCastleQueensideAvailable = false;
      blackCastleKingsideAvailable = false;
    }

    // save two square pawn move
    if (
      fromPiece[1] === "p" &&
      Math.abs(rankFromSquare(fromSquare) - rankFromSquare(toSquare)) > 1
    )
      twoSquarePawnMove = toSquare;
    else twoSquarePawnMove = "-";

    // update full moves counter
    numberOfFullMoves++;

    // update half moves counter
    if (
      (toPiece !== "ee" && fromPiece[0] !== toPiece[0]) ||
      fromPiece[1] === "p"
    )
      numberOfHalfMoves = 0;
    else numberOfHalfMoves++;

    // update king square
    if (fromPiece === "wk") whiteKingSquare = toSquare;
    if (fromPiece === "bk") blackKingSquare = toSquare;

    // move pieces
    setPieceOnSquare(toSquare, fromPiece);
    setPieceOnSquare(fromSquare, "ee");
    // delete pawn catured by en passant
    if (fromPiece[1] === "p" && fromSquare[0] !== toSquare[0])
      setPieceOnSquare(toSquare[0] + fromSquare[1], "ee");
    // move rook when castling, not compatible with Fisher random
    if (fromPiece[1] === "k" && toSquare[0] === "c") {
      setPieceOnSquare("d" + toSquare[1], _getPieceOnSquare("a" + toSquare[1]));
      setPieceOnSquare("a" + toSquare[1], "ee");
    }
    if (fromPiece[1] === "k" && toSquare[0] === "g") {
      setPieceOnSquare("f" + toSquare[1], _getPieceOnSquare("h" + toSquare[1]));
      setPieceOnSquare("h" + toSquare[1], "ee");
    }
  }

  /**
   * Returns an array of square coordinates to which a pawn can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a pawn of the same color as the
   * actual piece in this square.
   *
   * Considers all pawn moves: normal, double, attacking and en passant.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a pawn.
   */
  function getPawnPseudoLegalMoves(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    if (piece === "ee") return [];

    let moves = [];
    if (piece[0] === "w") {
      // two-square move
      if (
        rank === 1 &&
        position[file][rank + 1] === "ee" &&
        position[file][rank + 2] === "ee"
      )
        moves.push(squareFromFileRank(file, rank + 2));

      // normal move
      if (rank < 7 && position[file][rank + 1] === "ee")
        moves.push(squareFromFileRank(file, rank + 1));

      // en passant
      if (rank === 4) {
        if (
          file > 0 &&
          twoSquarePawnMove === squareFromFileRank(file - 1, rank)
        )
          moves.push(squareFromFileRank(file - 1, rank + 1));
        if (
          file < 7 &&
          twoSquarePawnMove === squareFromFileRank(file + 1, rank)
        )
          moves.push(squareFromFileRank(file + 1, rank + 1));
      }

      // attacking moves
      if (
        file > 0 &&
        position[file - 1][rank + 1] !== "ee" &&
        position[file - 1][rank + 1][0] !== piece[0]
      )
        moves.push(squareFromFileRank(file - 1, rank + 1));
      if (
        file < 7 &&
        position[file + 1][rank + 1] !== "ee" &&
        position[file + 1][rank + 1][0] !== piece[0]
      )
        moves.push(squareFromFileRank(file + 1, rank + 1));
    } else {
      // two-square move
      if (
        rank === 6 &&
        position[file][rank - 1] === "ee" &&
        position[file][rank - 2] === "ee"
      )
        moves.push(squareFromFileRank(file, rank - 2));

      // normal move
      if (rank > 0 && position[file][rank - 1] === "ee")
        moves.push(squareFromFileRank(file, rank - 1));

      // en passant
      if (rank === 3) {
        if (
          file > 0 &&
          twoSquarePawnMove === squareFromFileRank(file - 1, rank)
        )
          moves.push(squareFromFileRank(file - 1, rank - 1));
        if (
          file < 7 &&
          twoSquarePawnMove === squareFromFileRank(file + 1, rank)
        )
          moves.push(squareFromFileRank(file + 1, rank - 1));
      }

      // attacking moves
      if (
        file > 0 &&
        position[file - 1][rank - 1] !== "ee" &&
        position[file - 1][rank - 1][0] !== piece[0]
      )
        moves.push(squareFromFileRank(file - 1, rank - 1));
      if (
        file < 7 &&
        position[file + 1][rank - 1] !== "ee" &&
        position[file + 1][rank - 1][0] !== piece[0]
      )
        moves.push(squareFromFileRank(file + 1, rank - 1));
    }

    return moves;
  }

  /**
   * Returns an array of square coordinates to which a rook can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a rook of the same color as the
   * actual piece in this square.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a rook.
   */
  function getRookPseudoLegalMoves(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    if (piece === "ee") return [];

    let moves = [];
    // right
    for (let f = file + 1; f < 8; f++) {
      if (position[f][rank][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, rank));
      if (position[f][rank] !== "ee") break;
    }
    // left
    for (let f = file - 1; f >= 0; f--) {
      if (position[f][rank][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, rank));
      if (position[f][rank] !== "ee") break;
    }
    // up
    for (let r = rank + 1; r < 8; r++) {
      if (position[file][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(file, r));
      if (position[file][r] !== "ee") break;
    }
    // down
    for (let r = rank - 1; r >= 0; r--) {
      if (position[file][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(file, r));
      if (position[file][r] !== "ee") break;
    }

    return moves;
  }

  /**
   * Returns an array of square coordinates to which a knight can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a knight of the same color as the
   * actual piece in this square.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a knight.
   */
  function getKnightPseudoLegalMoves(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    if (piece === "ee") return [];

    let moves = [];
    // two up, one left
    if (file > 0 && rank < 6 && position[file - 1][rank + 2][0] !== piece[0])
      moves.push(squareFromFileRank(file - 1, rank + 2));
    // two up, one right
    if (file < 7 && rank < 6 && position[file + 1][rank + 2][0] !== piece[0])
      moves.push(squareFromFileRank(file + 1, rank + 2));
    // two down, one left
    if (file > 0 && rank > 1 && position[file - 1][rank - 2][0] !== piece[0])
      moves.push(squareFromFileRank(file - 1, rank - 2));
    // two down, one right
    if (file < 7 && rank > 1 && position[file + 1][rank - 2][0] !== piece[0])
      moves.push(squareFromFileRank(file + 1, rank - 2));
    // on up, two left
    if (file > 1 && rank < 7 && position[file - 2][rank + 1][0] !== piece[0])
      moves.push(squareFromFileRank(file - 2, rank + 1));
    // on up, two right
    if (file < 6 && rank < 7 && position[file + 2][rank + 1][0] !== piece[0])
      moves.push(squareFromFileRank(file + 2, rank + 1));
    // on down, two left
    if (file > 1 && rank > 0 && position[file - 2][rank - 1][0] !== piece[0])
      moves.push(squareFromFileRank(file - 2, rank - 1));
    // on down, two right
    if (file < 6 && rank > 0 && position[file + 2][rank - 1][0] !== piece[0])
      moves.push(squareFromFileRank(file + 2, rank - 1));

    return moves;
  }

  /**
   * Returns an array of square coordinates to which a bishop can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a bishop of the same color as the
   * actual piece in this square.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a bishop.
   */
  function getBishopPseudoLegalMoves(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    if (piece === "ee") return [];

    let moves = [];
    // up right
    for (let f = file + 1, r = rank + 1; f < 8 && r < 8; f++, r++) {
      if (position[f][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, r));
      if (position[f][r] !== "ee") break;
    }
    // down right
    for (let f = file + 1, r = rank - 1; f < 8 && r >= 0; f++, r--) {
      if (position[f][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, r));
      if (position[f][r] !== "ee") break;
    }
    // down left
    for (let f = file - 1, r = rank - 1; f >= 0 && r >= 0; f--, r--) {
      if (position[f][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, r));
      if (position[f][r] !== "ee") break;
    }
    // up left
    for (let f = file - 1, r = rank + 1; f >= 0 && r < 8; f--, r++) {
      if (position[f][r][0] === piece[0]) break;
      moves.push(squareFromFileRank(f, r));
      if (position[f][r] !== "ee") break;
    }

    return moves;
  }

  /**
   * Returns an array of square coordinates to which a queen can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a queen of the same color as the
   * actual piece in this square.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a queen.
   */
  function getQueenPseudoLegalMoves(square) {
    return getRookPseudoLegalMoves(square).concat(
      getBishopPseudoLegalMoves(square)
    );
  }

  /**
   * Returns an array of square coordinates to which a king can pseudo legally
   * move from the given square.
   *
   * If the given square is empty, an empty array is returned. Otherwise
   * the method acts as if the square had a king of the same color as the
   * actual piece in this square.
   *
   * Considers castling rules.
   *
   * @param {string} square Valid string square which has some piece on it.
   * @returns {Array.<string>} Array of string squares to where it is pseudo
   *    legal to move from the given square by a king.
   */
  function getKingPseudoLegalMoves(square) {
    let file = fileFromSquare(square);
    let rank = rankFromSquare(square);
    let piece = position[file][rank];

    if (piece === "ee") return [];

    let moves = [];
    // normal moves
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;

        let f = file - i;
        let r = rank - j;

        if (
          0 <= f &&
          f < 8 &&
          0 <= r &&
          r < 8 &&
          position[f][r][0] !== piece[0]
        )
          moves.push(squareFromFileRank(f, r));
      }
    }

    // castles, not compatible with Fisher random
    if (
      piece[0] === "w" &&
      whiteCastleQueensideAvailable &&
      position[1][0] === "ee" &&
      position[2][0] === "ee" &&
      position[3][0] === "ee"
    )
      moves.push(squareFromFileRank(2, 0));
    if (
      piece[0] === "w" &&
      whiteCastleKingsideAvailable &&
      position[5][0] === "ee" &&
      position[6][0] === "ee"
    )
      moves.push(squareFromFileRank(6, 0));
    if (
      piece[0] === "b" &&
      blackCastleQueensideAvailable &&
      position[1][7] === "ee" &&
      position[2][7] === "ee" &&
      position[3][7] === "ee"
    )
      moves.push(squareFromFileRank(2, 7));
    if (
      piece[0] === "b" &&
      blackCastleKingsideAvailable &&
      position[5][7] === "ee" &&
      position[6][7] === "ee"
    )
      moves.push(squareFromFileRank(6, 7));

    return moves;
  }

  /**
   * Gets FEN string representation of the current board state.
   * @returns {string} FEN string.
   */
  function getFEN() {
    let result = "";

    result += getFENPieces();
    result += " ";
    result += activeColor;
    result += " ";
    result += getFENCastling();
    result += " ";
    result += twoSquarePawnMove;
    result += " ";
    result += numberOfHalfMoves;
    result += " ";
    result += numberOfFullMoves;

    return result;
  }

  /**
   * Gets part of FEN string concerning the pieces.
   * @returns {string} Part of FEN string.
   */
  function getFENPieces() {
    let result = "";
    for (let rank = 7; rank >= 0; rank--) {
      let emptySquareCounter = 0;
      for (let file = 0; file < 8; file++) {
        let piece = position[file][rank];

        if (piece !== "ee" && emptySquareCounter > 0) {
          result += emptySquareCounter;
          emptySquareCounter = 0;
        }

        switch (piece) {
          case "wp":
            result += "P";
            break;
          case "wr":
            result += "R";
            break;
          case "wn":
            result += "N";
            break;
          case "wb":
            result += "B";
            break;
          case "wq":
            result += "Q";
            break;
          case "wk":
            result += "K";
            break;
          case "bp":
            result += "p";
            break;
          case "br":
            result += "r";
            break;
          case "bn":
            result += "n";
            break;
          case "bb":
            result += "b";
            break;
          case "bq":
            result += "q";
            break;
          case "bk":
            result += "k";
            break;
          case "ee":
            emptySquareCounter++;
        }
      }

      if (emptySquareCounter > 0) result += emptySquareCounter;

      if (rank > 0) result += "/";
    }
    return result;
  }

  /**
   * Gets part of FEN string concerning castling.
   * @returns {string} Part of FEN string.
   */
  function getFENCastling() {
    let result = "";

    if (whiteCastleKingsideAvailable) result += "K";
    if (whiteCastleQueensideAvailable) result += "Q";
    if (blackCastleKingsideAvailable) result += "k";
    if (blackCastleQueensideAvailable) result += "q";

    if (result === "") result = "-";

    return result;
  }

  return {
    _initialize,
    getActivePlayer,
    squareHasPieceOfActivePlayer,
    getPieceOnSquare,
    getLegalMoves,
    playLegalMove,
    playPseudoLegalMove,
    kingIsInCheck,
    isCheckmate,
    isStalemate,
    getFEN,
  };
}
