/**
 * Bedrock JSON-UI Studio - Property Inspector Component
 */

import { MC_COLORS, TEXTURE_PRESETS } from '../config/constants.js';
import { alignElements, distributeElements, snap } from '../core/geometry.js';
import { formatWithColorCode } from '../utils/mcColor.js';

export class PropertyInspectorComponent {
  constructor(state) {
    this.state = state;
    this.badge = document.getElementById('inspect-id-badge');
    this.content = document.getElementById('inspector-content');

    this.initEventListeners();
    this.render();
  }

  initEventListeners() {
    this.state.subscribe(() => this.render());
  }

  render() {
    if (!this.content || !this.badge) return;

    const { selectedIds, elements, project } = this.state;

    if (selectedIds.length === 0) {
      this.badge.innerText = 'No Selection';
      this.content.innerHTML = `
        <p style="font-size: 12px; color: var(--text-muted); padding: 12px; text-align: center;">
          Select an element on canvas to inspect and calibrate properties.
        </p>
      `;
      return;
    }

    if (selectedIds.length > 1) {
      this.badge.innerText = `${selectedIds.length} SELECTED`;
      this.content.innerHTML = `
        <div class="prop-card">
          <div class="prop-card-title">
            <span>Multi-Selection</span>
            <span class="badge-tag">${selectedIds.length} Elements</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted);">
            Apply batch alignment or duplication to all selected items.
          </p>

          <div class="prop-card-title" style="margin-top: 4px;">Quick Align</div>
          <div class="alignment-grid">
            <button title="Align Left" onclick="window.__studioApp.align('left')">⇤</button>
            <button title="Align Center (H)" onclick="window.__studioApp.align('center')">⇥⇤</button>
            <button title="Align Right" onclick="window.__studioApp.align('right')">⇥</button>
            <button title="Align Top" onclick="window.__studioApp.align('top')">⤒</button>
            <button title="Align Middle (V)" onclick="window.__studioApp.align('middle')">⤓⤒</button>
            <button title="Align Bottom" onclick="window.__studioApp.align('bottom')">⤓</button>
          </div>

          <div class="prop-card-title" style="margin-top: 4px;">Distribute</div>
          <div class="prop-row">
            <button class="btn btn-sm" onclick="window.__studioApp.distribute('horizontal')">↔ Distribute Horizontally</button>
            <button class="btn btn-sm" onclick="window.__studioApp.distribute('vertical')">↕ Distribute Vertically</button>
          </div>

          <div class="prop-row" style="margin-top: 8px;">
            <button class="btn btn-primary btn-sm" onclick="window.__studioApp.duplicateSelected()">📋 Duplicate (Ctrl+D)</button>
            <button class="btn btn-danger btn-sm" onclick="window.__studioApp.deleteSelected()">🗑 Delete (${selectedIds.length})</button>
          </div>
        </div>
      `;
      return;
    }

    const el = elements.find(e => e.id === selectedIds[0]);
    if (!el) return;

    this.badge.innerText = `${el.type.replace('custom_', '').toUpperCase()}`;

    // Button specific inspector markup
    let buttonHtml = '';
    if (el.type.includes('button')) {
      buttonHtml = `
        <div class="prop-card">
          <div class="prop-card-title">
            <span>Button & Binding Config</span>
            <span class="badge-tag">BakaUI</span>
          </div>

          <div class="prop-group">
            <label>Button Label Text</label>
            <input type="text" value="${el.text || ''}" oninput="window.__studioApp.updateActiveProp('text', this.value)">
          </div>

          <div class="prop-group">
            <label>Minecraft Color (§)</label>
            <div class="mc-color-grid">
              ${MC_COLORS.map(c => `
                <div class="mc-color-swatch ${(el.mcColorCode === c.code) ? 'active' : ''}" 
                     style="background-color: ${c.hex}; color: ${c.code === '§0' ? '#fff' : '#000'};"
                     title="${c.name}"
                     onclick="window.__studioApp.setElementColor('${c.code}', '${c.hex}')">
                  ${c.code}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="prop-row">
            <div class="prop-group">
              <label>Icon Size ($icon_size)</label>
              <input type="number" value="${el.iconSize || 32}" onchange="window.__studioApp.updateActiveProp('iconSize', +this.value)">
            </div>
            <div class="prop-group">
              <label>Collection Index</label>
              <input type="number" value="${el.collectionIndex !== null ? el.collectionIndex : 0}" onchange="window.__studioApp.updateActiveProp('collectionIndex', +this.value)">
            </div>
          </div>

          <div class="prop-group">
            <label>Icon Texture Path</label>
            <input type="text" value="${el.iconTexture || 'textures/bakaui/trash'}" onchange="window.__studioApp.updateActiveProp('iconTexture', this.value)">
          </div>

          <div class="prop-card-title" style="margin-top: 4px;">
            <span>$padding_size Override (Optional)</span>
          </div>
          <p style="font-size: 10px; color: var(--text-muted); margin-top: -4px;">
            Leave empty for automatic BakaUI stack padding calibration.
          </p>
          <div class="prop-row">
            <div class="prop-group">
              <label>Padding Width</label>
              <input type="number" placeholder="Auto" value="${el.customPadW !== null ? el.customPadW : ''}" onchange="window.__studioApp.updateActiveProp('customPadW', this.value === '' ? null : +this.value)">
            </div>
            <div class="prop-group">
              <label>Padding Height</label>
              <input type="number" placeholder="Auto" value="${el.customPadH !== null ? el.customPadH : ''}" onchange="window.__studioApp.updateActiveProp('customPadH', this.value === '' ? null : +this.value)">
            </div>
          </div>
        </div>
      `;
    }

    this.content.innerHTML = `
      <div class="prop-card">
        <div class="prop-card-title">
          <span>Element Properties</span>
          <span class="badge-tag">Layer ${el.layer || 2}</span>
        </div>
        <div class="prop-group">
          <label>Control Identifier Name</label>
          <input type="text" value="${el.name}" onchange="window.__studioApp.updateActiveProp('name', this.value)">
        </div>
      </div>

      <div class="prop-card">
        <div class="prop-card-title">Transform & Dimensions</div>
        <div class="prop-row">
          <div class="prop-group">
            <label>Offset X (px)</label>
            <input type="number" value="${el.x}" onchange="window.__studioApp.updateActiveProp('x', snap(+this.value, ${project.gridSize}, ${project.gridSnap}))">
          </div>
          <div class="prop-group">
            <label>Offset Y (px)</label>
            <input type="number" value="${el.y}" onchange="window.__studioApp.updateActiveProp('y', snap(+this.value, ${project.gridSize}, ${project.gridSnap}))">
          </div>
        </div>
        <div class="prop-row">
          <div class="prop-group">
            <label>Width ($button_size[0])</label>
            <input type="number" value="${el.w}" onchange="window.__studioApp.updateActiveProp('w', Math.max(8, snap(+this.value, ${project.gridSize}, ${project.gridSnap})))">
          </div>
          <div class="prop-group">
            <label>Height ($button_size[1])</label>
            <input type="number" value="${el.h}" onchange="window.__studioApp.updateActiveProp('h', Math.max(8, snap(+this.value, ${project.gridSize}, ${project.gridSnap})))">
          </div>
        </div>
        <div class="prop-row">
          <div class="prop-group">
            <label>Layer (z-index)</label>
            <input type="number" value="${el.layer || 2}" onchange="window.__studioApp.updateActiveProp('layer', +this.value)">
          </div>
          <div class="prop-group">
            <label>Font Size Multiplier</label>
            <input type="number" step="0.1" min="0.5" max="3.0" value="${el.fontSize || 1.0}" onchange="window.__studioApp.updateActiveProp('fontSize', +this.value)">
          </div>
        </div>
      </div>

      ${buttonHtml}

      <div class="prop-card">
        <div class="prop-card-title">Texture & 9-Slice Definition</div>
        <div class="prop-group">
          <label>Texture Preset</label>
          <select onchange="window.__studioApp.setTexturePreset(this.value)">
            <option value="">-- Custom Texture --</option>
            ${TEXTURE_PRESETS.map(tp => `<option value="${tp.path}" ${el.texture === tp.path ? 'selected' : ''}>${tp.name}</option>`).join('')}
          </select>
        </div>
        <div class="prop-group">
          <label>Texture File Path</label>
          <input type="text" value="${el.texture || ''}" onchange="window.__studioApp.updateActiveProp('texture', this.value)">
        </div>

        <div class="prop-group">
          <label>9-Slice Insets (Top / Right / Bottom / Left)</label>
          <div class="prop-row-4">
            <input type="number" title="Top" value="${el.sliceTop !== undefined ? el.sliceTop : 3}" onchange="window.__studioApp.updateActiveProp('sliceTop', +this.value)">
            <input type="number" title="Right" value="${el.sliceRight !== undefined ? el.sliceRight : 3}" onchange="window.__studioApp.updateActiveProp('sliceRight', +this.value)">
            <input type="number" title="Bottom" value="${el.sliceBottom !== undefined ? el.sliceBottom : 3}" onchange="window.__studioApp.updateActiveProp('sliceBottom', +this.value)">
            <input type="number" title="Left" value="${el.sliceLeft !== undefined ? el.sliceLeft : 3}" onchange="window.__studioApp.updateActiveProp('sliceLeft', +this.value)">
          </div>
        </div>

        <div class="prop-group">
          <label>Texture Opacity (Alpha)</label>
          <div class="slider-row">
            <input type="range" min="0" max="1" step="0.05" value="${el.alpha !== undefined ? el.alpha : 1.0}" 
                   oninput="window.__studioApp.updateActiveProp('alpha', +this.value, false); document.getElementById('val-alpha').innerText = this.value;"
                   onchange="window.__studioApp.updateActiveProp('alpha', +this.value, true);">
            <span class="slider-val" id="val-alpha">${el.alpha !== undefined ? el.alpha : 1.0}</span>
          </div>
        </div>
      </div>

      <div class="prop-row" style="margin-top: 6px;">
        <button class="btn btn-primary" onclick="window.__studioApp.duplicateSelected()">📋 Duplicate (Ctrl+D)</button>
        <button class="btn btn-danger" onclick="window.__studioApp.deleteSelected()">🗑 Delete</button>
      </div>
    `;
  }
}
