/**
 * Bedrock JSON-UI Studio Constants
 */

export const MC_COLORS = [
  { code: "§f", name: "§f White (Default)", hex: "#ffffff" },
  { code: "§0", name: "§0 Black", hex: "#000000" },
  { code: "§1", name: "§1 Dark Blue", hex: "#0000aa" },
  { code: "§2", name: "§2 Dark Green", hex: "#00aa00" },
  { code: "§3", name: "§3 Dark Aqua", hex: "#00aaaa" },
  { code: "§4", name: "§4 Dark Red", hex: "#aa0000" },
  { code: "§5", name: "§5 Dark Purple", hex: "#aa00aa" },
  { code: "§6", name: "§6 Gold", hex: "#ffaa00" },
  { code: "§7", name: "§7 Gray", hex: "#aaaaaa" },
  { code: "§8", name: "§8 Dark Gray", hex: "#555555" },
  { code: "§9", name: "§9 Blue", hex: "#5555ff" },
  { code: "§a", name: "§a Green", hex: "#55ff55" },
  { code: "§b", name: "§b Aqua", hex: "#55ffff" },
  { code: "§c", name: "§c Red", hex: "#ff5555" },
  { code: "§d", name: "§d Light Purple", hex: "#ff55ff" },
  { code: "§e", name: "§e Yellow", hex: "#ffff55" },
  { code: "§g", name: "§g Minecoin Gold", hex: "#ddd605" }
];

export const MC_FORMAT_CODES = [
  { code: "§l", name: "Bold", style: "font-weight: bold;" },
  { code: "§o", name: "Italic", style: "font-style: italic;" },
  { code: "§r", name: "Reset", style: "" }
];

export const TEXTURE_PRESETS = [
  { name: "Button Light (Default)", path: "textures/bakaui/button_light", slice: [3, 3, 3, 3] },
  { name: "Button Light Hover", path: "textures/bakaui/button_lighthover", slice: [3, 3, 3, 3] },
  { name: "Button Light Pressed", path: "textures/bakaui/button_lightpressed", slice: [3, 3, 3, 3] },
  { name: "Custom BG Divider", path: "textures/bakaui/custom_bg_divider", slice: [3, 3, 3, 3] },
  { name: "Custom BG Dark", path: "textures/bakaui/custom_bg_dark", slice: [3, 3, 3, 3] },
  { name: "Custom BG Black", path: "textures/bakaui/custom_bg", slice: [3, 3, 3, 3] },
  { name: "Close Button", path: "textures/bakaui/close_button", slice: [0, 0, 0, 0] },
  { name: "Trash Icon", path: "textures/bakaui/trash", slice: [0, 0, 0, 0] }
];

export const SCREEN_PRESETS = [
  { id: "bakaui_nav", name: "BakaUI Navigator (322.5 x 180)", w: 322.5, h: 180, bodyHeight: 28, enableBody: true },
  { id: "default_long", name: "Default Long Form (350 x 200)", w: 350, h: 200, bodyHeight: 28, enableBody: true },
  { id: "custom_shop", name: "Custom Shop (322.5 x 200)", w: 322.5, h: 200, bodyHeight: 28, enableBody: true },
  { id: "perks_casino", name: "Perks & Casino (300 x 185)", w: 300, h: 185, bodyHeight: 28, enableBody: true },
  { id: "dragon_menu", name: "Dragon Menu / Rankup (270 x 185)", w: 270, h: 185, bodyHeight: 28, enableBody: true },
  { id: "compact_homes", name: "Compact Homes (322.5 x 165)", w: 322.5, h: 165, bodyHeight: 28, enableBody: true },
  { id: "utilities", name: "Utilities Menu (322.5 x 180)", w: 322.5, h: 180, bodyHeight: 28, enableBody: true }
];

export const ELEMENT_TYPES = {
  CUSTOM_BUTTON: "custom_button",
  CUSTOM_BUTTON_MENU: "custom_button_menu",
  CUSTOM_BUTTON_SHOP: "custom_button_shop",
  TEST_BUTTON: "test_button",
  IMAGE: "image",
  DIVIDER: "divider",
  LABEL: "label"
};
