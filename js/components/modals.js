/**
 * Bedrock JSON-UI Studio - Modals Controller
 */

import { JsonUiEngine } from '../generator/jsonUiEngine.js';
import { copyToClipboard, downloadJsonFile, showToast } from '../utils/exporter.js';
import { SAMPLE_TEMPLATES } from '../config/templates.js';

export class ModalsComponent {
  constructor(state) {
    this.state = state;

    this.previewModal = document.getElementById('preview-modal');
    this.exportModal = document.getElementById('export-modal');
    this.templateModal = document.getElementById('template-modal');
    this.importModal = document.getElementById('import-modal');

    this.initEventListeners();
  }

  initEventListeners() {
    // Close modals on overlay background click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAll();
        }
      });
    });
  }

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  }

  openPreview() {
    const { elements, project } = this.state;
    const btnPanel = JsonUiEngine.generateButtonPanel(elements, project);
    const dialogEntry = JsonUiEngine.generateDialog(project);

    const txtBtn = document.getElementById('code-btn-preview');
    const txtDialog = document.getElementById('code-dialog-preview');

    if (txtBtn) txtBtn.value = JSON.stringify(btnPanel, null, 2);
    if (txtDialog) txtDialog.value = JSON.stringify(dialogEntry, null, 2);

    if (this.previewModal) this.previewModal.classList.add('active');
  }

  openExport() {
    const { elements, project } = this.state;
    const btnPanel = JsonUiEngine.generateButtonPanel(elements, project);
    const dialogEntry = JsonUiEngine.generateDialog(project);
    const fullForm = JsonUiEngine.generateFullServerForm(elements, project);

    const txtBtn = document.getElementById('code-btn-panel');
    const txtDialog = document.getElementById('code-dialog-panel');
    const txtFull = document.getElementById('code-full-form');

    if (txtBtn) txtBtn.value = JSON.stringify(btnPanel, null, 2);
    if (txtDialog) txtDialog.value = JSON.stringify(dialogEntry, null, 2);
    if (txtFull) txtFull.value = JSON.stringify(fullForm, null, 2);

    if (this.exportModal) this.exportModal.classList.add('active');
  }

  openTemplateLibrary() {
    const container = document.getElementById('template-cards-container');
    if (container) {
      container.innerHTML = '';
      SAMPLE_TEMPLATES.forEach(tmpl => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.onclick = () => {
          this.state.loadTemplate(tmpl.id);
          this.closeAll();
          showToast(`Loaded ${tmpl.title}`, 'info');
        };

        card.innerHTML = `
          <div class="template-card-title">${tmpl.title}</div>
          <div class="template-card-desc">${tmpl.description}</div>
          <div class="template-card-meta">📐 ${tmpl.dialogWidth}x${tmpl.dialogHeight}px • 🔘 ${tmpl.elements.length} Elements</div>
        `;
        container.appendChild(card);
      });
    }

    if (this.templateModal) this.templateModal.classList.add('active');
  }

  openImport() {
    const txt = document.getElementById('code-import-input');
    if (txt) txt.value = '';
    if (this.importModal) this.importModal.classList.add('active');
  }

  processImport() {
    const txt = document.getElementById('code-import-input');
    if (!txt || !txt.value.trim()) {
      showToast('Please paste valid JSON UI content', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(txt.value);
      // Attempt to parse buttons or elements
      // If it's a full server_form.json or panel
      let importedElements = [];

      // Check keys
      for (const [key, val] of Object.entries(parsed)) {
        if (val && typeof val === 'object' && val.controls) {
          // Found a panel
          this.extractElementsFromControls(val.controls, importedElements);
        }
      }

      if (importedElements.length > 0) {
        this.state.elements = importedElements;
        this.state.saveSnapshot();
        this.state.notify('import');
        this.closeAll();
        showToast(`Imported ${importedElements.length} elements successfully!`, 'success');
      } else {
        showToast('No recognized controls found in JSON. Check format.', 'error');
      }
    } catch (e) {
      showToast('JSON Syntax Error: ' + e.message, 'error');
    }
  }

  extractElementsFromControls(controls, resultList, depth = 0) {
    if (!Array.isArray(controls)) return;

    controls.forEach((ctrl, idx) => {
      for (const [ctrlName, ctrlDef] of Object.entries(ctrl)) {
        if (ctrlName.includes('custom_button') || ctrlDef.$button_size) {
          const btnSize = ctrlDef.$button_size || [64, 64];
          const padSize = ctrlDef.$padding_size || [btnSize[0] + 5, btnSize[1] + 5];
          const iconSize = ctrlDef.$icon_size || [32, 32];

          resultList.push({
            id: 'el_imp_' + Date.now() + Math.random().toString(36).substr(2, 4),
            name: ctrlName.split('@')[0],
            type: ctrlName.includes('menu') ? 'custom_button_menu' : ctrlName.includes('shop') ? 'custom_button_shop' : 'custom_button',
            x: ctrlDef.offset ? ctrlDef.offset[0] : 16 + (resultList.length % 3) * (btnSize[0] + 10),
            y: ctrlDef.offset ? ctrlDef.offset[1] + 40 : 40 + Math.floor(resultList.length / 3) * (btnSize[1] + 10),
            w: Number(btnSize[0]),
            h: Number(btnSize[1]),
            iconSize: Number(iconSize[0]),
            layer: 4,
            alpha: 1.0,
            text: ctrlName.split('@')[0],
            fontType: 'MinecraftTen',
            fontSize: 1.0,
            textColor: '#ffffff',
            mcColorCode: '§f',
            shadow: true,
            texture: ctrlDef.$default_button_texture || 'textures/bakaui/button_light',
            sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
            iconTexture: 'textures/bakaui/trash',
            collectionIndex: ctrlDef.collection_index !== undefined ? ctrlDef.collection_index : resultList.length,
            customPadW: Number(padSize[0]),
            customPadH: Number(padSize[1]),
            visible: true
          });
        } else if (ctrlDef.controls) {
          this.extractElementsFromControls(ctrlDef.controls, resultList, depth + 1);
        }
      }
    });
  }
}
