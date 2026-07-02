"use strict";

const Tools = {
    selected: null,
    buttons: [],

    rules: Object.freeze({
        axe: ["oak-log", "oak-leaves"],
        pickaxe: ["stone", "coal", "iron", "gold", "diamond", "emerald", "redstone"],
        shovel: ["grass", "dirt", "sand"]
    }),

    keyMap: Object.freeze({
        1: "axe",
        2: "pickaxe",
        3: "shovel"
    }),

    init() 
    {
        this.buttons = [...document.querySelectorAll("[data-tool]")];
        this.bindEvents();
    },

    bindEvents()
    {
        this.buttons.forEach((button) => {
            button.addEventListener("click", () => {
                this.select(button.dataset.tool);
            });
        });

        document.addEventListener("keydown", ({ key }) => {
            const tool = this.keyMap[key];

            if (!tool)
            {
                return;
            }

            this.select(tool);
        });
    },

    select(toolName) 
    {
        if (this.selected === toolName) 
        {
            this.reset();
            Inventory.render();
            return;
        }

        this.selected = toolName;
        Inventory.selected = null;

        this.updateUI();
        Inventory.render();
    },

    canBreak(tileType) 
    {
        return this.rules[this.selected]?.includes(tileType) ?? false;
    },

    reset() {
        this.selected = null;
        this.updateUI();
    },

    updateUI() 
    {
        this.buttons.forEach((button) => {
            button.classList.toggle("hotbar_slot--active", button.dataset.tool === this.selected);
        });
    }
};