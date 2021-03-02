import React from 'react';
import { COLORS } from '../../utils';
import './index.scss';

interface UpperPanelProps {
  nextColors: number[],
  topScore: number,
  currentScore: number,
}

export default function UpperPanel(props: UpperPanelProps): JSX.Element {
  const { nextColors, topScore, currentScore } = props;

  const getNextColorsRow = (): JSX.Element[] => {
    return nextColors.map((color, index) => (
      <td className="tableCell" key={`${index.toString()}`}>
        <img className="ball-image" src={`./img/${COLORS[color - 1]}`} alt=""></img>
      </td>
    ));
  }

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
