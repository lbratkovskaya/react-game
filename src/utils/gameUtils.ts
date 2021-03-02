import {
  COLORS,
  STORAGE_GAME_STATE_KEY,
  DEFAULT_FIELD_SIZE,
  DEFAULT_BALLS_COUNT,
} from '.';
import { Ball } from '../types';

export const generateColorIndex = (): number => {
  return Math.floor(Math.random() * COLORS.length) % COLORS.length + 1;
};

export const generateNextColors = (size: number): number[] => {
  const arr = new Array(size);
  arr.fill(0);
  return arr.map(() => generateColorIndex());
};

const generateCoordinates = (fieldSize: number): { row: number, column: number } => {
  const row = Math.floor(Math.random() * fieldSize);
  const column = Math.floor(Math.random() * fieldSize);

  return { row, column };
}

const getZerosMatrix = (fieldSize: number): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < fieldSize; i += 1) {
    const row = new Array(fieldSize);
    row.fill(0);
    result.push(row);
  }
  return result;
}

export const getStartGameFieldState = (): number[][] => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage) {
    return stateFromStorage.matrix;
  }
  return generateGameFieldState(DEFAULT_FIELD_SIZE, DEFAULT_BALLS_COUNT, []);
}

export const getStartNextColorsSet = (): number[] => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage) {
    return stateFromStorage.next;
  }
  return generateNextColors(DEFAULT_BALLS_COUNT);
}

export const getStoredScore = (): number => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage) {
    return stateFromStorage.score;
  }
  return 0;
}

export const getStoredTopScore = (): number => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage && stateFromStorage.topScore) {
    return stateFromStorage.topScore;
  }
  return 500;
}

export const getStoredSoundSettings = (): boolean => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage && stateFromStorage.playSound !== undefined) {
    return stateFromStorage.playSound;
  }
  return true;
} 

export const getStoredAnimateSettings = (): boolean => {
  const stateFromStorage = readFromLocalStorage();
  if (stateFromStorage && stateFromStorage.animateMove !== undefined) {
    return stateFromStorage.animateMove;
  }
  return true;
} 

export const generateGameFieldState = (
  fieldSize: number,
  count: number,
  currentFieldState: number[][],
  colors?: number[],
): number[][] => {

  const result: number[][] = (currentFieldState.length === 0) ? getZerosMatrix(fieldSize) : [...currentFieldState];
  for (let i = 0; i < count; i += 1) {
    let coordinates: { row: number, column: number } = generateCoordinates(fieldSize);
    while (result[coordinates.row][coordinates.column] > 0) {
      coordinates = generateCoordinates(fieldSize);
    }
    const colorIndex = colors ? colors[i] : generateColorIndex();
    result[coordinates.row][coordinates.column] = colorIndex;
  }
  return result;
};

const MAX_INT = 32767;

const processPath = (
  currentX: number,
  currentY: number,
  matrix: number[][],
  path: [number, number][]
): [number, number][] => {
  path.unshift([currentX, currentY]);

  const currentMark = matrix[currentX][currentY];

  if (currentMark === 0) {
    return path;
  }

  const tupleToNext = [[0, -1], [-1, 0], [0, 1], [1, 0]].find((tuple) => {
    const nextX = currentX + tuple[0];
    const nextY = currentY + tuple[1];

    return isInMatrixBounds(nextX, nextY, matrix.length) && matrix[nextX][nextY] === currentMark - 1;
  });

  const nextX = currentX + tupleToNext[0];
  const nextY = currentY + tupleToNext[1];



  return processPath(nextX, nextY, matrix, path);
}

const isInMatrixBounds = (x: number, y: number, matrixLength: number): boolean => {
  return x >= 0 && y >= 0 && x < matrixLength && y < matrixLength;
}

const processNodes = (
  startX: number,
  startY: number,
  matrix: number[][],
  targetPosition: [number, number],
): [number, number][] => {
  const queue: { x: number, y: number, mark: number }[] = [];
  let currentMark = 0;
  queue.push({ x: startX, y: startY, mark: currentMark });

  while (queue.length > 0) {
    const currentNode: { x: number, y: number, mark: number } = queue.shift();

    const currentX = currentNode.x;
    const currentY = currentNode.y;
    currentMark = currentNode.mark;
    matrix[currentX][currentY] = currentMark;

    if (currentX === targetPosition[0] && currentY === targetPosition[1]) {
      return processPath(currentX, currentY, matrix, []);
    }

    [[0, -1], [-1, 0], [0, 1], [1, 0]].forEach((tuple) => {
      const nextX = currentX + tuple[0];
      const nextY = currentY + tuple[1];

      if (isInMatrixBounds(nextX, nextY, matrix.length) && matrix[nextX][nextY] === null) {
        queue.push({ x: nextX, y: nextY, mark: currentMark + 1 });
      }
    });
  }
  return null;
}

export const findPathToTarget = (
  gameAreaState: number[][],
  fieldSize: number,
  fromPosition: [number, number],
  targetPosition: [number, number]
): [number, number][] => {
  // fill array with nulls
  const stateMatrix: number[][] = getZerosMatrix(fieldSize);
  for (let i = 0; i < fieldSize; i += 1) {
    for (let j = 0; j < fieldSize; j += 1) {
      stateMatrix[i][j] = gameAreaState[i][j] > 0 ? MAX_INT : null;
    }
  }

  return processNodes(fromPosition[0], fromPosition[1], stateMatrix, targetPosition);
}

export const transformStateToMatrix = (currentBalls: Ball[], fieldSize: number): number[][] => {
  const result = [];

  for (let i = 0; i < fieldSize; i += 1) {
    const row = [];
    for (let j = 0; j < fieldSize; j += 1) {
      const ball = currentBalls.find((elem) => elem.row === i && elem.column === j);
      row.push(ball && ball.colorIndex || 0);
    }
    result.push(row);
  }

  return result;
}

export const checkForScore = (
  fieldSize: number,
  matrix: number[][]
): [number, number][] => {
  const horResult = checkHorizontal(fieldSize, matrix);
  const vertResult = checkVertical(fieldSize, matrix);
  const diagLRResult = checkDiagonalLeftToRight(fieldSize, matrix);
  const diagRLResult = checkDiagonalRightToLeft(fieldSize, matrix);
  const result: [number, number][] = [].concat(horResult, vertResult, diagLRResult, diagRLResult);
  return result;
}

const checkHorizontal = (fieldSize: number, matrix: number[][]): [number, number][] => {
  let result: [number, number][] = [];
  let tempResult: [number, number][] = [];
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      if (col < fieldSize - 1 && row < fieldSize && matrix[row][col] > 0 && matrix[row][col] == matrix[row][col + 1]) {
        tempResult.push([row, col]);
      } else {
        if (tempResult.length >= 4) {
          tempResult.push([row, col]);
          result = [...result, ...tempResult];
        }
        tempResult = [];
      }
    }
  }
  return uniqueArray(result);
}

const checkVertical = (fieldSize: number, matrix: number[][]): [number, number][] => {
  let result: [number, number][] = [];
  let tempResult: [number, number][] = [];
  for (let col = 0; col < fieldSize; col += 1) {
    for (let row = 0; row < fieldSize; row += 1) {
      if (col < fieldSize && row < fieldSize - 1 && matrix[row][col] > 0 && matrix[row][col] == matrix[row + 1][col]) {
        tempResult.push([row, col]);
      } else {
        if (tempResult.length >= 4) {
          tempResult.push([row, col]);
          result = [...result, ...tempResult];
        }
        tempResult = [];
      }
    }
  }
  return uniqueArray(result);
}

const checkDiagonalLeftToRight = (fieldSize: number, matrix: number[][]): [number, number][] => {
  let result: [number, number][] = [];
  let tempResult: [number, number][] = [];
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      tempResult = [];
      for (let i = 0; i < fieldSize; i += 1) {
        if (col + i < fieldSize - 1 && row + i < fieldSize - 1 && matrix[row + i][col + i] > 0 && matrix[row + i][col + i] == matrix[row + i + 1][col + i + 1]) {
          tempResult.push([row + i, col + i]);
        } else {
          if (tempResult.length >= 4) {
            tempResult.push([row + i, col + i]);
            result = [...result, ...tempResult];
          }
          tempResult = [];
        }
      }
    }
  }
  return uniqueArray(result);
}

const checkDiagonalRightToLeft = (fieldSize: number, matrix: number[][]): [number, number][] => {
  let result: [number, number][] = [];
  let tempResult: [number, number][] = [];
  for (let row = 0; row < fieldSize; row += 1) {
    for (let col = 0; col < fieldSize; col += 1) {
      tempResult = [];
      for (let i = 0; i < fieldSize; i += 1) {
        if (col - i > 0 && row + i < fieldSize - 1 && matrix[row + i][col - i] > 0 && matrix[row + i][col - i] == matrix[row + i + 1][col - i - 1]) {
          tempResult.push([row + i, col - i]);
        } else {
          if (tempResult.length >= 4) {
            tempResult.push([row + i, col - i]);
            result = [...result, ...tempResult];
          }
          tempResult = [];
        }
      }
    }
  }
  return uniqueArray(result);
}

const uniqueArray = (arr: [number, number][]): [number, number][] => {
  const result: [number, number][] = [];
  arr.forEach((elem) => {
    const existing = result.find((el) => el[0] === elem[0] && el[1] === elem[1])
    if (!existing) {
      result.push(elem);
    }
  })
  return result;
}

export const readFromLocalStorage = (): {
  matrix: number[][],
  score: number,
  topScore: number,
  next: number[],
  playSound: boolean,
  animateMove: boolean,
} => {
  const gameStateJSON = localStorage.getItem(STORAGE_GAME_STATE_KEY);
  if (gameStateJSON != null) {
    return JSON.parse(gameStateJSON);
  }
  return null;
}

export const saveToLocalStorage = (
  matrix: number[][],
  score: number,
  topScore: number,
  next: number[],
  playSound: boolean,
  animateMove: boolean,
): void => {
  const gameStateObj = { matrix, score, next, topScore, playSound, animateMove };
  localStorage.setItem(STORAGE_GAME_STATE_KEY, JSON.stringify(gameStateObj));
}

export const gameIsDone = (matrix: number[][], nextBallsSize: number): boolean => {
  const freeCellCount = matrix.reduce((accum, row) => {
    accum += row.reduce((acc, elem) => {
      if (elem === 0) {
        acc += 1
      }
      return acc;
    }, 0);
    return accum;
  }, 0);

  return freeCellCount < nextBallsSize;
}

