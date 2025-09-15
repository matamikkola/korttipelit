import React, { useState, useEffect } from 'react';
import PlayerDeck from './PlayerDeck';
import panssarivaunutData from '../data/panssarivaunut.json';
import urheiluautotData from '../data/urheiluautot.json';
import type { CardData, Theme } from '../types';
import './Game.css';

interface GameProps {
  theme: Theme;
}

const Game: React.FC<GameProps> = ({ theme }) => {
  const [humanDeck, setHumanDeck] = useState<CardData[]>([]);
  const [aiDeck, setAiDeck] = useState<CardData[]>([]);
  const [turn, setTurn] = useState<'human' | 'ai' | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [isAiCardFaceDown, setIsAiCardFaceDown] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const data =
      theme === 'panssarivaunut' ? panssarivaunutData : urheiluautotData;
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setHumanDeck(shuffled.slice(0, shuffled.length / 2));
    setAiDeck(shuffled.slice(shuffled.length / 2));
    setTurn(Math.random() < 0.5 ? 'human' : 'ai');
    setIsAiCardFaceDown(true);
    setGameOver(false);
    setRoundResult(null);
  }, [theme]);

  const aiTurn = (aiProperty: string) => {
    setSelectedProperty(aiProperty);
    setIsAiCardFaceDown(false);
    setTimeout(() => {
      compareCards(aiProperty);
    }, 3000);
  };

  useEffect(() => {
    if (turn === 'ai' && !gameOver && aiDeck.length > 0) {
      const aiCard = aiDeck[0];
      if (!aiCard) return;

      setIsAiCardFaceDown(false); // Show AI card immediately on its turn
      const properties = Object.keys(aiCard.ominaisuudet);
      const randomProperty =
        properties[Math.floor(Math.random() * properties.length)];

      // AI "thinks" for a moment, then reveals its choice by highlighting it
      setTimeout(() => {
        setSelectedProperty(randomProperty);
        // Then, after another delay, compare cards
        setTimeout(() => {
          compareCards(randomProperty);
        }, 2000); // This is part of the 3s total delay
      }, 1000);
    } else if (turn === 'human') {
      // When it becomes human's turn, make sure AI card is face down
      setIsAiCardFaceDown(true);
      setSelectedProperty(null); // Clear previous selection
    }
  }, [turn, aiDeck, gameOver]);

  const handlePropertyClick = (property: string) => {
    // Allow selection only if it's human's turn and no property is currently selected for comparison
    if (turn !== 'human' || selectedProperty) return;

    setSelectedProperty(property);
    setIsAiCardFaceDown(false); // Reveal AI card

    setTimeout(() => {
      compareCards(property);
    }, 3000);
  };

  const compareCards = (property: string) => {
    const humanCard = humanDeck[0];
    const aiCard = aiDeck[0];
    const humanValue = humanCard.ominaisuudet[property];
    const aiValue = aiCard.ominaisuudet[property];

    let resultText = '';
    let winner: 'human' | 'ai' | 'draw' = 'draw';

    if (humanValue > aiValue) {
      resultText = 'Voitit kierroksen!';
      winner = 'human';
    } else if (aiValue > humanValue) {
      resultText = 'Hävisit kierroksen!';
      winner = 'ai';
    } else {
      resultText = 'Tasapeli!';
    }
    setRoundResult(resultText);

    setTimeout(() => {
      updateDecks(winner);
      setRoundResult(null);
      setSelectedProperty(null);
      setIsAiCardFaceDown(true);
      if (winner !== 'draw') {
        setTurn(winner);
      }
    }, 3000);
  };

  const updateDecks = (winner: 'human' | 'ai' | 'draw') => {
    const humanCard = humanDeck[0];
    const aiCard = aiDeck[0];
    const newHumanDeck = [...humanDeck.slice(1)];
    const newAiDeck = [...aiDeck.slice(1)];

    if (winner === 'human') {
      setHumanDeck([...newHumanDeck, humanCard, aiCard]);
      setAiDeck(newAiDeck);
    } else if (winner === 'ai') {
      setAiDeck([...newAiDeck, aiCard, humanCard]);
      setHumanDeck(newHumanDeck);
    } else {
      setHumanDeck([...newHumanDeck, humanCard]);
      setAiDeck([...newAiDeck, aiCard]);
    }

    if (newAiDeck.length === 0 || newHumanDeck.length === 0) {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className='game-over'>
        <h1>{humanDeck.length === 0 ? 'Hävisit pelin!' : 'Voitit pelin!'}</h1>
        <button onClick={() => window.location.reload()}>
          Pelaa uudestaan
        </button>
      </div>
    );
  }

  return (
    <div className='game-container'>
      <PlayerDeck
        cards={humanDeck}
        playerType='human'
        isAiCardFaceDown={false}
        onPropertyClick={handlePropertyClick}
        selectedProperty={selectedProperty}
        theme={theme}
        isHumanTurn={turn === 'human' && !selectedProperty}
      />
      <div className='round-result'>{roundResult}</div>
      <PlayerDeck
        cards={aiDeck}
        playerType='ai'
        isAiCardFaceDown={isAiCardFaceDown}
        onPropertyClick={() => {}} // AI doesn't click
        selectedProperty={selectedProperty}
        theme={theme}
        isHumanTurn={false}
      />
    </div>
  );
};

export default Game;
