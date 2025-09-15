import React, { useState } from 'react';
import Game from './components/Game';
import type { Theme } from './types';
import './App.css';

const App: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  if (!selectedTheme) {
    return (
      <div className="theme-selection">
        <h1>Valitse pelin teema</h1>
        <button onClick={() => setSelectedTheme('panssarivaunut')}>
          Panssarivaunut
        </button>
        <button onClick={() => setSelectedTheme('urheiluautot')}>
          Urheiluautot
        </button>
      </div>
    );
  }

  return <Game theme={selectedTheme} />;
};

export default App;

