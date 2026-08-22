/**
 * Bedrock JSON-UI Studio - Geometry & Alignment Engine
 */

/**
 * Snaps a numeric value to the nearest grid step
 * @param {number} val 
 * @param {number} gridSize 
 * @param {boolean} enabled 
 * @returns {number}
 */
export function snap(val, gridSize = 10, enabled = true) {
  if (!enabled || gridSize <= 1) return Math.round(val * 2) / 2; // Support 0.5px float precision
  return Math.round(val / gridSize) * gridSize;
}

/**
 * Computes the union bounding box of a list of elements
 * @param {Array} elements 
 * @returns {{minX: number, minY: number, maxX: number, maxY: number, width: number, height: number}}
 */
export function getBoundingBox(elements) {
  if (!elements || elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach(el => {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.w);
    maxY = Math.max(maxY, el.y + el.h);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Aligns selected elements along an axis
 * @param {Array} elements All elements
 * @param {Array} selectedIds Selected IDs
 * @param {string} alignment 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
 * @returns {Array} Updated elements array
 */
export function alignElements(elements, selectedIds, alignment) {
  if (selectedIds.length <= 1) return elements;

  const selected = elements.filter(e => selectedIds.includes(e.id));
  const bounds = getBoundingBox(selected);

  return elements.map(el => {
    if (!selectedIds.includes(el.id)) return el;
    const clone = { ...el };

    switch (alignment) {
      case 'left':
        clone.x = bounds.minX;
        break;
      case 'center':
        clone.x = bounds.minX + (bounds.width - clone.w) / 2;
        break;
      case 'right':
        clone.x = bounds.maxX - clone.w;
        break;
      case 'top':
        clone.y = bounds.minY;
        break;
      case 'middle':
        clone.y = bounds.minY + (bounds.height - clone.h) / 2;
        break;
      case 'bottom':
        clone.y = bounds.maxY - clone.h;
        break;
    }

    return clone;
  });
}

/**
 * Distributes selected elements evenly along an axis
 * @param {Array} elements 
 * @param {Array} selectedIds 
 * @param {'horizontal' | 'vertical'} direction 
 * @returns {Array}
 */
export function distributeElements(elements, selectedIds, direction) {
  if (selectedIds.length <= 2) return elements;

  const selected = elements.filter(e => selectedIds.includes(e.id));
  
  if (direction === 'horizontal') {
    selected.sort((a, b) => a.x - b.x);
    const first = selected[0];
    const last = selected[selected.length - 1];
    const totalW = selected.reduce((sum, e) => sum + e.w, 0);
    const availableSpace = (last.x + last.w) - first.x - totalW;
    const gap = availableSpace / (selected.length - 1);

    let currentX = first.x;
    const posMap = new Map();
    selected.forEach(el => {
      posMap.set(el.id, currentX);
      currentX += el.w + gap;
    });

    return elements.map(el => {
      if (posMap.has(el.id)) {
        return { ...el, x: Math.round(posMap.get(el.id)) };
      }
      return el;
    });
  } else {
    selected.sort((a, b) => a.y - b.y);
    const first = selected[0];
    const last = selected[selected.length - 1];
    const totalH = selected.reduce((sum, e) => sum + e.h, 0);
    const availableSpace = (last.y + last.h) - first.y - totalH;
    const gap = availableSpace / (selected.length - 1);

    let currentY = first.y;
    const posMap = new Map();
    selected.forEach(el => {
      posMap.set(el.id, currentY);
      currentY += el.h + gap;
    });

    return elements.map(el => {
      if (posMap.has(el.id)) {
        return { ...el, y: Math.round(posMap.get(el.id)) };
      }
      return el;
    });
  }
}
