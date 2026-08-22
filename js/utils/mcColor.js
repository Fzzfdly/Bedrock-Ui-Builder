/**
 * Bedrock JSON-UI Studio - Minecraft Formatting & Color Utilities
 */

import { MC_COLORS, MC_FORMAT_CODES } from '../config/constants.js';

const COLOR_MAP = {
  '0': '#000000',
  '1': '#0000aa',
  '2': '#00aa00',
  '3': '#00aaaa',
  '4': '#aa0000',
  '5': '#aa00aa',
  '6': '#ffaa00',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': '#5555ff',
  'a': '#55ff55',
  'b': '#55ffff',
  'c': '#ff5555',
  'd': '#ff55ff',
  'e': '#ffff55',
  'f': '#ffffff',
  'g': '#ddd605'
};

/**
 * Converts text with § formatting into styled HTML spans
 * @param {string} text 
 * @returns {string} HTML string
 */
export function parseMcFormatting(text) {
  if (!text) return '';
  
  let currentColor = '#ffffff';
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let isStrikethrough = false;
  
  let html = '';
  let currentSegment = '';
  
  const flushSegment = () => {
    if (!currentSegment) return;
    let style = `color: ${currentColor};`;
    if (isBold) style += ' font-weight: bold;';
    if (isItalic) style += ' font-style: italic;';
    let textDecoration = [];
    if (isUnderline) textDecoration.push('underline');
    if (isStrikethrough) textDecoration.push('line-through');
    if (textDecoration.length > 0) style += ` text-decoration: ${textDecoration.join(' ')};`;
    
    // Escape HTML special characters
    const escaped = currentSegment
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
      
    html += `<span style="${style}">${escaped}</span>`;
    currentSegment = '';
  };
  
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '§' && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();
      
      if (COLOR_MAP[code]) {
        flushSegment();
        currentColor = COLOR_MAP[code];
        isBold = false;
        isItalic = false;
        isUnderline = false;
        isStrikethrough = false;
        i++;
        continue;
      } else if (code === 'l') {
        flushSegment();
        isBold = true;
        i++;
        continue;
      } else if (code === 'o') {
        flushSegment();
        isItalic = true;
        i++;
        continue;
      } else if (code === 'n') {
        flushSegment();
        isUnderline = true;
        i++;
        continue;
      } else if (code === 'm') {
        flushSegment();
        isStrikethrough = true;
        i++;
        continue;
      } else if (code === 'r') {
        flushSegment();
        currentColor = '#ffffff';
        isBold = false;
        isItalic = false;
        isUnderline = false;
        isStrikethrough = false;
        i++;
        continue;
      }
    }
    currentSegment += text[i];
  }
  
  flushSegment();
  return html;
}

/**
 * Strips all § formatting codes from a string
 * @param {string} text 
 * @returns {string} Plain text
 */
export function stripMcCodes(text) {
  if (!text) return '';
  return text.replace(/§[0-9a-fklmnor]/gi, '');
}

/**
 * Finds the closest Minecraft color code for a hex string
 * @param {string} hex 
 * @returns {string} e.g. "§f"
 */
export function hexToMcCode(hex) {
  if (!hex) return '§f';
  const cleanHex = hex.toLowerCase().trim();
  const match = MC_COLORS.find(c => c.hex.toLowerCase() === cleanHex);
  if (match) return match.code;
  return '§f';
}

/**
 * Formats text with a chosen Minecraft color code
 * @param {string} rawText 
 * @param {string} colorCode 
 * @returns {string} e.g. "§bMy Button§r"
 */
export function formatWithColorCode(rawText, colorCode = '§f') {
  const stripped = stripMcCodes(rawText);
  return `${colorCode}${stripped}§r`;
}
