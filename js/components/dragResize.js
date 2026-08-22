/**
 * Bedrock JSON-UI Studio - Drag, Multi-Drag, Resize & Marquee Engine
 */

import { snap } from '../core/geometry.js';

export class DragResizeEngine {
  constructor(state) {
    this.state = state;
    this.viewport = document.getElementById('viewport');
    this.canvas = document.getElementById('canvas-wrapper');
    this.workspace = document.getElementById('button-workspace');

    this.initEventListeners();
  }

  initEventListeners() {
    this.workspace.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    this.viewport.addEventListener('pointerdown', (e) => {
      if (e.target === this.viewport) {
        this.state.clearSelection();
      }
    });
  }

  handlePointerDown(e) {
    const targetHandle = e.target.closest('.resize-handle');
    const targetElement = e.target.closest('.ui-element');

    if (targetHandle) {
      e.stopPropagation();
      this.startResize(e, targetHandle);
      return;
    }

    if (targetElement) {
      e.stopPropagation();
      this.startDrag(e, targetElement);
      return;
    }

    // Clicked empty canvas area -> Marquee selection
    this.startMarquee(e);
  }

  startResize(e, handle) {
    const elId = handle.dataset.elementId;
    const dir = handle.dataset.dir;
    const targetEl = this.state.elements.find(item => item.id === elId);
    if (!targetEl) return;

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const origX = targetEl.x;
    const origY = targetEl.y;
    const origW = targetEl.w;
    const origH = targetEl.h;

    const { zoomScale, gridSize, gridSnap } = this.state.project;

    const onMove = (moveEv) => {
      const deltaX = (moveEv.clientX - startMouseX) / zoomScale;
      const deltaY = (moveEv.clientY - startMouseY) / zoomScale;

      let nextX = origX;
      let nextY = origY;
      let nextW = origW;
      let nextH = origH;

      const minDim = 8;

      if (dir.includes('e')) nextW = Math.max(minDim, snap(origW + deltaX, gridSize, gridSnap));
      if (dir.includes('s')) nextH = Math.max(minDim, snap(origH + deltaY, gridSize, gridSnap));
      if (dir.includes('w')) {
        const snappedW = Math.max(minDim, snap(origW - deltaX, gridSize, gridSnap));
        nextX = origX + (origW - snappedW);
        nextW = snappedW;
      }
      if (dir.includes('n')) {
        const snappedH = Math.max(minDim, snap(origH - deltaY, gridSize, gridSnap));
        nextY = origY + (origH - snappedH);
        nextH = snappedH;
      }

      this.state.updateElement(elId, { x: nextX, y: nextY, w: nextW, h: nextH }, false);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      this.state.saveSnapshot();
      this.state.notify('resize_end');
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  startDrag(e, elementNode) {
    const id = elementNode.dataset.id;
    const isMultiKey = e.shiftKey || e.ctrlKey || e.metaKey;

    if (isMultiKey) {
      this.state.selectElement(id, true);
    } else {
      if (!this.state.selectedIds.includes(id)) {
        this.state.selectElement(id, false);
      }
    }

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const { zoomScale, gridSize, gridSnap, dialogWidth, dialogHeight } = this.state.project;

    const initialPosMap = new Map();
    this.state.selectedIds.forEach(selId => {
      const el = this.state.elements.find(item => item.id === selId);
      if (el) initialPosMap.set(selId, { x: el.x, y: el.y, w: el.w, h: el.h });
    });

    let hasMoved = false;

    const onMove = (moveEv) => {
      const deltaX = (moveEv.clientX - startMouseX) / zoomScale;
      const deltaY = (moveEv.clientY - startMouseY) / zoomScale;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        hasMoved = true;
      }

      this.state.selectedIds.forEach(selId => {
        const init = initialPosMap.get(selId);
        if (init) {
          let nextX = snap(init.x + deltaX, gridSize, gridSnap);
          let nextY = snap(init.y + deltaY, gridSize, gridSnap);

          // Constrain within canvas bounds
          nextX = Math.max(0, Math.min(dialogWidth - init.w, nextX));
          nextY = Math.max(0, Math.min(dialogHeight - init.h, nextY));

          this.state.updateElement(selId, { x: nextX, y: nextY }, false);
        }
      });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (hasMoved) {
        this.state.saveSnapshot();
        this.state.notify('drag_end');
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  startMarquee(e) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const { zoomScale } = this.state.project;

    const startX = (e.clientX - canvasRect.left) / zoomScale;
    const startY = (e.clientY - canvasRect.top) / zoomScale;

    let selectionBox = document.getElementById('selection-box');
    if (!selectionBox) {
      selectionBox = document.createElement('div');
      selectionBox.id = 'selection-box';
      this.canvas.appendChild(selectionBox);
    }

    selectionBox.style.display = 'block';
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';

    const onMove = (moveEv) => {
      const currentX = (moveEv.clientX - canvasRect.left) / zoomScale;
      const currentY = (moveEv.clientY - canvasRect.top) / zoomScale;

      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      selectionBox.style.left = `${left}px`;
      selectionBox.style.top = `${top}px`;
      selectionBox.style.width = `${width}px`;
      selectionBox.style.height = `${height}px`;

      // Find overlapping elements
      const selected = this.state.elements.filter(el => {
        return (
          el.x < left + width &&
          el.x + el.w > left &&
          el.y < top + height &&
          el.y + el.h > top
        );
      }).map(e => e.id);

      this.state.setSelection(selected);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      selectionBox.style.display = 'none';
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
}
