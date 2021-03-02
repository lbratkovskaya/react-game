import React, { Component, ComponentProps } from 'react';
import { Button, Checkbox, FormControlLabel, IconButton } from '@material-ui/core';
import GameField from '../GameField';
import UpperPanel from '../UpperPanel';
import OptionsSelect from './OptionsSelect';
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
import './index.scss';
import { VolumeOffOutlined, VolumeUpOutlined } from '@material-ui/icons';

interface AppState {
  nextBalls: number[],
  gameArea: number[][],
  fieldSize: number,
  ballsCount: number,
  currentScore: number,
  playSound: boolean,
  animateMove: boolean,
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
      playSound: true,
      animateMove: true,
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
    const { fieldSize, ballsCount, nextBalls } = this.state;
    const gameAreaWithAdditionalBalls = generateGameFieldState(fieldSize, ballsCount, currGameArea, nextBalls);
    const newNextBalls = generateNextColors(ballsCount);
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

  doMoveToXY = (ball: Ball, path: [number, number][], currentIndex: number): void => {
    const { gameArea } = this.state;
    const newGameArea = [...gameArea];
    newGameArea[ball.row][ball.column] = 0;
    const row = path[currentIndex][0];
    const column = path[currentIndex][1];
    newGameArea[row][column] = ball.colorIndex;
    this.setState(() => ({ gameArea: newGameArea }), () => {
      if (currentIndex < path.length - 1) {
        setTimeout(() => {
          this.doMoveToXY({
            row,
            column,
            colorIndex: ball.colorIndex,
          }, path, currentIndex + 1);
        }, 70);
      } else {
        setTimeout(() => {
          this.finishMove();
        }, 70);
      }
    });
  }

  finishMove = (): void => {
    const { gameArea, fieldSize } = this.state;
    const newGameArea = [...gameArea];
    const resultPath: [number, number][] = checkForScore(fieldSize, newGameArea);
    if (resultPath.length === 0) {
      this.updateCurrentBalls(newGameArea);
    }
    else {
      this.updateCurrentScore(newGameArea, resultPath);
    }
  }

  moveBallToNewCell = (ball: Ball, row: number, column: number, path: [number, number][]) => {
    const { gameArea, fieldSize, animateMove } = this.state;
    if (animateMove) {
      this.doMoveToXY(ball, path, 0);
    } else {
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
  }

  startNewGame = (): void => {
    const { fieldSize, ballsCount } = this.state;
    const startState = generateGameFieldState(fieldSize, ballsCount, []);
    const nextBallsColors = generateNextColors(ballsCount);
    const currentScore = 0;
    this.setState({
      nextBalls: nextBallsColors,
      gameArea: startState,
      currentScore,
    });
  }

  removeBalls = (currentGameArea: number[][], resultPath: [number, number][]): number[][] => {
    const newGameArea = [...currentGameArea];
    resultPath.forEach(([row, column]) => {
      newGameArea[row][column] = 0;
    });
    return newGameArea;
  }

  setFieldSize = (event: { target: { value: number } }): void => {
    this.setState({ fieldSize: event.target.value }, () => this.startNewGame());
  }

  setNextBallsSize = (event: { target: { value: number } }): void => {
    this.setState({ ballsCount: event.target.value }, () => this.startNewGame());
  }

  togglePlaySound = (): void => {
    this.setState((state) => ({ playSound: !state.playSound }));
  }

  toggleAnimateMove = (): void => {
    this.setState((state) => ({ animateMove: !state.animateMove }));
  }

  render() {
    const {
      nextBalls,
      gameArea,
      currentScore,
      fieldSize,
      ballsCount,
      playSound,
      animateMove,
    } = this.state;
    return (
      <>
        <div className="game-menu">
          <Button title="New Game" onClick={this.startNewGame} variant="outlined">New Game</Button>
          <OptionsSelect
            fieldName="fieldSize"
            fieldTitle="Field Size"
            onSelectValueChange={this.setFieldSize}
            currentValue={fieldSize}
            options={[
              {
                title: '9',
                value: 9,
              },
              {
                title: '13',
                value: 13,
              },
              {
                title: '17',
                value: 17,
              }
            ]} />
          <OptionsSelect
            fieldName="ballSize"
            fieldTitle="Next Balls Size"
            onSelectValueChange={this.setNextBallsSize}
            currentValue={ballsCount}
            options={[
              {
                title: '3',
                value: 3,
              },
              {
                title: '5',
                value: 5,
              },
              {
                title: '7',
                value: 7,
              }
            ]} />
          <FormControlLabel
            control={<Checkbox checked={animateMove} onChange={this.toggleAnimateMove} color="default"/>}
            label="Animate Move"
          />
          <IconButton title="New Game" onClick={this.togglePlaySound}>
            {playSound ? <VolumeOffOutlined /> : <VolumeUpOutlined />}
          </IconButton>
        </div>
        <UpperPanel nextColors={nextBalls} topScore={32767} currentScore={currentScore} />
        <GameField
          playSound={playSound}
          fieldSize={fieldSize}
          gameFieldState={gameArea}
          moveBallToNewCell={this.moveBallToNewCell}
        />
      </>
    );
  }
}

export default App;
