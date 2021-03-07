import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { OptionsSelectProps } from './types';
import './index.scss';

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
