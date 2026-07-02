"use strict";

const Game = {
    loadingScreen: null,
    resetButton: null,
    soundButton: null,

    init()
    {
        this.loadingScreen = document.getElementById("loadingScreen");
        this.resetButton = document.getElementById("resetBtn");
        this.soundButton = document.getElementById("soundBtn");

        Inventory.init();
        Tools.init();
        World.init();
        World.render();

        this.bindEvents();
        this.hideLoadingScreen();
    },

    bindEvents()
    {
        this.resetButton?.addEventListener("click", () => this.reset());

        document.addEventListener("keydown", ({ key }) => {
            if (key !== "Escape") 
            {
                return;
            }

            Tools.reset();
            Inventory.selected = null;
            Inventory.render();
        });
    },

    hideLoadingScreen()
    {
        if (!this.loadingScreen)
        {
            return;
        }

        setTimeout(() => {
            this.loadingScreen.classList.add("hidden");
        }, 950);
    },

    reset()
    {
        Tools.reset();

        Inventory.reset();
        Inventory.render();

        World.reset();
        World.render();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Game.init();
});