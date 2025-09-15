import React, { useState } from 'react';
import type { CardData } from '../types';
import './Card.css';
import CardBackTank from '../assets/card-back.svg';
import CardBackCar from '../assets/card-back-car.svg';

interface CardProps {
  card: CardData;
  isFaceDown?: boolean;
  onPropertyClick?: (property: string) => void;
  selectedProperty?: string | null; // The property chosen for the round
  theme: 'panssarivaunut' | 'urheiluautot';
  isClickable: boolean;
}

const Card: React.FC<CardProps> = ({ card, isFaceDown, onPropertyClick, selectedProperty, theme, isClickable }) => {
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  if (isFaceDown) {
    const cardBackImage = theme === 'panssarivaunut' ? CardBackTank : CardBackCar;
    return (
      <div className="card face-down">
        <img src={cardBackImage} alt="Card back" className="card-back-image" />
      </div>
    );
  }

  const getPropertyClassName = (key: string) => {
    if (selectedProperty === key) {
      return 'property selected'; // The property chosen for the round
    }
    if (hoveredProperty === key && isClickable) {
      return 'property hovered'; // The property currently being hovered over
    }
    return 'property';
  };

  return (
    <div className="card">
      <h3 className="card-title">
        {card.nimi} <span className="country">({card.valmistusmaa})</span>
      </h3>
      <img src={card.kuva} alt={card.nimi} className="card-image" />
      <div className="properties">
        {Object.entries(card.ominaisuudet).map(([key, value]) => (
          <div
            key={key}
            className={getPropertyClassName(key)}
            onMouseEnter={() => setHoveredProperty(key)}
            onMouseLeave={() => setHoveredProperty(null)}
            onClick={() => {
                if (isClickable && onPropertyClick) {
                    onPropertyClick(key);
                }
            }}
          >
            <span className="property-name">{key.replace(/_/g, ' ')}:</span>
            <span className="property-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
