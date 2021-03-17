import React from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@material-ui/core';
import { VolumeOffOutlined, VolumeUpOutlined } from '@material-ui/icons';
import OptionsSelect from '../App/OptionsSelect';
import { ControlsPanelProps } from './types';


export default function ControlsPanel(props: ControlsPanelProps): JSX.Element {
  const {
    fieldSize,
    ballsCount,
    animateMove,
    playSound,
    startNewGame,
    setFieldSize,
    setNextBallsSize,
    toggleAnimateMove,
    togglePlaySound,
  } = props;
  return (
    <div className="game-menu">
      <Button title="New Game" onClick={startNewGame} variant="outlined">New Game</Button>
      <OptionsSelect
        fieldName="fieldSize"
        fieldTitle="Field Size"
        onSelectValueChange={setFieldSize}
        currentValue={fieldSize}
        options={[
          {
            title: '9',
            value: 9,
          },
          {
            title: '13',
            value: 13,
          },
          {
            title: '17',
            value: 17,
          },
        ]
        }
      />
      <OptionsSelect
        fieldName="ballSize"
        fieldTitle="Next Balls Size"
        onSelectValueChange={setNextBallsSize}
        currentValue={ballsCount}
        options={[
          {
            title: '3',
            value: 3,
          },
          {
            title: '5',
            value: 5,
          },
          {
            title: '7',
            value: 7,
          },
        ]
        }
      />
      <FormControlLabel
        control={<Checkbox checked={animateMove} onChange={toggleAnimateMove} color="default" />}
        label="Animate Move"
      />
      <IconButton title={playSound ? 'Volume On' : 'Volume Off'} onClick={togglePlaySound}>
        {playSound ? <VolumeUpOutlined /> : <VolumeOffOutlined />}
      </IconButton>
    </div>
  );
}
