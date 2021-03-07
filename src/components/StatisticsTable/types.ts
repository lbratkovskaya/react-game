export type TableColumn = {
  id: string,
  label: string,
  minWidth: number,
  align?: 'right' | 'left' | 'center' | 'justify' | 'inherit',
  format?: (value: string | number) => string,
};
