/**
 * Bedrock JSON-UI Studio - Main Application Orchestrator
 */

import { state } from './core/state.js';
import { ViewportComponent } from './components/viewport.js';
import { DragResizeEngine } from './components/dragResize.js';
import { HierarchyTreeComponent } from './components/hierarchyTree.js';
import { PropertyInspectorComponent } from './components/propertyInspector.js';
import { FormSettingsComponent } from './components/formSettings.js';
import { ModalsComponent } from './components/modals.js';
import { alignElements, distributeElements, snap } from './core/geometry.js';
import { copyToClipboard, downloadJsonFile, showToast } from './utils/exporter.js';
import { JsonUiEngine } from './generator/jsonUiEngine.js';

class BedrockStudioApp {
  constructor() {
    this.state = state;

    // Initialize Components
    this.viewport = new ViewportComponent(this.state);
    this.dragResize = new DragResizeEngine(this.state);
    this.hierarchyTree = new HierarchyTreeComponent(this.state);
    this.propertyInspector = new PropertyInspectorComponent(this.state);
    this.formSettings = new FormSettingsComponent(this.state);
    this.modals = new ModalsComponent(this.state);

    this.initGlobalShortcuts();
    this.initToolbar();
  }

  initToolbar() {
    const btnUndo = document.getElementById('btn-undo');
    const btnRedo = document.getElementById('btn-redo');

    const updateUndoRedo = () => {
      if (btnUndo) btnUndo.disabled = !this.state.history.canUndo();
      if (btnRedo) btnRedo.disabled = !this.state.history.canRedo();
    };

    this.state.subscribe(updateUndoRedo);
    updateUndoRedo();
  }

  initGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.state.redo();
        } else {
          this.state.undo();
        }
      } else if (isCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.state.redo();
      } else if (isCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        this.state.duplicateSelected();
      } else if (isCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        this.state.setSelection(this.state.elements.map(el => el.id));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (this.state.selectedIds.length > 0) {
          e.preventDefault();
          this.state.deleteSelected();
        }
      } else if (e.key === 'Escape') {
        this.modals.closeAll();
        this.state.clearSelection();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (this.state.selectedIds.length > 0) {
          e.preventDefault();
          const step = e.shiftKey ? this.state.project.gridSize : 1;
          const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
          const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

          this.state.selectedIds.forEach(id => {
            const el = this.state.elements.find(item => item.id === id);
            if (el) {
              el.x = Math.max(0, el.x + dx);
              el.y = Math.max(0, el.y + dy);
            }
          });
          this.state.saveSnapshot();
          this.state.notify('nudge');
        }
      }
    });
  }

  /* Public Bridge Methods for HTML Event Handlers */
  addElement(type) {
    this.state.addElement(type);
  }

  duplicateSelected() {
    this.state.duplicateSelected();
  }

  deleteSelected() {
    this.state.deleteSelected();
  }

  undo() {
    this.state.undo();
  }

  redo() {
    this.state.redo();
  }

  setZoom(val) {
    this.state.setProjectProp('zoomScale', parseFloat(val));
  }

  setGridSnap(enabled) {
    this.state.setProjectProp('gridSnap', enabled);
  }

  setGridSize(size) {
    this.state.setProjectProp('gridSize', parseInt(size, 10));
  }

  setPreset(w, h, bodyHeight = 28, enableBody = true) {
    this.state.setPreset(w, h, bodyHeight, enableBody);
  }

  moveLayer(id, delta) {
    this.state.moveLayer(id, delta);
  }

  toggleVisibility(id) {
    this.state.toggleVisibility(id);
  }

  updateActiveProp(prop, val, record = true) {
    this.state.updateSelected({ [prop]: val }, record);
  }

  setElementColor(code, hex) {
    if (this.state.selectedIds.length === 0) return;
    this.state.selectedIds.forEach(id => {
      const el = this.state.elements.find(e => e.id === id);
      if (el) {
        el.mcColorCode = code;
        el.textColor = hex;
      }
    });
    this.state.saveSnapshot();
    this.state.notify('element_update');
  }

  setTexturePreset(path) {
    if (this.state.selectedIds.length === 0) return;
    this.state.selectedIds.forEach(id => {
      const el = this.state.elements.find(e => e.id === id);
      if (el) {
        el.texture = path;
      }
    });
    this.state.saveSnapshot();
    this.state.notify('element_update');
  }

  align(type) {
    this.state.elements = alignElements(this.state.elements, this.state.selectedIds, type);
    this.state.saveSnapshot();
    this.state.notify('align');
  }

  distribute(direction) {
    this.state.elements = distributeElements(this.state.elements, this.state.selectedIds, direction);
    this.state.saveSnapshot();
    this.state.notify('distribute');
  }

  autoFitBodyHeight() {
    this.formSettings.autoFitBodyHeight();
  }

  openPreview() {
    this.modals.openPreview();
  }

  openExport() {
    this.modals.openExport();
  }

  openTemplateLibrary() {
    this.modals.openTemplateLibrary();
  }

  openImport() {
    this.modals.openImport();
  }

  closeModals() {
    this.modals.closeAll();
  }

  copyCode(elementId, successMsg) {
    const el = document.getElementById(elementId);
    if (el) copyToClipboard(el.value, successMsg);
  }

  downloadFullServerForm() {
    const full = JsonUiEngine.generateFullServerForm(this.state.elements, this.state.project);
    downloadJsonFile(full, 'server_form.json');
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  window.__studioApp = new BedrockStudioApp();
});
