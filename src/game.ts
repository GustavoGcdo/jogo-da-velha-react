export type GameSymbol = 'X' | 'O' | '';
export type Position = { row: number; collumn: number };

export class Game {
  currentPlayer: 'X' | 'O';
  gameSpaces: GameSymbol[][] = [];

  quantityX = 0;
  quantityO = 0;

  constructor() {
    console.log('nova instancia');
    this.currentPlayer = 'X';
    this.reset();
  }

  mark(quadrant: [number, number]) {
    const [row, collumn] = quadrant;
    if (
      (this.currentPlayer == 'X' && this.quantityX == 3) ||
      (this.currentPlayer == 'O' && this.quantityO == 3)
    ) {
      return;
    }

    if (this.currentPlayer == 'X') this.quantityX++;
    else this.quantityO++;

    if (this.gameSpaces[row][collumn] == '') {
      this.gameSpaces[row][collumn] = this.currentPlayer;
      this.nextPlayer();
    }
  }

  move(oldPosition: Position, newPosition: Position) {
    const symbol = this.gameSpaces[oldPosition.row][oldPosition.collumn];
    this.gameSpaces[newPosition.row][newPosition.collumn] = symbol;
    this.gameSpaces[oldPosition.row][oldPosition.collumn] = '';
  }

  private nextPlayer() {
    if (this.currentPlayer == 'X') {
      this.currentPlayer = 'O';
    } else {
      this.currentPlayer = 'X';
    }
  }

  checkPlayerHasWinner(symbol: GameSymbol) {
    if (this.verifyHorizontal(symbol)) return true;
    if (this.verifyVertical(symbol)) return true;
    if (this.verifyDiagonals(symbol)) return true;
    return false;
  }

  private verifyDiagonals(symbol: GameSymbol): boolean {
    const topLeft = this.gameSpaces[0][0];
    const bottomRight = this.gameSpaces[2][2];
    const middle = this.gameSpaces[1][1];
    const topRight = this.gameSpaces[0][2];
    const bottomLeft = this.gameSpaces[2][0];

    const winInLeftDiagonal = topLeft == symbol && middle == symbol && bottomRight == symbol;
    if (winInLeftDiagonal) return true;

    const winInRightDiagonal = topRight == symbol && middle == symbol && bottomLeft == symbol;
    if (winInRightDiagonal) return true;
    return false;
  }

  private verifyVertical(symbol: GameSymbol): boolean {
    for (let collumn = 0; collumn < 3; collumn++) {
      const first = this.gameSpaces[0][collumn];
      const middle = this.gameSpaces[1][collumn];
      const last = this.gameSpaces[2][collumn];

      const winInVertical = first == symbol && middle == symbol && last == symbol;
      if (winInVertical) return true;
    }

    return false;
  }

  private verifyHorizontal(symbol: GameSymbol): boolean {
    for (let line = 0; line < 3; line++) {
      const first = this.gameSpaces[line][0];
      const middle = this.gameSpaces[line][1];
      const last = this.gameSpaces[line][2];

      const winInHorizontal = first == symbol && middle == symbol && last == symbol;
      if (winInHorizontal) return true;
    }
    return false;
  }

  hasWinner() {
    if (this.checkPlayerHasWinner('X')) return true;
    if (this.checkPlayerHasWinner('O')) return true;
    return false;
  }

  hasFinish() {
    if (this.hasWinner()) return true;

    for (let i = 0; i < this.gameSpaces.length; i++) {
      const row = this.gameSpaces[i];

      for (let j = 0; j < row.length; j++) {
        const collumn = row[j];
        if (collumn == '') {
          return false;
        }
      }
    }

    return true;
  }

  reset() {
    this.quantityO = 0;
    this.quantityX = 0;
    this.currentPlayer = 'X';
    this.gameSpaces = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  }
}
