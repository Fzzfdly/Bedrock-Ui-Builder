/**
 * Bedrock JSON-UI Studio - Dialog Entry Generator for long_form.controls
 */

/**
 * Generates the long_form.controls dialog panel entry
 * @param {Object} project 
 * @returns {Object}
 */
export function generateDialogEntry(project) {
  const dialogId = `bakaui_${project.menuName || 'custom'}`;
  const btnPanelRef = `server_form.my_custom_panel_${project.menuName || 'custom'}`;
  const cw = Number(project.dialogWidth) || 322.5;
  const ch = Number(project.dialogHeight) || 180;

  const stackControls = [
    {
      "padding": {
        "type": "panel",
        "size": ["100%", 8]
      }
    }
  ];

  if (project.enableBody) {
    stackControls.push({
      "my_form_body@server_form.my_form_body_main": {}
    });
  }

  stackControls.push({
    [`button_panel@${btnPanelRef}`]: {}
  });

  return {
    [dialogId]: {
      "type": "panel",
      "size": [cw, ch],
      "layer": 2,
      "controls": [
        {
          "indent_panel": {
            "type": "panel",
            "size": ["100% - 16px", "100%"],
            "controls": [
              {
                "my_form_label@server_form.my_form_label": {}
              },
              {
                "my_close_button@server_form.my_close_button": {
                  "offset": [-5, -20],
                  "layer": 64
                }
              },
              {
                "my_form_background@server_form.my_form_background": {
                  "size": ["100% + 18px", 5],
                  "anchor_from": "top_middle",
                  "anchor_to": "top_middle"
                }
              },
              {
                "darkfade@server_form.my_form_background_black": {
                  "size": [10000, 5000]
                }
              },
              {
                "content_stack": {
                  "type": "stack_panel",
                  "size": ["100%", "100%"],
                  "orientation": "vertical",
                  "controls": stackControls
                }
              }
            ]
          }
        }
      ],
      "bindings": [
        {
          "binding_name": "#title_text"
        },
        {
          "binding_type": "view",
          "source_property_name": `(not((#title_text - '${project.titleFilter}') = #title_text))`,
          "target_property_name": "#visible"
        }
      ]
    }
  };
}
