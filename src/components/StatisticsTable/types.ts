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
