"use strict";

const Landing = {
    splashText: null,
    startButton: null,
    soundButton: null,
    music: null,

    splashes: [
        "MD BASHER EDITION!",
        "Now with Trees!",
        "2D, but Blocky!",
        "Use the Right Tool!",
        "Generate • Mine • Build"
    ],

    init() 
    {
        this.splashText = document.getElementById("splashText");
        this.startButton = document.getElementById("startBtn");
        this.soundButton = document.getElementById("soundBtn");
        this.music = document.getElementById("backgroundMusic");

        this.updateSoundButton();
        this.showSplash();
        this.bindEvents();
    },

    updateSoundButton()
    {
        if (!this.music || !this.soundButton)
        {
            return;
        }

        this.soundButton.textContent = this.music.muted ? "🔇" : "🔊";
    },

    bindEvents()
    {
        this.startButton?.addEventListener("click", (event) => {
            event.preventDefault();

            document.body.classList.add("fade-out");

            setTimeout(() => {
                location.href = this.startButton.href;
            }, 300);
        });

        document.addEventListener("click", () => {
            if (!this.music)
            {
                return;
            }

            this.music.muted = !this.music.muted;
            this.music.play().catch(() => {});
            this.updateSoundButton();

        }, { once: true });

        this.bindDialog("tutorialBtn", "tutorialDialog", "closeTutorialBtn");
    },

    showSplash() 
    {
        if (!this.splashText)
        {
            return;
        }

        const index = Math.floor(Math.random() * this.splashes.length);
        this.splashText.textContent = this.splashes[index];
    },

    bindDialog(openId, dialogId, closeId) 
    {
        const dialog = document.getElementById(dialogId);

        document.getElementById(openId)?.addEventListener("click", () => {
            dialog?.showModal();
        });

        document.getElementById(closeId)?.addEventListener("click", () => {
            dialog?.close();
        });

        dialog?.addEventListener("click", ({ target }) => {
            if (target === dialog) 
            {
                dialog.close();
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Landing.init();
});