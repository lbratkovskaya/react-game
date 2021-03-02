export const COLORS = ["green.png", "blue.png", "pink.png", "yellow.png", "brown.png", "red.png", "navy.png"];

export const DEFAULT_FIELD_SIZE = 9;

export const DEFAULT_BALLS_COUNT = 3;

export const SCORE_BY_LINE_LENGTH: {
  [key: string]: number
} = {
  '5': 10,
  '6': 12,
  '7': 18,
  '8': 28,
  '9': 42,
  '10': 58,
  '11': 72,
  '12': 88,
  '13': 102,
  '14': 118,
  '15': 132,
  '16': 148,
  '17': 162,
  '18': 178,
  '19': 192,
  '20': 206,
};

export const STORAGE_GAME_STATE_KEY = 'gameState';

export const MAX_SCORE_HEIGHT = 250;