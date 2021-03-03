import React, { useState } from 'react';
import API from '../../utils/API';

interface FinishGameProps {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    API.put('api/save_score',
      {
        userName,
        score,
        date: new Date(),
      }, {
      withCredentials: true,
    }).then((res) => {
      if (res.status === 200) {
        closeForm();
      }
    });

  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type your name:
          <input type="text" value={userName} onChange={handleChange} />
      </label>
      <input type="submit" className="submit-button" value="OK" />
    </form>
  );
}
