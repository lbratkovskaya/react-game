export interface OptionsSelectProps {
  fieldName: string,
  fieldTitle: string,
  onSelectValueChange: (event: {
    target: {
      value: unknown;
    }
  }) => void,
  currentValue: number,
  options: {
    title: string,
    value: number,
  }[]
}
