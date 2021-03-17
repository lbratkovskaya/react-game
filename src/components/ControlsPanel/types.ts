export interface ControlsPanelProps {
  fieldSize: number,
  ballsCount: number,
  animateMove: boolean,
  playSound: boolean,
  startNewGame: () => void,
  setFieldSize: (event: { target: { value: number } }) => void,
  setNextBallsSize: (event: { target: { value: number } }) => void,
  toggleAnimateMove: () => void,
  togglePlaySound: () => void,
}
