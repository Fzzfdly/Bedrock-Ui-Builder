/**
 * Bedrock JSON-UI Studio - Hierarchy & Layers Tree Component
 */

export class HierarchyTreeComponent {
  constructor(state) {
    this.state = state;
    this.container = document.getElementById('element-tree');
    this.initEventListeners();
    this.render();
  }

  initEventListeners() {
    this.state.subscribe(() => this.render());
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const { elements, selectedIds } = this.state;

    // Display elements top-to-bottom in visual z-order (reversed array)
    elements.slice().reverse().forEach(el => {
      const isSelected = selectedIds.includes(el.id);
      const item = document.createElement('div');
      item.className = `tree-item ${isSelected ? 'selected' : ''}`;
      
      item.onclick = (e) => {
        const isMulti = e.shiftKey || e.ctrlKey || e.metaKey;
        this.state.selectElement(el.id, isMulti);
      };

      const indexLabel = (el.collectionIndex !== null && el.collectionIndex !== undefined)
        ? `[#${el.collectionIndex}]`
        : '';

      item.innerHTML = `
        <div class="tree-item-title">
          <span>${el.name}</span>
          <span class="tree-type-tag">${el.type.replace('custom_', '')} ${indexLabel}</span>
        </div>
        <div class="tree-item-actions">
          <button class="tree-action-btn" title="Bring Forward" onclick="event.stopPropagation(); window.__studioApp.moveLayer('${el.id}', 1)">▲</button>
          <button class="tree-action-btn" title="Send Backward" onclick="event.stopPropagation(); window.__studioApp.moveLayer('${el.id}', -1)">▼</button>
          <button class="tree-action-btn" title="Toggle Visibility" onclick="event.stopPropagation(); window.__studioApp.toggleVisibility('${el.id}')">${el.visible !== false ? '👁' : '🚫'}</button>
        </div>
      `;

      this.container.appendChild(item);
    });
  }
}
