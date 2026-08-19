// Word Search Generator Algorithm
export function generateWordSearch(wordsInput, size = 12, allowDiagonal = true) {
  const cleanWords = wordsInput
    .map(w => w.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''))
    .filter(w => w.length > 1 && w.length <= size);

  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords = [];

  const directions = [
    { r: 0, c: 1 },   // Horizontal right
    { r: 1, c: 0 },   // Vertical down
  ];

  if (allowDiagonal) {
    directions.push({ r: 1, c: 1 });   // Diagonal down-right
    directions.push({ r: -1, c: 1 });  // Diagonal up-right
  }

  const sortedWords = [...cleanWords].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      
      const minR = dir.r < 0 ? word.length - 1 : 0;
      const maxR = dir.r > 0 ? size - word.length : size - 1;
      const minC = 0;
      const maxC = size - word.length;

      const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
      const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

      let canPlace = true;
      const path = [];
      for (let i = 0; i < word.length; i++) {
        const currR = startR + i * dir.r;
        const currC = startC + i * dir.c;
        const existing = grid[currR][currC];
        if (existing !== '' && existing !== word[i]) {
          canPlace = false;
          break;
        }
        path.push({ r: currR, c: currC });
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[path[i].r][path[i].c] = word[i];
        }
        placedWords.push({ word, path });
        placed = true;
      }
    }
  }

  const solutionGrid = grid.map(row => [...row]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return {
    grid,
    solutionGrid,
    placedWords,
    missingWords: sortedWords.filter(w => !placedWords.some(pw => pw.word === w))
  };
}
