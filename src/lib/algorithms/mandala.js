// Mandala / Geometric Coloring Generator Algorithm
export function generateMandalaElements(folds = 8, complexity = 4, seed = 1) {
  const elements = [];
  const layers = complexity + 3;

  for (let layer = 1; layer <= layers; layer++) {
    const radius = layer * 28;
    const type = (layer + seed) % 4;

    elements.push({
      type: 'ring',
      radius,
      strokeWidth: 2,
    });

    if (type === 0) {
      elements.push({
        type: 'petals',
        folds,
        radius,
        petalRadius: 12 + (layer % 3) * 6,
      });
    } else if (type === 1) {
      elements.push({
        type: 'star',
        folds: folds * 2,
        innerRadius: radius - 15,
        outerRadius: radius + 15,
      });
    } else if (type === 2) {
      elements.push({
        type: 'scallops',
        folds: folds,
        baseRadius: radius,
        amplitude: 14,
      });
    } else {
      elements.push({
        type: 'spokes',
        folds: folds * 2,
        innerRadius: radius - 20,
        outerRadius: radius,
      });
    }
  }

  return elements;
}
