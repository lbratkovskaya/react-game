export const COLORS = ["green.png", "blue.png", "pink.png", "yellow.png", "brown.png", "red.png", "navy.png"];

export const DEFAULT_FIELD_SIZE = 9;

export const DEFAULT_BALLS_COUNT = 3;

export const SCORE_BY_LINE_LENGTH: {
  [key: string]: number
} = {
  '9': 42,
  '8': 28,
  '7': 18,
  '6': 12,
  '5': 10,
};

export const STORAGE_GAME_STATE_KEY = 'gameState';