"use strict";

const World = {
    rows: 20,
    columns: 38,

    element: null,
    depthReadout: null,

    map: [],
    sandyColumns: new Set(),

    drops: Object.freeze({
        grass: "dirt",
        dirt: "dirt",
        stone: "stone",
        sand: "sand",
        coal: "coal",
        iron: "iron",
        gold: "gold",
        diamond: "diamond",
        emerald: "emerald",
        redstone: "redstone",
        "oak-log": "oak-log",
        "oak-leaves": "oak-leaves"
    }),

    init() 
    {
        this.element = document.getElementById("world");
        this.depthReadout = document.getElementById("depthReadout");

        this.element.style.setProperty("--world-rows", this.rows);
        this.element.style.setProperty("--world-columns", this.columns);

        this.generate();
    },

    reset() 
    {
        this.generate();
        this.render();
    },

    generate() 
    {
        this.map = [];

        const heights = this.generateHeights();

        this.pickSandyColumns();

        for (let row = 0; row < this.rows; row++) 
        {
            const currentRow = [];

            for (let col = 0; col < this.columns; col++) 
            {
                const ground = heights[col];

                let tile = "sky";

                if (row === ground) 
                {
                    tile = this.sandyColumns.has(col)
                        ? "sand"
                        : "grass";
                }

                else if (row > ground && row <= ground + 3) 
                {
                    tile = this.sandyColumns.has(col)
                        ? "sand"
                        : "dirt";
                }

                else if (row > ground + 3) 
                {
                    tile = this.getUndergroundTile(row);
                }

                currentRow.push(tile);
            }

            this.map.push(currentRow);
        }

        this.carveCaves(heights);
        this.addTrees(heights);
        this.updateReadouts(heights);
    },

    generateHeights() 
    {
        const heights = [];
        let level = 9 + Math.floor(Math.random() * 3);

        for (let col = 0; col < this.columns; col++) 
        {
            if (Math.random() < 0.42) 
            {
                level += Math.random() < 0.5 ? -1 : 1;

                level = this.clamp(level, 6, 13);
            }

            heights.push(level);
        }
        return this.smoothHeights(heights);
    },

    smoothHeights(heights) 
    {
        return heights.map((height, index) => {

            const left = heights[index - 1] ?? height;
            const right = heights[index + 1] ?? height;

            return Math.round((left + height + right) / 3);
        });
    },

    pickSandyColumns() 
    {
        this.sandyColumns.clear();

        const patches = 1 + Math.floor(Math.random() * 2);

        for (let i = 0; i < patches; i++) 
        {
            const start = Math.floor(Math.random() * (this.columns - 7));
            const length = 4 + Math.floor(Math.random() * 5);

            for (let col = start; col < start + length && col < this.columns; col++)
            {
                this.sandyColumns.add(col);
            }
        }
    },

    getUndergroundTile(row) 
    {
        const depth = row / this.rows;
        const chance = Math.random();

        if (depth > 0.72 && chance < 0.025) return "diamond";
        if (depth > 0.68 && chance < 0.045) return "emerald";
        if (depth > 0.58 && chance < 0.085) return "gold";
        if (depth > 0.48 && chance < 0.15) return "redstone";
        if (depth > 0.42 && chance < 0.24) return "iron";
        if (depth > 0.34 && chance < 0.34) return "coal";

        return "stone";
    },

    carveCaves(heights) 
    {
        const minDepth = Math.min(...heights) + 5;
        const caveCount = 8 + Math.floor(Math.random() * 5);

        for (let cave = 0; cave < caveCount; cave++) 
        {
            let row = this.clamp(
                minDepth + Math.floor(Math.random() * 8),
                minDepth,
                this.rows - 2
            );

            let col = Math.floor(Math.random() * this.columns);
            const length = 4 + Math.floor(Math.random() * 8);

            for (let step = 0; step < length; step++) 
            {
                this.clearCell(row, col);

                if (Math.random() < 0.45) 
                {
                    this.clearCell(row, col + 1);
                }

                if (Math.random() < 0.25) 
                {
                    this.clearCell(row + 1, col);
                }

                col += Math.random() < 0.5 ? 1 : -1;

                if (Math.random() < 0.35) 
                {
                    row += Math.random() < 0.5 ? 1 : -1;
                }

                row = this.clamp(row, minDepth, this.rows - 1);
                col = this.clamp(col, 0, this.columns - 1);
            }
        }
    },

    clearCell(row, col) 
    {
        if (!this.map[row]?.[col]) 
        {
            return;
        }

        if (this.map[row][col] !== "sky") 
        {
            this.map[row][col] = "empty";
        }
    },

    addTrees(heights) {
        for (let col = 2; col < this.columns - 3; col++) {

            if (Math.random() > 0.2) 
            {
                continue;
            }

            if (this.sandyColumns.has(col)) 
            {
                continue;
            }

            if (this.treeTooClose(col)) 
            {
                continue;
            }

            const ground = heights[col];
            const trunkHeight = 3 + Math.floor(Math.random() * 2);

            if (ground - trunkHeight - 2 < 0) 
            {
                continue;
            }

            for (let i = 1; i <= trunkHeight; i++) 
            {
                this.map[ground - i][col] = "oak-log";
            }

            this.placeLeaves(ground - trunkHeight, col);
            col += 3;
        }
    },

    treeTooClose(col) 
    {
        for (let row = 0; row < this.rows; row++) 
        {
            for (let x = col - 2; x <= col + 2; x++) 
            {
                if (this.map[row]?.[x] === "oak-log") 
                {
                    return true;
                }
            }
        }
        return false;
    },

    placeLeaves(row, col) 
    {
        const leaves = [
            [row, col],
            [row, col - 1],
            [row, col + 1],

            [row - 1, col],
            [row - 1, col - 1],
            [row - 1, col + 1],

            [row - 2, col]
        ];

        leaves.forEach(([r, c]) => {
            if (this.map[r]?.[c] === "sky") 
            {
                this.map[r][c] = "oak-leaves";
            }
        });
    },

    render() {
        if (!this.element)
        {
            return;
        }

        this.element.innerHTML = "";

        const fragment = document.createDocumentFragment();
        this.map.forEach((row, rowIndex) => {
            row.forEach((tileType, columnIndex) => {
                const tile = document.createElement("button");

                tile.type = "button";
                tile.className = `tile tile-${tileType}`;

                tile.dataset.row = rowIndex;
                tile.dataset.column = columnIndex;
                tile.dataset.type = tileType;

                tile.ariaLabel = this.getTileLabel(tileType);

                tile.addEventListener("click", () => {
                    this.handleClick(rowIndex, columnIndex);
                });
                fragment.appendChild(tile);
            });
        });
        this.element.appendChild(fragment);
    },

    handleClick(row, col)
    {
        const tileType = this.map[row][col];

        if (Inventory.selected)
        {
            return this.placeTile(row, col, tileType);
        }

        this.removeTile(row, col, tileType);
    },

    removeTile(row, col, tileType) 
    {
        if (tileType === "sky" || tileType === "empty")
        {
            return;
        }

        if (!Tools.canBreak(tileType)) 
        {
            return;
        }

        const tile = this.getTileElement(row, col);

        tile?.classList.add("tile-breaking");
        tile?.setAttribute("disabled", true);

        setTimeout(() => {

            this.map[row][col] = "empty";
            Inventory.add(this.drops[tileType] ?? tileType);

            this.render();

        }, 140);
    },

    placeTile(row, col, tileType) 
    {
        if (tileType !== "sky" && tileType !== "empty")
        {
            return;
        }

        const block = Inventory.selected;

        if (!Inventory.remove(block))
        {
            return;
        }

        this.map[row][col] = block;

        this.render();
    },

    getTileElement(row, col) 
    {
        return this.element.querySelector(`[data-row="${row}"][data-column="${col}"]`);
    },

    getTileLabel(tileType) 
    {
        const labels = { sky: "Sky", empty: "Empty Space" };
        return (labels[tileType] ?? tileType.replaceAll("-", " "));
    },

    updateReadouts(heights) 
    {
        if (!this.depthReadout)
        {
            return;
        }

        const average = Math.round(heights.reduce((sum, value) => sum + value, 0) / heights.length);
        this.depthReadout.textContent = `Average Height: ${average}`;
    },

    clamp(value, min, max) 
    {
        return Math.max(
            min,
            Math.min(max, value)
        );
    }
};