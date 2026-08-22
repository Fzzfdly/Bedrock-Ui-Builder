/**
 * Bedrock JSON-UI Studio - BakaUI Intelligent Stack & Padding Calibrator
 * Calibrated directly from BakaUI server_form.json architecture
 */

/**
 * Builds a button control definition for JSON-UI
 * @param {Object} el 
 * @param {number} defaultPadW 
 * @param {number} defaultPadH 
 * @returns {Object}
 */
function buildButtonEntry(el, defaultPadW = null, defaultPadH = null) {
  const padW = (el.customPadW !== null && el.customPadW !== undefined && el.customPadW !== '')
    ? Number(el.customPadW)
    : (defaultPadW !== null ? defaultPadW : Math.round(el.w + 5));

  const padH = (el.customPadH !== null && el.customPadH !== undefined && el.customPadH !== '')
    ? Number(el.customPadH)
    : (defaultPadH !== null ? defaultPadH : Math.round(el.h + 5));

  const templateRef = el.type === 'custom_button_menu'
    ? 'server_form.custom_button_menu'
    : el.type === 'custom_button_shop'
    ? 'server_form.custom_button_shop'
    : el.type === 'test_button'
    ? 'server_form.test_button'
    : 'server_form.custom_button';

  const props = {
    "$button_size": [el.w, el.h],
    "$padding_size": [padW, padH],
    "$icon_size": [el.iconSize || 32, el.iconSize || 32],
    "collection_index": (el.collectionIndex !== null && el.collectionIndex !== undefined) ? Number(el.collectionIndex) : 0
  };

  if (el.texture && el.texture !== 'textures/bakaui/button_light') {
    props["$default_button_texture"] = el.texture;
  }

  return {
    [`${el.name}@${templateRef}`]: props
  };
}

/**
 * Builds an image or divider control definition
 * @param {Object} el 
 * @returns {Object}
 */
function buildImageEntry(el) {
  return {
    [`${el.name}`]: {
      "type": "image",
      "size": [el.w, el.h],
      "layer": el.layer || 2,
      ...(el.alpha !== 1.0 ? { "alpha": el.alpha } : {}),
      "texture": el.texture || "textures/bakaui/custom_bg_dark"
    }
  };
}

/**
 * Intelligent BakaUI Stack Panel Calibrator
 * Formulates multi-column, multi-row hierarchical stack panels matching BakaUI
 * @param {Array} elements 
 * @param {Object} project 
 * @returns {Object}
 */
export function generateBakaUiStackPanel(elements, project) {
  const panelName = `my_custom_panel_${project.menuName || 'custom'}`;
  const validElements = elements.filter(e => e.visible !== false);

  if (validElements.length === 0) {
    return {
      [panelName]: {
        "type": "stack_panel",
        "size": ["100%", "100%"],
        "orientation": "vertical",
        "anchor_from": "center",
        "anchor_to": "center",
        "collection_name": "form_buttons",
        "controls": []
      }
    };
  }

  // 1. Check for Vertical Multi-Column Split (like bakaui_menu: Left column vs Right column)
  const leftElements = [];
  const rightElements = [];
  
  // Calculate average X center
  const minX = Math.min(...validElements.map(e => e.x));
  const maxX = Math.max(...validElements.map(e => e.x + e.w));
  const totalSpan = maxX - minX;

  // If there are multiple elements spanning more than 200px and separated horizontally:
  let hasColumnSplit = false;
  let splitX = 0;

  if (validElements.length >= 3 && totalSpan > 180) {
    // Find natural vertical gap or split point
    const xIntervals = validElements.map(e => ({ left: e.x, right: e.x + e.w })).sort((a, b) => a.left - b.left);
    
    // Look for clear horizontal divide
    for (let i = 0; i < xIntervals.length - 1; i++) {
      const gap = xIntervals[i + 1].left - xIntervals[i].right;
      if (gap >= 4 || (xIntervals[i + 1].left >= minX + totalSpan * 0.35 && xIntervals[i].right <= minX + totalSpan * 0.55)) {
        splitX = (xIntervals[i].right + xIntervals[i + 1].left) / 2;
        hasColumnSplit = true;
        break;
      }
    }
  }

  if (hasColumnSplit && splitX > 0) {
    validElements.forEach(el => {
      if (el.x + el.w / 2 < splitX) {
        leftElements.push(el);
      } else {
        rightElements.push(el);
      }
    });
  }

  // If valid 2-column split found (BakaUI Navigator / Utilities layout)
  if (hasColumnSplit && leftElements.length > 0 && rightElements.length > 0) {
    // Sort left column elements top-to-bottom
    leftElements.sort((a, b) => a.y - b.y);
    const leftControls = leftElements.map(el => {
      if (el.type.includes('button')) {
        const padW = el.customPadW !== null ? Number(el.customPadW) : Math.round(el.w + 10);
        const padH = el.customPadH !== null ? Number(el.customPadH) : Math.round(el.h + 5);
        return buildButtonEntry(el, padW, padH);
      }
      return buildImageEntry(el);
    });

    // Right column: check if bottom elements are a horizontal row (like Shop & Warp)
    rightElements.sort((a, b) => a.y - b.y || a.x - b.x);
    
    // Cluster right elements into rows
    const rightRows = [];
    rightElements.forEach(el => {
      let placed = false;
      for (const row of rightRows) {
        const avgY = row.reduce((sum, item) => sum + item.y, 0) / row.length;
        if (Math.abs(el.y - avgY) <= 16) {
          row.push(el);
          placed = true;
          break;
        }
      }
      if (!placed) rightRows.push([el]);
    });

    const rightControls = rightRows.map((row, rIdx) => {
      row.sort((a, b) => a.x - b.x);
      
      if (row.length === 1) {
        const el = row[0];
        if (el.type.includes('button')) {
          const padW = el.customPadW !== null ? Number(el.customPadW) : el.w;
          const padH = el.customPadH !== null ? Number(el.customPadH) : Math.round(el.h + 5);
          return buildButtonEntry(el, padW, padH);
        }
        return buildImageEntry(el);
      }

      // Multi-element row inside right column (e.g. bottom_right_stack)
      const subRowControls = row.map((el, i) => {
        if (el.type.includes('button')) {
          const padW = el.customPadW !== null ? Number(el.customPadW) : (i === row.length - 1 ? el.w + 10 : el.w);
          const padH = el.customPadH !== null ? Number(el.customPadH) : Math.round(el.h + 5);
          return buildButtonEntry(el, padW, padH);
        }
        return buildImageEntry(el);
      });

      return {
        [`bottom_right_stack`]: {
          "type": "stack_panel",
          "size": ["100%", "100%"],
          "orientation": "horizontal",
          "anchor_from": "center",
          "anchor_to": "center",
          "collection_name": "form_buttons",
          "controls": subRowControls
        }
      };
    });

    const leftColWidth = Math.max(...leftElements.map(e => (e.customPadW ? Number(e.customPadW) : e.w + 10)));
    const leftColPercent = Math.round((leftColWidth / (project.dialogWidth - 16)) * 100);

    return {
      [panelName]: {
        "type": "stack_panel",
        "size": ["100%", "100%"],
        "orientation": "vertical",
        "anchor_from": "center",
        "anchor_to": "center",
        "collection_name": "form_buttons",
        "controls": [
          {
            "bottom_stack": {
              "type": "stack_panel",
              "size": ["100%", "100%"],
              "orientation": "horizontal",
              "anchor_from": "center",
              "anchor_to": "center",
              "collection_name": "form_buttons",
              "controls": [
                {
                  "idkstack": {
                    "type": "stack_panel",
                    "size": [`${leftColPercent}%`, "100%"],
                    "orientation": "vertical",
                    "anchor_from": "center",
                    "anchor_to": "center",
                    "collection_name": "form_buttons",
                    "controls": leftControls
                  }
                },
                {
                  "right_stack": {
                    "type": "stack_panel",
                    "size": ["100%", "100%"],
                    "orientation": "vertical",
                    "anchor_from": "center",
                    "anchor_to": "center",
                    "collection_name": "form_buttons",
                    "controls": rightControls
                  }
                }
              ]
            }
          }
        ]
      }
    };
  }

  // 2. Horizontal Row-Based Stacking (Perks / Multi-Row Grid)
  const sorted = [...validElements].sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = [];

  sorted.forEach(el => {
    let placed = false;
    for (const row of rows) {
      const avgY = row.reduce((sum, item) => sum + item.y, 0) / row.length;
      if (Math.abs(el.y - avgY) <= 20) {
        row.push(el);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([el]);
  });

  const rowControls = rows.map((rowItems, rowIndex) => {
    rowItems.sort((a, b) => a.x - b.x);

    const itemsControls = rowItems.map((el, i) => {
      if (el.type.includes('button')) {
        let padW = el.customPadW !== null ? Number(el.customPadW) : null;
        let padH = el.customPadH !== null ? Number(el.customPadH) : null;

        if (padW === null) {
          if (rowItems.length === 1) {
            padW = Math.round(project.dialogWidth - 16);
          } else {
            // Symmetrical distribution
            padW = Math.round(el.w + ((project.dialogWidth - 16 - rowItems.reduce((s, e) => s + e.w, 0)) / rowItems.length));
          }
        }

        if (padH === null) {
          padH = Math.round(el.h + 5);
        }

        return buildButtonEntry(el, padW, padH);
      }
      return buildImageEntry(el);
    });

    if (rows.length === 1) {
      return itemsControls;
    }

    return {
      [`row_stack_${rowIndex}`]: {
        "type": "stack_panel",
        "size": rowIndex === 0 ? ["100%", "100%c"] : ["100%c", "100%c"],
        "orientation": "horizontal",
        "anchor_from": "center",
        "anchor_to": "center",
        "collection_name": "form_buttons",
        "controls": itemsControls
      }
    };
  });

  const finalControls = rows.length === 1 ? rowControls[0] : rowControls;

  return {
    [panelName]: {
      "type": "stack_panel",
      "size": ["100%", "100%c"],
      "orientation": "vertical",
      "anchor_from": "center",
      "anchor_to": "center",
      "controls": finalControls
    }
  };
}
