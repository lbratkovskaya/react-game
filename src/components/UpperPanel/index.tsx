import React from 'react';
import { UpperPanelProps } from './types';
import { COLORS } from '../../utils';
import './index.scss';

export default function UpperPanel(props: UpperPanelProps): JSX.Element {
  const { nextColors, topScore, currentScore } = props;

  const getNextColorsRow = (): JSX.Element[] => (
    nextColors.map((color) => (
      <td className="tableCell" key={`${color.toString()}`}>
        <img className="ball-image" src={`./img/${COLORS[color - 1]}`} alt="" />
      </td>
    ))
  );

  return (
    <div className="upperPanel">
      <div className="top-score">
        <span className="score">
          {topScore}
        </span>
      </div>
      <table className="nextColors">
        <tbody>
          <tr>
            {getNextColorsRow()}
          </tr>
        </tbody>
      </table>
      <div className="current-score">
        <span className="score">
          {currentScore}
        </span>
      </div>
    </div>
  );
}
