import React, { Component, RefObject } from 'react';
import { Ball } from '../../types';
import { findPathToTarget, transformStateToMatrix } from '../../utils';
import { COLORS } from '../../utils/constants';
import './index.scss';

interface GameFieldProps {
  fieldSize: number,
  gameFieldState: number[][],
  playSound: boolean,
  moveBallToNewCell: (ball: Ball, targetRow: number, targetColumn: number, path: [number, number][]) => void,
}

interface GameFieldState {
  currentActive: Ball,
}

export default class GameField extends Component<GameFieldProps, GameFieldState> {
  timerId: NodeJS.Timeout;

  audioRef: RefObject<HTMLAudioElement>;

  constructor(props: GameFieldProps) {
    super(props);
    this.state = {
      currentActive: null,
    };
    this.audioRef = React.createRef();
  }

  onBallClickHandler = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    rowIndex: number,
    cellIndex: number,
    colorCode: number
  ): void => {
    document.querySelectorAll('.jumping').forEach((elem) => elem.classList.remove('jumping'));
    (event.target as HTMLImageElement).classList.add('jumping');
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.playSound();

    this.timerId = setInterval(() => {
      this.playSound()
    }, 1000);

    this.setState(() => ({
      currentActive: {
        row: rowIndex,
        column: cellIndex,
        colorIndex: colorCode,
      }
    }));
    event.stopPropagation();
  }

  playSound = (): void => {
    const { playSound } = this.props;
    if (!playSound) {
      return;
    }
    const playPromise = this.audioRef.current?.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        //do play sound
      }).catch(function (error) {
      });
    }
  }

  onCellClickHandler = (rowIndex: number, cellIndex: number): void => {
    const { moveBallToNewCell } = this.props;
    const { currentActive } = this.state;
    if (!currentActive) {
      return;
    }
    const path = this.checkTargetCellAvailable(rowIndex, cellIndex);
    if (path != null) {
      moveBallToNewCell(currentActive, rowIndex, cellIndex, path);
      document.querySelectorAll('.jumping').forEach((elem) => elem.classList.remove('jumping'));
      clearInterval(this.timerId);
    }
    this.setState({ currentActive: null });
  }

  checkTargetCellAvailable = (rowIndex: number, cellIndex: number): [number, number][] => {
    const { gameFieldState, fieldSize } = this.props;
    const { currentActive } = this.state;
    return gameFieldState[rowIndex] && gameFieldState[rowIndex][cellIndex] === 0
      && findPathToTarget(gameFieldState, fieldSize, [currentActive.row, currentActive.column], [rowIndex, cellIndex]);
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
    const { fieldSize } = this.props;
    return (
      <>
        <table className={`game-table game-table-${fieldSize}`}>
          <tbody>
            {this.getTableRows()}
          </tbody>
        </table>
        <audio ref={this.audioRef} id="music2" src="./sound/soccer-ball-bounce-grass_fyhd2tnu.mp3"></audio>
      </>
    );
  }
}