"use strict";

const Inventory = {
    element: null,
    selected: null,

    itemAliases: {
        grass: "dirt",
        dirt: "dirt"
    },

    items: {
        dirt: 0,
        stone: 0,
        sand: 0,
        "oak-log": 0,
        "oak-leaves": 0,
        coal: 0,
        iron: 0,
        gold: 0,
        diamond: 0,
        emerald: 0,
        redstone: 0
    },

    images: {
        dirt: "./assets/items/dirt.png",
        stone: "./assets/items/cobblestone.png",
        sand: "./assets/items/sand.png",
        "oak-log": "./assets/items/oak-log.png",
        "oak-leaves": "./assets/items/oak-leaves.png",
        coal: "./assets/items/coal.png",
        iron: "./assets/items/raw-iron.png",
        gold: "./assets/items/raw-gold.png",
        diamond: "./assets/items/diamond.png",
        emerald: "./assets/items/emerald.png",
        redstone: "./assets/items/redstone.png"
    },

    labels: {
        dirt: "Dirt",
        stone: "Stone",
        sand: "Sand",
        "oak-log": "Oak Log",
        "oak-leaves": "Oak Leaves",
        coal: "Coal Ore",
        iron: "Iron Ore",
        gold: "Gold Ore",
        diamond: "Diamond Ore",
        emerald: "Emerald Ore",
        redstone: "Redstone Ore"
    },

    init() 
    {
        this.element = document.getElementById("inventory");
    },

    add(tileType) 
    {
        const item = this.itemAliases[tileType] ?? tileType;

        this.items[item]++;
        this.render();
    },

    remove(tileType) 
    {
        const item = this.itemAliases[tileType] ?? tileType;

        if (this.items[item] <= 0) 
        {
            return false;
        }

        this.items[item]--;

        if (this.items[item] === 0 && this.selected === item)
        {
            this.selected = null;
        }

        this.render();
        return true;
    },

    select(itemName) 
    {
        if (this.selected === itemName)
        {
            this.selected = null;
        } 
        else
        {
            this.selected = itemName;
            Tools.reset();
        }

        this.render();
    },

    render() {
        if (!this.element)
        {
            return;
        }

        this.element.innerHTML = "";

        Object.entries(this.items).forEach(([itemName, count]) => {
            if (count <= 0)
            {
                return;
            }

            const itemButton = document.createElement("button");
            itemButton.type = "button";
            itemButton.className = "inventory_item";
            itemButton.title = `${this.labels[itemName]} ×${count}`;
            itemButton.classList.toggle("inventory_item--active", this.selected === itemName);

            itemButton.innerHTML = `
                <img class="inventory_icon" src="${this.images[itemName]}" alt="${this.labels[itemName]}" draggable="false">
                <span class="inventory_count">${count}</span>
            `;

            itemButton.addEventListener("click", () => {
                this.select(itemName);
            });
            this.element.appendChild(itemButton);
        });
    },

    reset() 
    {
        Object.keys(this.items).forEach((item) => {
            this.items[item] = 0;
        });

        this.selected = null;
        this.render();
    }
};