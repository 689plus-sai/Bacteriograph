// Katakana 5x5 Grid Data
// Shape Types: 'RECT', 'CIRCLE', 'LINE', 'ARC'
// Grid coordinates: 0-4 (x), 0-4 (y)

export const GRID_SIZE = 5;

export const SHAPE_TYPES = {
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
  LINE: 'LINE',
  ARC: 'ARC',
  TRIANGLE: 'TRIANGLE',
  HEXAGON: 'HEXAGON'
};

// Legacy Grid Data (Kept for reference or random selection logic)
export const KATAKANA_MAP = {
  'ア': [
    { x: 2, y: 0, type: 'RECT' },
    { x: 1, y: 0, type: 'RECT' }, // simplified
    { x: 3, y: 0, type: 'RECT' },
    { x: 2, y: 1, type: 'RECT' },
    { x: 2, y: 2, type: 'RECT' },
    { x: 2, y: 3, type: 'RECT' },
    { x: 1, y: 3, type: 'RECT' },
    { x: 3, y: 3, type: 'RECT' }
  ],
  'イ': [
    { x: 3, y: 0, type: 'RECT' },
    { x: 3, y: 1, type: 'RECT' },
    { x: 3, y: 2, type: 'RECT' },
    { x: 3, y: 3, type: 'RECT' },
    { x: 1, y: 0, type: 'RECT' },
    { x: 1, y: 1, type: 'RECT' }
  ]
  // Add more if needed, but we rely on Vector now.
};

export const getRandomKatakana = () => {
  const keys = Object.keys(KATAKANA_MAP);
  const char = keys[Math.floor(Math.random() * keys.length)];
  return { char, data: KATAKANA_MAP[char] };
};
