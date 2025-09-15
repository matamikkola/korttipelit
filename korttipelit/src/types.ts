export interface CardData {
  nimi: string;
  valmistusmaa: string;
  kuva: string;
  ominaisuudet: {
    [key: string]: number;
  };
}

export type Theme = 'panssarivaunut' | 'urheiluautot';
