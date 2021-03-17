export enum TableColumnAlign {
  Right = 'right',
  Left = 'left',
  Center = 'center',
  Justify = 'justify',
  Inherit = 'inherit',
}

export type TableColumn = {
  id: string,
  label: string,
  minWidth: number,
  align?: TableColumnAlign,
  format?: (value: string | number) => string,
};

export type UserHistoryItem = {
  date: string,
  score: number,
};

export type GetUsersFetchResult = {
  userName: string,
  history: Array<UserHistoryItem>,
};

export type PrintResultRow = {
  userName: string,
  date?: string,
  score?: number,
  count?: number,
};
