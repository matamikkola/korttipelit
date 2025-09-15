import React from 'react';
import type { CardData } from '../types';
import Card from './Card';
import './PlayerDeck.css';

interface PlayerDeckProps {
  cards: CardData[];
  playerType: 'human' | 'ai';
  isAiCardFaceDown: boolean;
  onPropertyClick: (property: string) => void;
  selectedProperty: string | null;
  theme: 'panssarivaunut' | 'urheiluautot';
  isHumanTurn: boolean;
}

const PlayerDeck: React.FC<PlayerDeckProps> = ({
  cards,
  playerType,
  isAiCardFaceDown,
  onPropertyClick,
  selectedProperty,
  theme,
  isHumanTurn,
}) => {
  const cardCount = cards.length;
  const topCard = cards[0];

  return (
    <div className={`player-deck ${playerType}`}>
      <h2>{playerType === 'human' ? 'Pelaaja' : 'Tietokone'}</h2>
      <p>Kortteja: {cardCount}</p>
      {topCard && (
        <Card
          card={topCard}
          isFaceDown={playerType === 'ai' && isAiCardFaceDown}
          onPropertyClick={onPropertyClick}
          selectedProperty={selectedProperty}
          theme={theme}
          isClickable={playerType === 'human' && isHumanTurn}
        />
      )}
    </div>
  );
};

export default PlayerDeck;
