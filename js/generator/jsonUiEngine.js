/**
 * Bedrock JSON-UI Studio - Master Generator Engine
 */

import { generateBakaUiStackPanel } from './stackCalibrator.js';
import { generateAbsolutePanel } from './absoluteGenerator.js';
import { generateDialogEntry } from './dialogGenerator.js';
import { SERVER_FORM_BOILERPLATE } from '../config/templates.js';

export class JsonUiEngine {
  /**
   * Generates the button panel JSON object
   * @param {Array} elements 
   * @param {Object} project 
   * @returns {Object}
   */
  static generateButtonPanel(elements, project) {
    if (project.exportMode === 'absolute') {
      return generateAbsolutePanel(elements, project);
    }
    return generateBakaUiStackPanel(elements, project);
  }

  /**
   * Generates the dialog entry for long_form.controls
   * @param {Object} project 
   * @returns {Object}
   */
  static generateDialog(project) {
    return generateDialogEntry(project);
  }

  /**
   * Generates a full, complete, production-ready server_form.json file
   * @param {Array} elements 
   * @param {Object} project 
   * @returns {Object}
   */
  static generateFullServerForm(elements, project) {
    const base = JSON.parse(JSON.stringify(SERVER_FORM_BOILERPLATE));
    const dialogObj = this.generateDialog(project);
    const buttonPanelObj = this.generateButtonPanel(elements, project);

    // Assemble long_form root
    base.long_form = {
      "type": "panel",
      "size": ["100%", "100%"],
      "controls": [
        dialogObj
      ]
    };

    // Append custom panel definition
    const panelName = Object.keys(buttonPanelObj)[0];
    base[panelName] = buttonPanelObj[panelName];

    return base;
  }
}
