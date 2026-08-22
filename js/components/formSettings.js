/**
 * Bedrock JSON-UI Studio - Form Settings Component
 */

import { SCREEN_PRESETS } from '../config/constants.js';

export class FormSettingsComponent {
  constructor(state) {
    this.state = state;

    this.inpTitle = document.getElementById('inp-form-binding');
    this.inpMenuName = document.getElementById('inp-menu-name');
    this.chkEnableBody = document.getElementById('chk-enable-body');
    this.inpBodyText = document.getElementById('inp-body-text');
    this.inpBodyHeight = document.getElementById('inp-body-height');
    this.bodySettingsWrapper = document.getElementById('body-settings-wrapper');
    this.selExportMode = document.getElementById('sel-export-mode');

    this.initEventListeners();
    this.syncFormValues();
  }

  initEventListeners() {
    this.state.subscribe((s, eventType) => {
      if (eventType !== 'element_update' && eventType !== 'selection') {
        this.syncFormValues();
      }
    });

    if (this.inpTitle) {
      this.inpTitle.addEventListener('input', (e) => {
        this.state.setProjectProp('titleFilter', e.target.value);
      });
    }

    if (this.inpMenuName) {
      this.inpMenuName.addEventListener('input', (e) => {
        const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
        this.state.setProjectProp('menuName', clean);
      });
    }

    if (this.chkEnableBody) {
      this.chkEnableBody.addEventListener('change', (e) => {
        this.state.setProjectProp('enableBody', e.target.checked);
      });
    }

    if (this.inpBodyText) {
      this.inpBodyText.addEventListener('input', (e) => {
        this.state.setProjectProp('bodyText', e.target.value);
      });
    }

    if (this.inpBodyHeight) {
      this.inpBodyHeight.addEventListener('change', (e) => {
        const val = Math.max(20, Math.min(160, +e.target.value));
        this.state.setProjectProp('bodyHeight', val);
      });
    }

    if (this.selExportMode) {
      this.selExportMode.addEventListener('change', (e) => {
        this.state.setProjectProp('exportMode', e.target.value);
      });
    }
  }

  syncFormValues() {
    const { project } = this.state;
    if (this.inpTitle && document.activeElement !== this.inpTitle) {
      this.inpTitle.value = project.titleFilter || '';
    }
    if (this.inpMenuName && document.activeElement !== this.inpMenuName) {
      this.inpMenuName.value = project.menuName || '';
    }
    if (this.chkEnableBody) {
      this.chkEnableBody.checked = project.enableBody !== false;
    }
    if (this.inpBodyText && document.activeElement !== this.inpBodyText) {
      this.inpBodyText.value = project.bodyText || '';
    }
    if (this.inpBodyHeight && document.activeElement !== this.inpBodyHeight) {
      this.inpBodyHeight.value = project.bodyHeight || 28;
    }
    if (this.bodySettingsWrapper) {
      this.bodySettingsWrapper.style.display = project.enableBody ? 'flex' : 'none';
    }
    if (this.selExportMode) {
      this.selExportMode.value = project.exportMode || 'stack';
    }
  }

  autoFitBodyHeight() {
    const text = this.state.project.bodyText || '';
    const lineCount = (text.match(/\n/g) || []).length + 1;
    const calcHeight = Math.max(28, lineCount * 14 + 14);
    this.state.setProjectProp('bodyHeight', calcHeight);
  }
}
