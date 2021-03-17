export interface AppState {
  nextBalls: number[],
  gameArea: number[][],
  fieldSize: number,
  ballsCount: number,
  currentScore: number,
  topScore: number,
  playSound: boolean,
  animateMove: boolean,
  gameIsDone: boolean,
  openForm: boolean,
  openStatistics: boolean,
}
