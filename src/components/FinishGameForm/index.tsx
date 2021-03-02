import React, { useState } from 'react';
import API from '../../utils/API';

interface FinishGameProps {
  // finalGameState: number[][],
  score: number,
  closeForm: () => void,
}
export default function FinishGameForm(props: FinishGameProps): JSX.Element {
  const [userName, setName] = useState('');

  const { score, closeForm } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputName = event.target.value;
    setName(inputName);
  }

  const handleSubmit = () => {
    API.put('api/save_score',
      {
        userName,
        score,
        date: new Date(),
      }, {
        withCredentials: true,
      }).then(() => {
        closeForm();
    });


  }

  return (
    <div className="glass">
      <form onSubmit={handleSubmit}>
        <label>
          Type your name:
          <input type="text" value={userName} onChange={handleChange} />
        </label>
        <input type="submit" className="submit-button" value="OK" />
      </form>
    </div>
  );
}