/**
 * Bedrock JSON-UI Studio - Pixel-Perfect Absolute Panel Generator
 * Uses native Bedrock JSON-UI anchor_from, anchor_to, offset, and size properties
 */

/**
 * Generates an absolute-positioned Bedrock JSON-UI panel
 * @param {Array} elements 
 * @param {Object} project 
 * @returns {Object}
 */
export function generateAbsolutePanel(elements, project) {
  const panelName = `my_custom_panel_${project.menuName || 'custom'}`;
  const validElements = elements.filter(e => e.visible !== false);

  // Sort by layer/z-index
  validElements.sort((a, b) => (a.layer || 2) - (b.layer || 2));

  // Determine top margin offset based on body state
  const topMargin = project.enableBody ? (project.bodyHeight + 8) : 8;

  const controls = validElements.map(el => {
    // Relative Y offset inside the button panel
    const relY = Math.max(0, el.y - topMargin);

    if (el.type.includes('button')) {
      const templateRef = el.type === 'custom_button_menu'
        ? 'server_form.custom_button_menu'
        : el.type === 'custom_button_shop'
        ? 'server_form.custom_button_shop'
        : el.type === 'test_button'
        ? 'server_form.test_button'
        : 'server_form.custom_button';

      const props = {
        "anchor_from": "top_left",
        "anchor_to": "top_left",
        "offset": [el.x, relY],
        "size": [el.w, el.h],
        "$button_size": [el.w, el.h],
        "$padding_size": [el.w, el.h],
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

    return {
      [`${el.name}`]: {
        "type": "image",
        "anchor_from": "top_left",
        "anchor_to": "top_left",
        "offset": [el.x, relY],
        "size": [el.w, el.h],
        "layer": el.layer || 2,
        ...(el.alpha !== 1.0 ? { "alpha": el.alpha } : {}),
        "texture": el.texture || "textures/bakaui/custom_bg_dark"
      }
    };
  });

  return {
    [panelName]: {
      "type": "panel",
      "size": ["100%", "100%"],
      "anchor_from": "center",
      "anchor_to": "center",
      "collection_name": "form_buttons",
      "controls": controls
    }
  };
}
