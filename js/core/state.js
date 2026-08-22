/**
 * Bedrock JSON-UI Studio - Reactive State Store
 */

import { HistoryManager } from './history.js';
import { snap } from './geometry.js';
import { SAMPLE_TEMPLATES } from '../config/templates.js';

class StateStore {
  constructor() {
    this.history = new HistoryManager(50);
    this.listeners = new Set();

    // Default Project Configuration
    const defaultTemplate = SAMPLE_TEMPLATES[0]; // BakaUI Navigator

    this.project = {
      titleFilter: defaultTemplate.titleFilter,
      menuName: defaultTemplate.menuName,
      enableBody: defaultTemplate.enableBody,
      bodyText: defaultTemplate.bodyText,
      bodyHeight: defaultTemplate.bodyHeight,
      dialogWidth: defaultTemplate.dialogWidth,
      dialogHeight: defaultTemplate.dialogHeight,
      exportMode: defaultTemplate.exportMode || "stack", // "stack" | "absolute"
      zoomScale: 1.5,
      gridSnap: true,
      gridSize: 10
    };

    this.elements = JSON.parse(JSON.stringify(defaultTemplate.elements));
    this.selectedIds = [];
    this.buttonCounter = 10;

    // Record initial state
    this.saveSnapshot();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changeType = 'general') {
    this.listeners.forEach(fn => fn(this, changeType));
  }

  saveSnapshot() {
    const snapshot = {
      project: JSON.parse(JSON.stringify(this.project)),
      elements: JSON.parse(JSON.stringify(this.elements)),
      selectedIds: [...this.selectedIds]
    };
    this.history.push(snapshot);
  }

  undo() {
    const snapshot = this.history.undo();
    if (snapshot) {
      this.project = snapshot.project;
      this.elements = snapshot.elements;
      this.selectedIds = snapshot.selectedIds;
      this.notify('history');
    }
  }

  redo() {
    const snapshot = this.history.redo();
    if (snapshot) {
      this.project = snapshot.project;
      this.elements = snapshot.elements;
      this.selectedIds = snapshot.selectedIds;
      this.notify('history');
    }
  }

  setProjectProp(prop, value, record = true) {
    this.project[prop] = value;
    if (record) this.saveSnapshot();
    this.notify('project');
  }

  setPreset(w, h, bodyHeight = 28, enableBody = true) {
    this.project.dialogWidth = w;
    this.project.dialogHeight = h;
    this.project.bodyHeight = bodyHeight;
    this.project.enableBody = enableBody;
    this.saveSnapshot();
    this.notify('project');
  }

  loadTemplate(templateId) {
    const target = SAMPLE_TEMPLATES.find(t => t.id === templateId);
    if (!target) return;

    this.project.titleFilter = target.titleFilter;
    this.project.menuName = target.menuName;
    this.project.enableBody = target.enableBody;
    this.project.bodyText = target.bodyText;
    this.project.bodyHeight = target.bodyHeight;
    this.project.dialogWidth = target.dialogWidth;
    this.project.dialogHeight = target.dialogHeight;
    this.project.exportMode = target.exportMode || "stack";

    this.elements = JSON.parse(JSON.stringify(target.elements));
    this.selectedIds = [];
    this.saveSnapshot();
    this.notify('load_template');
  }

  selectElement(id, multi = false) {
    if (multi) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter(i => i !== id);
      } else {
        this.selectedIds.push(id);
      }
    } else {
      this.selectedIds = [id];
    }
    this.notify('selection');
  }

  setSelection(ids) {
    this.selectedIds = ids || [];
    this.notify('selection');
  }

  clearSelection() {
    if (this.selectedIds.length > 0) {
      this.selectedIds = [];
      this.notify('selection');
    }
  }

  addElement(type) {
    const isButton = type.includes('button');
    const isMenuButton = (type === 'custom_button_menu');
    const isShopButton = (type === 'custom_button_shop');
    const isDivider = (type === 'divider');
    const isImage = (type === 'image');

    const id = 'el_' + Date.now() + Math.random().toString(36).substr(2, 4);
    const count = this.elements.length + 1;
    const btnIndex = isButton ? this.getNextCollectionIndex() : null;

    let defaultW = isMenuButton ? 127.5 : isShopButton ? 134 : isDivider ? (this.project.dialogWidth - 20) : 64;
    let defaultH = isMenuButton ? 20 : isShopButton ? 134 : isDivider ? 5 : 64;
    let iconSize = isMenuButton ? 16 : isShopButton ? 128 : 32;

    const startY = this.project.enableBody ? (this.project.bodyHeight + 16) : 16;

    const newEl = {
      id,
      name: isButton ? `button_${btnIndex}` : `${type}_${count}`,
      type,
      x: snap(16, this.project.gridSize, this.project.gridSnap),
      y: snap(startY, this.project.gridSize, this.project.gridSnap),
      w: defaultW,
      h: defaultH,
      iconSize,
      layer: isButton ? 4 : isDivider ? 10 : 2,
      alpha: 1.0,
      text: isButton ? `Option ${btnIndex}` : '',
      fontType: 'MinecraftTen',
      fontSize: 1.0,
      textColor: '#ffffff',
      mcColorCode: '§f',
      shadow: true,
      texture: isButton ? 'textures/bakaui/button_light' : isDivider ? 'textures/bakaui/custom_bg_divider' : 'textures/bakaui/custom_bg_dark',
      sliceTop: 3,
      sliceRight: 3,
      sliceBottom: 3,
      sliceLeft: 3,
      iconTexture: 'textures/bakaui/trash',
      collectionIndex: btnIndex,
      customPadW: null,
      customPadH: null,
      visible: true
    };

    this.elements.push(newEl);
    this.selectedIds = [id];
    this.saveSnapshot();
    this.notify('element_add');
  }

  getNextCollectionIndex() {
    const existingIndices = this.elements
      .filter(e => e.collectionIndex !== null && e.collectionIndex !== undefined)
      .map(e => Number(e.collectionIndex));
    
    if (existingIndices.length === 0) return 0;
    return Math.max(...existingIndices) + 1;
  }

  updateElement(id, props, record = true) {
    const el = this.elements.find(e => e.id === id);
    if (!el) return;
    Object.assign(el, props);
    if (record) this.saveSnapshot();
    this.notify('element_update');
  }

  updateSelected(props, record = true) {
    if (this.selectedIds.length === 0) return;
    this.elements.forEach(el => {
      if (this.selectedIds.includes(el.id)) {
        Object.assign(el, props);
      }
    });
    if (record) this.saveSnapshot();
    this.notify('element_update');
  }

  duplicateSelected() {
    if (this.selectedIds.length === 0) return;
    const newSelected = [];

    this.selectedIds.forEach(id => {
      const orig = this.elements.find(e => e.id === id);
      if (!orig) return;

      const clone = JSON.parse(JSON.stringify(orig));
      clone.id = 'el_' + Date.now() + Math.random().toString(36).substr(2, 4);
      clone.x = snap(clone.x + this.project.gridSize, this.project.gridSize, this.project.gridSnap);
      clone.y = snap(clone.y + this.project.gridSize, this.project.gridSize, this.project.gridSnap);

      if (clone.collectionIndex !== null && clone.collectionIndex !== undefined) {
        const nextIdx = this.getNextCollectionIndex();
        clone.collectionIndex = nextIdx;
        clone.name = `button_${nextIdx}`;
        clone.text = `Option ${nextIdx}`;
      } else {
        clone.name = `${clone.type}_copy_${Date.now().toString().slice(-4)}`;
      }

      this.elements.push(clone);
      newSelected.push(clone.id);
    });

    this.selectedIds = newSelected;
    this.saveSnapshot();
    this.notify('element_duplicate');
  }

  deleteSelected() {
    if (this.selectedIds.length === 0) return;
    this.elements = this.elements.filter(e => !this.selectedIds.includes(e.id));
    this.selectedIds = [];
    this.saveSnapshot();
    this.notify('element_delete');
  }

  moveLayer(id, delta) {
    const idx = this.elements.findIndex(e => e.id === id);
    if (idx < 0) return;
    const targetIdx = idx + delta;
    if (targetIdx >= 0 && targetIdx < this.elements.length) {
      const item = this.elements.splice(idx, 1)[0];
      this.elements.splice(targetIdx, 0, item);
      this.saveSnapshot();
      this.notify('layer_reorder');
    }
  }

  toggleVisibility(id) {
    const el = this.elements.find(e => e.id === id);
    if (el) {
      el.visible = !el.visible;
      this.saveSnapshot();
      this.notify('visibility_toggle');
    }
  }
}

export const state = new StateStore();
