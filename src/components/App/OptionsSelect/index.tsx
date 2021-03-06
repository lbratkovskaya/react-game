import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import './index.scss';

interface OptionsSelectProps {
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

export default function OptionsSelect(props: OptionsSelectProps): JSX.Element {
  const {
    fieldName,
    fieldTitle,
    options,
    currentValue,
    onSelectValueChange,
  } = props;

  const selectOptions = options.map((opt) => (
    <MenuItem key={opt.value} value={opt.value}>{opt.title}</MenuItem>
  ));

  return (
    <FormControl className="form-control">
      <InputLabel id="label" htmlFor={fieldName}>{fieldTitle}</InputLabel>
      <Select
        labelId="label"
        id={fieldName}
        value={currentValue}
        onChange={onSelectValueChange}
      >
        {selectOptions}
      </Select>
    </FormControl>
  );
}
