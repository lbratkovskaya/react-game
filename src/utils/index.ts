import {
  findPathToTarget,
  generateColorIndex,
  generateGameFieldState,
  generateNextColors,
  transformStateToMatrix,
  checkForScore,
  getStartGameFieldState,
  getStoredScore,
  saveToLocalStorage,
  getStartNextColorsSet,
} from './gameUtils';
import {
  COLORS,
  DEFAULT_BALLS_COUNT,
  DEFAULT_FIELD_SIZE,
  SCORE_BY_LINE_LENGTH,
  STORAGE_GAME_STATE_KEY,
} from './constants';

export { 
  findPathToTarget,
  generateColorIndex,
  generateGameFieldState,
  generateNextColors,
  transformStateToMatrix,
  checkForScore,
  getStartGameFieldState,
  getStoredScore,
  saveToLocalStorage,
  getStartNextColorsSet,
  COLORS,
  DEFAULT_BALLS_COUNT,
  DEFAULT_FIELD_SIZE,
  SCORE_BY_LINE_LENGTH,
  STORAGE_GAME_STATE_KEY,
};