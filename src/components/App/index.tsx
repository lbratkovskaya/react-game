import React, { Component, ComponentProps } from 'react';
import { Button } from '@material-ui/core';
import GameField from '../GameField';
import UpperPanel from '../UpperPanel';
import { Ball } from '../../types';
import {
  generateGameFieldState,
  generateNextColors,
  SCORE_BY_LINE_LENGTH,
  checkForScore,
  getStartGameFieldState,
  getStartNextColorsSet,
  getStoredScore,
  saveToLocalStorage,
} from '../../utils';
import FieldSizeSelect from './FieldSizeSelect';

interface AppState {
  nextBalls: number[],
  gameArea: number[][],
  fieldSize: number,
  ballsCount: number,
  currentScore: number,
}

class App extends Component<ComponentProps<'object'>, AppState> {
  constructor(props: ComponentProps<'object'>) {
    super(props);
    const startState = getStartGameFieldState();
    const nextBalls = getStartNextColorsSet();
    const storedScore = getStoredScore();
    this.state = {
      nextBalls,
      gameArea: startState,
      fieldSize: startState.length,
      ballsCount: nextBalls.length,
      currentScore: storedScore,
    };
  }

  componentDidMount(): void {
    window.addEventListener('beforeunload', this.componentGracefulUnmount);
  }

  componentGracefulUnmount = (): void => {
    const { gameArea, currentScore, nextBalls } = this.state;
    saveToLocalStorage(gameArea, currentScore, nextBalls);
  };

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.componentGracefulUnmount);
  }

  updateCurrentBalls = (currGameArea: number[][]): void => {
    const { ballsCount, fieldSize, nextBalls } = this.state;
    const gameAreaWithAdditionalBalls = generateGameFieldState(fieldSize, ballsCount, currGameArea, nextBalls);
    const newNextBalls = generateNextColors();
    const resultPath: [number, number][] = checkForScore(fieldSize, gameAreaWithAdditionalBalls);
    if (resultPath.length === 0) {
      this.setState(() => ({ gameArea: gameAreaWithAdditionalBalls, nextBalls: newNextBalls }));
    }
    else {
      const gameStateArterBallsRemoved = this.removeBalls(gameAreaWithAdditionalBalls, resultPath);
      this.setState(() => ({ gameArea: gameStateArterBallsRemoved, nextBalls: newNextBalls }));
    }
  }

  updateCurrentScore = (currentGameArea: number[][], resultPath: [number, number][]): void => {
    const newGameArea = this.removeBalls(currentGameArea, resultPath);
    const newScore = SCORE_BY_LINE_LENGTH[resultPath.length.toString()];
    this.setState((state) => ({ gameArea: newGameArea, currentScore: state.currentScore + newScore }));
  }

  moveBallToNewCell = (ball: Ball, row: number, column: number) => {
    const { gameArea, fieldSize, } = this.state;
    const newBall = { row, column, colorIndex: ball.colorIndex };
    const newGameArea = [...gameArea];
    newGameArea[ball.row][ball.column] = 0;
    newGameArea[row][column] = ball.colorIndex;
    const resultPath: [number, number][] = checkForScore(fieldSize, newGameArea);
    if (resultPath.length === 0) {
      this.updateCurrentBalls(newGameArea);
    }
    else {
      this.updateCurrentScore(newGameArea, resultPath);
    }
  }

  removeBalls = (currentGameArea: number[][], resultPath: [number, number][]): number[][] => {
    const newGameArea = [...currentGameArea];
    resultPath.forEach(([row, column]) => {
      newGameArea[row][column] = 0;
    });
    return newGameArea;
  }

  render() {
    const { nextBalls, gameArea, currentScore, fieldSize } = this.state;
    return (
      <>
        <UpperPanel nextColors={nextBalls} topScore={32767} currentScore={currentScore} />
        <GameField
          fieldSize={fieldSize}
          gameFieldState={gameArea}
          moveBallToNewCell={this.moveBallToNewCell}
        />
      </>
    );
  }
}

export default App;
