/**
 * Bedrock JSON-UI Studio - Templates & Preloaded Layouts
 * Extracted and calibrated from official BakaUI server_form.json
 */

export const SAMPLE_TEMPLATES = [
  {
    id: "bakaui_menu",
    title: "BakaUI Navigator (Default Main Menu)",
    description: "Complex hierarchical layout with Left Column (Rank, Premium, Settings) and Right Column (Utilities, Shop, Warp).",
    menuName: "main",
    titleFilter: "§6Baka §fNavigator§r",
    enableBody: true,
    bodyText: "Choose a category below to navigate the server:",
    bodyHeight: 28,
    dialogWidth: 322.5,
    dialogHeight: 180,
    exportMode: "stack",
    elements: [
      // Left Column
      {
        id: "btn_rank",
        name: "rank",
        type: "custom_button",
        x: 10,
        y: 40,
        w: 127.5,
        h: 84,
        iconSize: 64,
        layer: 4,
        alpha: 1.0,
        text: "Rank Options",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 3,
        customPadW: 137.5,
        customPadH: 89,
        visible: true
      },
      {
        id: "btn_premium",
        name: "premium",
        type: "custom_button_menu",
        x: 10,
        y: 129,
        w: 127.5,
        h: 20,
        iconSize: 16,
        layer: 4,
        alpha: 1.0,
        text: "Premium",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 4,
        customPadW: 137.5,
        customPadH: 25,
        visible: true
      },
      {
        id: "btn_settings",
        name: "settings",
        type: "custom_button_menu",
        x: 10,
        y: 154,
        w: 127.5,
        h: 20,
        iconSize: 16,
        layer: 4,
        alpha: 1.0,
        text: "Settings",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 5,
        customPadW: 137.5,
        customPadH: 25,
        visible: true
      },
      // Right Column Top
      {
        id: "btn_utilities",
        name: "utilities",
        type: "custom_button",
        x: 147.5,
        y: 40,
        w: 169,
        h: 64,
        iconSize: 36,
        layer: 4,
        alpha: 1.0,
        text: "Utilities",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 2,
        customPadW: 169,
        customPadH: 69,
        visible: true
      },
      // Right Column Bottom Row
      {
        id: "btn_shop",
        name: "shop",
        type: "custom_button",
        x: 147.5,
        y: 109,
        w: 82,
        h: 65,
        iconSize: 36,
        layer: 4,
        alpha: 1.0,
        text: "Shop",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 1,
        customPadW: 82,
        customPadH: 70,
        visible: true
      },
      {
        id: "btn_warp",
        name: "warp",
        type: "custom_button",
        x: 234.5,
        y: 109,
        w: 82,
        h: 65,
        iconSize: 36,
        layer: 4,
        alpha: 1.0,
        text: "Warps",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 0,
        customPadW: 92,
        customPadH: 70,
        visible: true
      }
    ]
  },
  {
    id: "bakaui_shop_menu",
    title: "BakaUI Shop Menu",
    description: "Hero big square button on left (Item Shop) and 3 options on right (Sell, Enchant, Black Market).",
    menuName: "shop_menu",
    titleFilter: "§fShop Menu§r",
    enableBody: true,
    bodyText: "Select a marketplace category:",
    bodyHeight: 28,
    dialogWidth: 345,
    dialogHeight: 180,
    exportMode: "stack",
    elements: [
      {
        id: "btn_itemshop",
        name: "itemshop",
        type: "custom_button",
        x: 10,
        y: 40,
        w: 134,
        h: 134,
        iconSize: 128,
        layer: 4,
        alpha: 1.0,
        text: "Item Shop",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 3,
        customPadW: 144,
        customPadH: 144,
        visible: true
      },
      {
        id: "btn_sell",
        name: "sell",
        type: "custom_button",
        x: 154,
        y: 40,
        w: 185,
        h: 64,
        iconSize: 64,
        layer: 4,
        alpha: 1.0,
        text: "Sell Items",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 2,
        customPadW: 185,
        customPadH: 74,
        visible: true
      },
      {
        id: "btn_enchant",
        name: "enchant",
        type: "custom_button",
        x: 154,
        y: 109,
        w: 90,
        h: 65,
        iconSize: 56,
        layer: 4,
        alpha: 1.0,
        text: "Enchants",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 1,
        customPadW: 90,
        customPadH: 65,
        visible: true
      },
      {
        id: "btn_blackmarket",
        name: "blackmarket",
        type: "custom_button",
        x: 249,
        y: 109,
        w: 90,
        h: 65,
        iconSize: 56,
        layer: 4,
        alpha: 1.0,
        text: "Black Market",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 0,
        customPadW: 100,
        customPadH: 65,
        visible: true
      }
    ]
  },
  {
    id: "bakaui_perks",
    title: "BakaUI Perks Menu (3-Column Grid)",
    description: "Symmetrical 3-card horizontal layout for Teleport, Prefix, and Clans.",
    menuName: "perks",
    titleFilter: "§fPerks§r",
    enableBody: true,
    bodyText: "Unlock exclusive abilities and perks:",
    bodyHeight: 28,
    dialogWidth: 300,
    dialogHeight: 185,
    exportMode: "stack",
    elements: [
      {
        id: "btn_teleport",
        name: "teleport",
        type: "custom_button",
        x: 10,
        y: 40,
        w: 80,
        h: 99,
        iconSize: 64,
        layer: 4,
        alpha: 1.0,
        text: "Teleport",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 0,
        customPadW: 110,
        customPadH: 109,
        visible: true
      },
      {
        id: "btn_prefix",
        name: "prefix",
        type: "custom_button",
        x: 100,
        y: 40,
        w: 80,
        h: 99,
        iconSize: 72,
        layer: 4,
        alpha: 1.0,
        text: "Prefix",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 1,
        customPadW: 70,
        customPadH: 109,
        visible: true
      },
      {
        id: "btn_clans",
        name: "clans",
        type: "custom_button",
        x: 190,
        y: 40,
        w: 80,
        h: 99,
        iconSize: 72,
        layer: 4,
        alpha: 1.0,
        text: "Clans",
        fontType: "MinecraftTen",
        fontSize: 1.0,
        textColor: "#ffffff",
        mcColorCode: "§f",
        shadow: true,
        texture: "textures/bakaui/button_light",
        sliceTop: 3, sliceRight: 3, sliceBottom: 3, sliceLeft: 3,
        iconTexture: "textures/bakaui/trash",
        collectionIndex: 2,
        customPadW: 110,
        customPadH: 109,
        visible: true
      }
    ]
  }
];

export const SERVER_FORM_BOILERPLATE = {
  "namespace": "server_form",
  "my_form_body_main": {
    "type": "panel",
    "anchor_from": "top_middle",
    "size": ["100% + 18px", 28],
    "$offset|default": [-9, 0],
    "layer": 8,
    "controls": [
      {
        "form_body_text": {
          "type": "label",
          "text": "#form_text",
          "layer": 8,
          "offset": "$offset",
          "bindings": [
            { "binding_name": "#form_text" }
          ]
        }
      },
      {
        "my_form_background@server_form.my_form_background_dark": {
          "size": ["100% - 22px", "100%"],
          "offset": "$offset"
        }
      }
    ]
  },
  "my_form_body": {
    "type": "panel",
    "anchor_from": "top_middle",
    "size": ["100%", 28],
    "layer": 8,
    "controls": [
      {
        "form_body_text": {
          "type": "label",
          "text": "#form_text",
          "layer": 8,
          "bindings": [
            { "binding_name": "#form_text" }
          ]
        }
      },
      {
        "my_form_background@server_form.my_form_background_dark": {
          "size": ["100% - 22px", "100%"]
        }
      }
    ]
  },
  "my_form_label": {
    "type": "label",
    "font_type": "MinecraftTen",
    "font_size": "large",
    "anchor_from": "top_left",
    "anchor_to": "top_left",
    "text": "#title_text",
    "layer": 8,
    "offset": [9, -26],
    "bindings": [
      { "binding_name": "#title_text" }
    ]
  },
  "my_form_background": {
    "type": "image",
    "size": ["100% + 5px", "100% + 5px"],
    "layer": 10,
    "texture": "textures/bakaui/custom_bg_divider",
    "alpha": 1
  },
  "my_form_background_dark": {
    "type": "image",
    "size": ["100% + 5px", "100% + 5px"],
    "texture": "textures/bakaui/custom_bg_dark",
    "alpha": 0.4
  },
  "my_form_background_black": {
    "type": "image",
    "size": ["100% + 5px", "100% + 5px"],
    "texture": "textures/bakaui/custom_bg",
    "alpha": 0.4,
    "layer": 0
  },
  "my_close_button": {
    "type": "button",
    "default_control": "default",
    "hover_control": "hover",
    "$default_texture|default": "textures/bakaui/close_button",
    "$hover_texture|default": "textures/bakaui/close_button_hover",
    "$alpha|default": 1,
    "$size|default": [14, 14],
    "anchor_from": "top_right",
    "anchor_to": "top_right",
    "size": [12, 12],
    "sound_name": "random.pop2",
    "controls": [
      {
        "bg@server_form.my_form_background": { "alpha": 1 }
      },
      {
        "default": {
          "type": "image",
          "size": "$size",
          "texture": "$default_texture",
          "alpha": "$alpha",
          "layer": 10
        }
      },
      {
        "hover": {
          "type": "image",
          "size": "$size",
          "texture": "$hover_texture",
          "alpha": "$alpha",
          "layer": 10
        }
      }
    ],
    "button_mappings": [
      { "from_button_id": "button.menu_select", "to_button_id": "button.menu_exit", "mapping_type": "pressed" },
      { "from_button_id": "button.menu_ok", "to_button_id": "button.menu_exit", "mapping_type": "focused" }
    ]
  },
  "custom_button": {
    "$button_size|default": [64, 64],
    "$padding_size|default": [69, 69],
    "$icon_size|default": [32, 32],
    "$default_button_texture": "textures/bakaui/button_light",
    "$hover_button_texture": "textures/bakaui/button_lighthover",
    "$pressed_button_texture": "textures/bakaui/button_lightpressed",
    "type": "panel",
    "size": "$padding_size",
    "controls": [
      {
        "mainUI": {
          "type": "panel",
          "size": "$button_size",
          "controls": [
            {
              "panel_name": {
                "type": "panel",
                "size": "$button_size",
                "bindings": [
                  {
                    "binding_type": "view",
                    "source_control_name": "image",
                    "resolve_sibling_scope": true,
                    "source_property_name": "(not (#texture = ''))",
                    "target_property_name": "#visible"
                  }
                ],
                "controls": [
                  {
                    "image": {
                      "type": "image",
                      "layer": 31,
                      "size": "$icon_size",
                      "offset": [-3, 0],
                      "bindings": [
                        { "binding_name": "#form_button_texture", "binding_name_override": "#texture", "binding_type": "collection", "binding_collection_name": "form_buttons" },
                        { "binding_name": "#form_button_texture_file_system", "binding_name_override": "#texture_file_system", "binding_type": "collection", "binding_collection_name": "form_buttons" },
                        { "binding_type": "view", "source_property_name": "(not ((#texture = '') or (#texture = 'loading')))", "target_property_name": "#visible" }
                      ]
                    }
                  },
                  {
                    "text": {
                      "type": "label",
                      "text": "#form_button_text",
                      "font_type": "MinecraftTen",
                      "font_size": "normal",
                      "shadow": true,
                      "layer": 32,
                      "color": [0, 0, 0],
                      "offset": [5, -5],
                      "anchor_from": "bottom_left",
                      "anchor_to": "bottom_left",
                      "bindings": [
                        { "binding_name": "#form_button_text", "binding_type": "collection", "binding_collection_name": "form_buttons" }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "form_button@common_buttons.light_text_button": {
                "$pressed_button_name": "button.form_button_click",
                "anchor_from": "top_left",
                "anchor_to": "top_left",
                "size": "$button_size",
                "offset": [-3, 0],
                "$button_text": "#null",
                "$button_text_binding_type": "collection",
                "$button_text_grid_collection_name": "form_buttons",
                "$button_text_max_size": ["100%", 20],
                "bindings": [
                  { "binding_type": "collection_details", "binding_collection_name": "form_buttons" },
                  { "binding_name": "#form_button_text", "binding_name_override": "#button_text", "binding_type": "collection", "binding_collection_name": "form_buttons" },
                  { "binding_type": "view", "source_property_name": "(not ((#button_text = '')))", "target_property_name": "#visible" }
                ]
              }
            }
          ]
        }
      }
    ]
  },
  "custom_button_menu": {
    "$button_size|default": [70, 20],
    "$icon_size|default": [15, 15],
    "$padding_size|default": [80, 23],
    "$default_button_texture": "textures/bakaui/button_light",
    "$hover_button_texture": "textures/bakaui/button_lighthover",
    "$pressed_button_texture": "textures/bakaui/button_lightpressed",
    "type": "panel",
    "size": "$padding_size",
    "controls": [
      {
        "mainUI": {
          "type": "panel",
          "size": "$button_size",
          "controls": [
            {
              "panel_name": {
                "type": "panel",
                "size": "$button_size",
                "bindings": [
                  {
                    "binding_type": "view",
                    "source_control_name": "image",
                    "resolve_sibling_scope": true,
                    "source_property_name": "(not (#texture = ''))",
                    "target_property_name": "#visible"
                  }
                ],
                "controls": [
                  {
                    "text": {
                      "type": "label",
                      "text": "#form_button_text",
                      "font_type": "MinecraftTen",
                      "font_size": "normal",
                      "shadow": true,
                      "layer": 32,
                      "color": [0, 0, 0],
                      "offset": [-2, -1],
                      "anchor_from": "center",
                      "anchor_to": "center",
                      "bindings": [
                        { "binding_name": "#form_button_text", "binding_type": "collection", "binding_collection_name": "form_buttons" }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "form_button@common_buttons.light_text_button": {
                "$pressed_button_name": "button.form_button_click",
                "anchor_from": "top_left",
                "anchor_to": "top_left",
                "size": "$button_size",
                "offset": [-3, 0],
                "$button_text": "#null",
                "$button_text_binding_type": "collection",
                "$button_text_grid_collection_name": "form_buttons",
                "$button_text_max_size": ["100%", 20],
                "bindings": [
                  { "binding_type": "collection_details", "binding_collection_name": "form_buttons" }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};
