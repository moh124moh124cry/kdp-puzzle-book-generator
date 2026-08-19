// Maze Generator (Recursive Backtracker) + BFS Solver
export function generateMaze(width = 15, height = 15) {
  const grid = Array(height).fill(null).map(() =>
    Array(width).fill(null).map(() => ({
      visited: false,
      walls: [true, true, true, true],
    }))
  );

  const stack = [];
  grid[0][0].visited = true;
  stack.push({ r: 0, c: 0 });

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { r, c } = current;

    const neighbors = [];
    if (r > 0 && !grid[r - 1][c].visited) neighbors.push({ r: r - 1, c, dir: 0, opp: 2 });
    if (c < width - 1 && !grid[r][c + 1].visited) neighbors.push({ r, c: c + 1, dir: 1, opp: 3 });
    if (r < height - 1 && !grid[r + 1][c].visited) neighbors.push({ r: r + 1, c, dir: 2, opp: 0 });
    if (c > 0 && !grid[r][c - 1].visited) neighbors.push({ r, c: c - 1, dir: 3, opp: 1 });

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[r][c].walls[next.dir] = false;
      grid[next.r][next.c].walls[next.opp] = false;
      grid[next.r][next.c].visited = true;
      stack.push({ r: next.r, c: next.c });
    } else {
      stack.pop();
    }
  }

  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;

  const queue = [{ r: 0, c: 0, path: [{ r: 0, c: 0 }] }];
  const visitedForSolve = Array(height).fill(null).map(() => Array(width).fill(false));
  visitedForSolve[0][0] = true;
  let solutionPath = [];

  while (queue.length > 0) {
    const { r, c, path } = queue.shift();
    if (r === height - 1 && c === width - 1) {
      solutionPath = path;
      break;
    }

    const cell = grid[r][c];
    const moves = [
      { r: r - 1, c, canMove: !cell.walls[0] },
      { r, c: c + 1, canMove: !cell.walls[1] },
      { r: r + 1, c, canMove: !cell.walls[2] },
      { r, c: c - 1, canMove: !cell.walls[3] },
    ];

    for (const m of moves) {
      if (m.canMove && m.r >= 0 && m.r < height && m.c >= 0 && m.c < width && !visitedForSolve[m.r][m.c]) {
        visitedForSolve[m.r][m.c] = true;
        queue.push({ r: m.r, c: m.c, path: [...path, { r: m.r, c: m.c }] });
      }
    }
  }

  return { grid, width, height, solutionPath };
}
