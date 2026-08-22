/**
 * Bedrock JSON-UI Studio - Canvas Viewport & Chrome Renderer
 */

import { parseMcFormatting } from '../utils/mcColor.js';

export class ViewportComponent {
  constructor(state) {
    this.state = state;
    this.canvasWrapper = document.getElementById('canvas-wrapper');
    this.workspace = document.getElementById('button-workspace');
    
    // Chrome Elements
    this.chromeLabel = document.getElementById('disp-chrome-label');
    this.chromeBodyContainer = document.getElementById('disp-body-container');
    this.chromeBodyText = document.getElementById('disp-body-text');

    this.initEventListeners();
    this.render();
  }

  initEventListeners() {
    this.state.subscribe((s, eventType) => {
      this.render();
    });
  }

  render() {
    const { project, elements, selectedIds } = this.state;

    // 1. Update Canvas Dimensions & Scale
    this.canvasWrapper.style.width = `${project.dialogWidth}px`;
    this.canvasWrapper.style.height = `${project.dialogHeight}px`;
    document.documentElement.style.setProperty('--zoom-scale', project.zoomScale);
    document.documentElement.style.setProperty('--grid-size', `${project.gridSize}px`);

    this.canvasWrapper.classList.toggle('grid-on', project.gridSnap);

    // 2. Update Chrome Frame Simulation
    if (this.chromeLabel) {
      this.chromeLabel.innerHTML = parseMcFormatting(project.titleFilter);
    }

    if (this.chromeBodyContainer) {
      this.chromeBodyContainer.style.display = project.enableBody ? 'flex' : 'none';
      this.chromeBodyContainer.style.height = `${project.bodyHeight}px`;
    }

    if (this.chromeBodyText) {
      this.chromeBodyText.innerHTML = parseMcFormatting(project.bodyText);
    }

    // 3. Render Elements inside Workspace
    this.workspace.innerHTML = '';

    elements.forEach(el => {
      if (el.visible === false) return;

      const isSelected = selectedIds.includes(el.id);
      const div = document.createElement('div');
      div.id = el.id;
      div.className = `ui-element ui-type-${el.type} ${isSelected ? 'selected' : ''}`;
      div.style.left = `${el.x}px`;
      div.style.top = `${el.y}px`;
      div.style.width = `${el.w}px`;
      div.style.height = `${el.h}px`;
      div.style.zIndex = el.layer || 2;
      div.dataset.id = el.id;

      // 3.1 Background 9-Slice Layer
      const bgLayer = document.createElement('div');
      bgLayer.className = 'ui-bg-layer';
      bgLayer.style.opacity = el.alpha !== undefined ? el.alpha : 1.0;

      if (el.texture) {
        const t = el.sliceTop !== undefined ? el.sliceTop : 3;
        const r = el.sliceRight !== undefined ? el.sliceRight : 3;
        const b = el.sliceBottom !== undefined ? el.sliceBottom : 3;
        const l = el.sliceLeft !== undefined ? el.sliceLeft : 3;

        bgLayer.style.borderStyle = 'solid';
        bgLayer.style.borderWidth = `${t}px ${r}px ${b}px ${l}px`;
        bgLayer.style.borderImageSource = `url('${el.texture}.png')`;
        bgLayer.style.borderImageSlice = `${t} ${r} ${b} ${l} fill`;
        bgLayer.style.borderImageRepeat = 'stretch';
      }
      div.appendChild(bgLayer);

      // 3.2 Content Layer
      const contentLayer = document.createElement('div');
      contentLayer.className = 'ui-content-layer';

      const fontClass = el.fontType === 'MinecraftTen' ? 'mc-font-ten' : 'mc-font-regular';
      const shadowStyle = el.shadow ? 'text-shadow: 1px 1px 0px rgba(0,0,0,0.85);' : '';
      const formattedText = parseMcFormatting(el.text || '');

      if (el.type.includes('button')) {
        const isMenuType = (el.type === 'custom_button_menu');
        const isShopType = (el.type === 'custom_button_shop');
        const layoutClass = isMenuType ? 'layout-menu' : isShopType ? 'layout-shop' : '';

        const iconW = el.iconSize || 32;
        const iconH = el.iconSize || 32;
        const iconUrl = el.iconTexture ? `${el.iconTexture}.png` : 'textures/bakaui/trash.png';

        contentLayer.innerHTML = `
          <div class="btn-container ${layoutClass}">
            ${!isMenuType ? `<div class="btn-icon" style="background-image: url('${iconUrl}'); width:${iconW}px; height:${iconH}px;"></div>` : ''}
            <div class="btn-label-text ${fontClass}" style="font-size:${10 * (el.fontSize || 1.0)}px; ${shadowStyle}">
              ${formattedText}
            </div>
          </div>
        `;

        // Collection Index Badge
        if (el.collectionIndex !== null && el.collectionIndex !== undefined) {
          const badge = document.createElement('div');
          badge.className = 'btn-index-badge';
          badge.innerText = `#${el.collectionIndex}`;
          div.appendChild(badge);
        }
      } else if (el.type === 'label') {
        contentLayer.innerHTML = `
          <div class="${fontClass}" style="font-size:${11 * (el.fontSize || 1.0)}px; ${shadowStyle}; width: 100%; text-align: center;">
            ${formattedText}
          </div>
        `;
      }
      div.appendChild(contentLayer);

      // 3.3 8-Directional Resize Handles (Only for single active selection)
      if (isSelected && selectedIds.length === 1) {
        ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(dir => {
          const handle = document.createElement('div');
          handle.className = `resize-handle handle-${dir}`;
          handle.dataset.dir = dir;
          handle.dataset.elementId = el.id;
          div.appendChild(handle);
        });
      }

      this.workspace.appendChild(div);
    });
  }
}
