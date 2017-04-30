import {Cell} from './cell';
import {GameField} from './game-field';
import {AliveCell} from './alive-cell';
import {Observable} from 'rxjs';

export class GameOfLife {
  private _field: GameField = new GameField();
  private _cells: Cell[] = this._field.cells;

  constructor() {
  }

  public get aliveCellsObservable(): Observable<AliveCell[]> {
    let aliveCells: AliveCell[] = [];

    for (let cell of this._cells) {
      if (cell.isAlive) {
        let aliveCell: AliveCell = new AliveCell(cell.coordinateX, cell.coordinateY);
        aliveCells.push(aliveCell);
      }
    }

    let aliveCellsObservable: Observable<AliveCell[]> = Observable.of(aliveCells);
    return aliveCellsObservable;
  }

  public checkUpdateField(): void {
    setInterval(() => {
      this.updateCells();
    }, 100);
  }

  public updateCells(): void {
    for (let index = 0; index < this._cells.length; index++) {
      if (this._cells[index].isAlive === true) {
        let isAlive = this.isDieCell(this._cells[index]);
        if (isAlive === false) {
          this._cells[index].toggleLiveState();
        }
      } else {
        let isBorn = this.isBornCell(this._cells[index]);
        if (isBorn === true) {
          this._cells[index].toggleLiveState();
        }
      }
    }
  }

  public toggleCellLiveState(coordinateX: number, coordinateY: number): void {
    let cell: Cell = this._cells.find(c => c.coordinateX === coordinateX && c.coordinateY === coordinateY);
    cell.toggleLiveState();
  }

  private isBornCell(cell: Cell): boolean {
    let adjacentCells: Cell[] = cell.adjacentCells;
    let countAliveCells: number = 0;

    for (let index = 0; index < adjacentCells.length; index++) {
      if (adjacentCells[index].isAlive == true) {
        countAliveCells++;
      }
    }


    if (countAliveCells === 3) {
      return true;
    } else {
      return false;
    }
  }

  private isDieCell(cell: Cell): boolean {
    let adjacentCells: Cell[] = cell.adjacentCells;
    let countAliveCells: number = 0;

    for (let index = 0; index < adjacentCells.length; index++) {
      if (adjacentCells[index].isAlive == true) {
        countAliveCells++;
      }
    }

    if (countAliveCells < 2 && countAliveCells > 3) {
      return false;
    } else {
      return true;
    }
  }
}
