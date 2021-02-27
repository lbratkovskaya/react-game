import React, { Component } from 'react';
import { Ball } from '../../types';
import { findPathToTarget, transformStateToMatrix } from '../../utils';
import { COLORS } from '../../utils/constants';
import './index.scss';

interface GameFieldProps {
  fieldSize: number,
  gameFieldState: number[][],
  moveBallToNewCell: (ball: Ball, targetRow: number, targetColumn: number) => void,
}

interface GameFieldState {
  currentActive: Ball,
}

export default class GameField extends Component<GameFieldProps, GameFieldState> {
  constructor(props: GameFieldProps) {
    super(props);
    this.state = {
      currentActive: null,
    };
  }

  onBallClickHandler = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    rowIndex: number,
    cellIndex: number,
    colorCode: number
  ): void => {
    document.querySelectorAll('.jumping').forEach((elem) => elem.classList.remove('jumping'));
    (event.target as HTMLImageElement).classList.add('jumping');
    this.setState(() => ({
      currentActive: {
        row: rowIndex,
        column: cellIndex,
        colorIndex: colorCode,
      }
    }));
    event.stopPropagation();
  }

  onCellClickHandler = (rowIndex: number, cellIndex: number): void => {

    const { moveBallToNewCell } = this.props;
    const { currentActive } = this.state;
    if(!currentActive) {
      return;
    }
    if (this.checkTargetCellAvailable(rowIndex, cellIndex)) {
      moveBallToNewCell(currentActive, rowIndex, cellIndex);
      document.querySelectorAll('.jumping').forEach((elem) => elem.classList.remove('jumping'));
    }
    this.setState({currentActive: null});
  }

  checkTargetCellAvailable = (rowIndex: number, cellIndex: number): boolean => {
    const { gameFieldState, fieldSize } = this.props;
    const { currentActive } = this.state;
    return gameFieldState[rowIndex] && gameFieldState[rowIndex][cellIndex] === 0 
      && findPathToTarget(gameFieldState, fieldSize, [currentActive.row, currentActive.column], [rowIndex,cellIndex]) != null;
  }

  getTableCells = (rowIndex: number): JSX.Element[] => {
    const { gameFieldState, fieldSize } = this.props;
    const result: JSX.Element[] = [];
    for (let i = 0; i < fieldSize; i += 1) {
      const ballCode = gameFieldState[rowIndex] && gameFieldState[rowIndex][i];
      const ball = ballCode > 0 && ballCode || null;
      result.push(<td className="tableCell" key={`${rowIndex.toString()}${i.toString()}`} onClick={() => this.onCellClickHandler(rowIndex, i)}>
        {
          ball !== null && (<img className="ball-image" src={`./img/${COLORS[ball - 1]}`} alt="" onClick={(event) => this.onBallClickHandler(event, rowIndex, i, ball)}></img>
          )
        }
      </td>);
    }
    return result;
  };

  getTableRows = (): JSX.Element[] => {
    const { fieldSize } = this.props;
    const result: JSX.Element[] = [];
    for (let i = 0; i < fieldSize; i += 1) {
      result.push(<tr key={`${i.toString()}`}>{this.getTableCells(i)}</tr>);
    }
    return result;
  }
  render() {
    return <table>
      <tbody>
        {this.getTableRows()}
      </tbody>
    </table>
  }
}