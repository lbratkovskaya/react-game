import { Ball } from "../../types";

export interface GameFieldProps {
  fieldSize: number,
  ballsCount: number,
  gameFieldState: number[][],
  playSound: boolean,
  moveBallToNewCell: (
    ball: Ball,
    targetRow: number,
    targetColumn: number,
    path: [number, number][],
  ) => void,
}

export interface GameFieldState {
  currentActive: Ball,
  imagesLoaded: boolean,
}
