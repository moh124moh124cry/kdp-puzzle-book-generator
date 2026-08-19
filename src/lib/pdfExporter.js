import jsPDF from 'jspdf';

// Standard KDP Size: 8.5 x 11 inches (612 x 792 pt)
export function exportSinglePuzzlePDF({ title, type, data, showSolution, pageNumber = 1 }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [612, 792],
  });

  renderPuzzlePage(doc, { title, type, data, showSolution, pageNumber });
  doc.save(`${type}_page_${pageNumber}.pdf`);
}

export function exportFullBookPDF({ title, puzzles, solutions }) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [612, 792],
  });

  // Title Page
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(title.toUpperCase(), 306, 350, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Puzzle & Activity Book', 306, 385, { align: 'center' });
  doc.setFontSize(12);
  doc.text('High-Quality Print Edition - Amazon KDP Ready', 306, 420, { align: 'center' });

  // Puzzles Pages
  puzzles.forEach((p, idx) => {
    doc.addPage([612, 792], 'portrait');
    renderPuzzlePage(doc, {
      title: `${p.title} #${idx + 1}`,
      type: p.type,
      data: p.data,
      showSolution: false,
      pageNumber: idx + 1,
    });
  });

  // Solutions Section Divider
  doc.addPage([612, 792], 'portrait');
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLUTIONS', 306, 396, { align: 'center' });

  // Render 4 mini-solutions per page (2x2 grid)
  const chunkSize = 4;
  for (let i = 0; i < solutions.length; i += chunkSize) {
    doc.addPage([612, 792], 'portrait');
    const chunk = solutions.slice(i, i + chunkSize);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Solutions (Pages ${i + 1} - ${Math.min(i + chunkSize, solutions.length)})`, 306, 50, { align: 'center' });

    chunk.forEach((sol, subIdx) => {
      const col = subIdx % 2;
      const row = Math.floor(subIdx / 2);
      const offsetX = 50 + col * 260;
      const offsetY = 80 + row * 330;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Puzzle #${i + subIdx + 1} (${sol.type})`, offsetX + 120, offsetY + 15, { align: 'center' });

      renderMiniSolution(doc, sol.type, sol.data, offsetX + 10, offsetY + 30, 220, 260);
    });
  }

  doc.save(`${title.replace(/\\s+/g, '_')}_Complete_Book.pdf`);
}

function renderPuzzlePage(doc, { title, type, data, showSolution, pageNumber }) {
  const margin = 40;
  const contentWidth = 612 - margin * 2;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 306, 65, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`- ${pageNumber} -`, 306, 760, { align: 'center' });

  if (type === 'wordsearch') {
    renderWordSearch(doc, data, showSolution, margin, 100, contentWidth);
  } else if (type === 'sudoku') {
    renderSudoku(doc, data, showSolution, margin, 120, contentWidth);
  } else if (type === 'maze') {
    renderMaze(doc, data, showSolution, margin, 100, contentWidth);
  } else if (type === 'mandala') {
    renderMandala(doc, data, 306, 400);
  }
}

function renderWordSearch(doc, data, showSolution, x, y, width) {
  const { grid, solutionGrid, placedWords } = data;
  const size = grid.length;
  const cellSize = Math.min(width / size, 26);
  const startX = (612 - size * cellSize) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(cellSize * 0.6);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cellX = startX + c * cellSize;
      const cellY = y + r * cellSize;
      
      const isSolution = showSolution && solutionGrid[r][c] !== '';
      if (isSolution) {
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(cellX + 1, cellY + 1, cellSize - 2, cellSize - 2, 3, 3, 'F');
      }

      doc.setTextColor(0, 0, 0);
      doc.text(grid[r][c], cellX + cellSize / 2, cellY + cellSize * 0.7, { align: 'center' });
    }
  }

  const listY = y + size * cellSize + 30;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FIND THE WORDS:', 306, listY, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const cols = 3;
  placedWords.forEach((pw, i) => {
    const colIdx = i % cols;
    const rowIdx = Math.floor(i / cols);
    const colX = 120 + colIdx * 140;
    const colY = listY + 22 + rowIdx * 16;
    doc.text(`• ${pw.word}`, colX, colY);
  });
}

function renderSudoku(doc, data, showSolution, x, y, width) {
  const board = showSolution ? data.solution : data.puzzle;
  const gridSize = 360;
  const startX = (612 - gridSize) / 2;
  const cellSize = gridSize / 9;

  doc.setDrawColor(0, 0, 0);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cellX = startX + c * cellSize;
      const cellY = y + r * cellSize;

      doc.setLineWidth(0.5);
      doc.rect(cellX, cellY, cellSize, cellSize);

      const val = board[r][c];
      if (val !== 0) {
        doc.setFontSize(18);
        doc.setFont('helvetica', data.puzzle[r][c] !== 0 ? 'bold' : 'normal');
        doc.text(String(val), cellX + cellSize / 2, cellY + cellSize * 0.7, { align: 'center' });
      }
    }
  }

  doc.setLineWidth(2);
  for (let i = 0; i <= 3; i++) {
    doc.line(startX, y + i * cellSize * 3, startX + gridSize, y + i * cellSize * 3);
    doc.line(startX + i * cellSize * 3, y, startX + i * cellSize * 3, y + gridSize);
  }
}

function renderMaze(doc, data, showSolution, x, y, width) {
  const { grid, width: w, height: h, solutionPath } = data;
  const mazeSize = 420;
  const cellSize = mazeSize / Math.max(w, h);
  const startX = (612 - w * cellSize) / 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const cell = grid[r][c];
      const cx = startX + c * cellSize;
      const cy = y + r * cellSize;

      if (cell.walls[0]) doc.line(cx, cy, cx + cellSize, cy);
      if (cell.walls[1]) doc.line(cx + cellSize, cy, cx + cellSize, cy + cellSize);
      if (cell.walls[2]) doc.line(cx, cy + cellSize, cx + cellSize, cy + cellSize);
      if (cell.walls[3]) doc.line(cx, cy, cx, cy + cellSize);
    }
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('START ➔', startX - 10, y + cellSize * 0.7, { align: 'right' });
  doc.text('➔ GOAL', startX + w * cellSize + 10, y + (h - 0.3) * cellSize);

  if (showSolution && solutionPath && solutionPath.length > 0) {
    doc.setDrawColor(180, 0, 0);
    doc.setLineWidth(2.5);
    for (let i = 0; i < solutionPath.length - 1; i++) {
      const p1 = solutionPath[i];
      const p2 = solutionPath[i + 1];
      doc.line(
        startX + p1.c * cellSize + cellSize / 2,
        y + p1.r * cellSize + cellSize / 2,
        startX + p2.c * cellSize + cellSize / 2,
        y + p2.r * cellSize + cellSize / 2
      );
    }
  }
}

function renderMandala(doc, elements, cx, cy) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);

  elements.forEach(elem => {
    if (elem.type === 'ring') {
      doc.circle(cx, cy, elem.radius);
    } else if (elem.type === 'petals') {
      const angleStep = (Math.PI * 2) / elem.folds;
      for (let i = 0; i < elem.folds; i++) {
        const angle = i * angleStep;
        const px = cx + Math.cos(angle) * elem.radius;
        const py = cy + Math.sin(angle) * elem.radius;
        doc.circle(px, py, elem.petalRadius);
      }
    } else if (elem.type === 'star') {
      const step = Math.PI / elem.folds;
      const points = [];
      for (let i = 0; i < elem.folds * 2; i++) {
        const r = i % 2 === 0 ? elem.outerRadius : elem.innerRadius;
        const a = i * step;
        points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      for (let i = 0; i < points.length; i++) {
        const next = points[(i + 1) % points.length];
        doc.line(points[i].x, points[i].y, next.x, next.y);
      }
    } else if (elem.type === 'scallops') {
      const count = elem.folds * 2;
      const angleStep = (Math.PI * 2) / count;
      for (let i = 0; i < count; i++) {
        const a = i * angleStep;
        const r = elem.baseRadius + (i % 2 === 0 ? elem.amplitude : -elem.amplitude);
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        doc.circle(px, py, 6);
      }
    } else if (elem.type === 'spokes') {
      const step = (Math.PI * 2) / elem.folds;
      for (let i = 0; i < elem.folds; i++) {
        const a = i * step;
        doc.line(
          cx + Math.cos(a) * elem.innerRadius,
          cy + Math.sin(a) * elem.innerRadius,
          cx + Math.cos(a) * elem.outerRadius,
          cy + Math.sin(a) * elem.outerRadius
        );
      }
    }
  });
}

function renderMiniSolution(doc, type, data, x, y, width, height) {
  doc.setDrawColor(150, 150, 150);
  doc.rect(x, y, width, height);

  if (type === 'sudoku') {
    const board = data.solution;
    const cs = width / 9;
    doc.setFontSize(8);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        doc.text(String(board[r][c]), x + c * cs + cs / 2, y + r * cs + cs * 0.75, { align: 'center' });
      }
    }
  } else if (type === 'maze') {
    const { grid, width: w, height: h, solutionPath } = data;
    const cs = width / Math.max(w, h);
    doc.setLineWidth(0.5);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const cell = grid[r][c];
        const cx = x + c * cs;
        const cy = y + r * cs;
        if (cell.walls[0]) doc.line(cx, cy, cx + cs, cy);
        if (cell.walls[1]) doc.line(cx + cs, cy, cx + cs, cy + cs);
        if (cell.walls[2]) doc.line(cx, cy + cs, cx + cs, cy + cs);
        if (cell.walls[3]) doc.line(cx, cy, cx, cy + cs);
      }
    }
    if (solutionPath) {
      doc.setDrawColor(200, 0, 0);
      doc.setLineWidth(1);
      for (let i = 0; i < solutionPath.length - 1; i++) {
        const p1 = solutionPath[i];
        const p2 = solutionPath[i + 1];
        doc.line(x + p1.c * cs + cs / 2, y + p1.r * cs + cs / 2, x + p2.c * cs + cs / 2, y + p2.r * cs + cs / 2);
      }
    }
  } else if (type === 'wordsearch') {
    const { solutionGrid } = data;
    const sz = solutionGrid.length;
    const cs = width / sz;
    doc.setFontSize(6);
    for (let r = 0; r < sz; r++) {
      for (let c = 0; c < sz; c++) {
        if (solutionGrid[r][c] !== '') {
          doc.text(solutionGrid[r][c], x + c * cs + cs / 2, y + r * cs + cs * 0.75, { align: 'center' });
        }
      }
    }
  }
}
