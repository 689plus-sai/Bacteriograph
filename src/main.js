import './style.css';
import { sketch } from './sketch';
import { previewSketch } from './previewSketch';
import p5 from 'p5';

// Ensure DOM is ready
p5.disableFriendlyErrors = true;

window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Axial Halley Sketches...');
    let mainP5, previewP5;

    try {
        mainP5 = new p5(sketch, 'canvas-container');
        console.log('Main P5 initialized');
    } catch (e) {
        console.error('Error initializing main sketch:', e);
    }

    /* 
    try {
        previewP5 = new p5(previewSketch, 'sample-view');
        console.log('Preview P5 initialized');
    } catch (e) {
        console.error('Error initializing preview sketch:', e);
    } 
    */

    // Centralized Interaction Logic
    const sText = document.getElementById('input-text');

    const updateAll = (val) => {
        if (!val) return;
        if (mainP5 && mainP5.updateContent) mainP5.updateContent(val);
        if (previewP5 && previewP5.updateContent) previewP5.updateContent(val);
    };

    if (sText) {
        sText.addEventListener('input', (e) => {
            if (!e.isComposing) updateAll(e.target.value);
        });
        sText.addEventListener('compositionend', (e) => updateAll(e.data));
    }

    // Button Logic
    // Import helper dynamically or logic here?
    // Let's implement simple button handlers here

    const setRandom = () => {
        // Simple Katakana Randomizer
        const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
        if (sText) sText.value = char;
        updateAll(char);
    };

    document.getElementById('btn-random')?.addEventListener('click', setRandom);
    document.getElementById('btn-next')?.addEventListener('click', setRandom); // Reuse for now
    document.getElementById('btn-prev')?.addEventListener('click', setRandom);

    // Expose for debugging
    window.mainP5 = mainP5;
    window.previewP5 = previewP5;

    // Initial Sync
    if (sText && sText.value) {
        console.log("Initial Sync with value:", sText.value);
        updateAll(sText.value);
    } else {
        // Force default 'ア' sync
        updateAll('ア');
    }

    // --- SLIDER CONTROLS ---
    const bindSlider = (id, paramKey, parser = parseFloat) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                const val = parser(e.target.value);
                if (mainP5 && mainP5.updateParam) mainP5.updateParam(paramKey, val);
            });
        }
    };

    bindSlider('param-size', 'size');
    bindSlider('param-zoom', 'zoom');
    bindSlider('param-radius', 'radius');
    bindSlider('param-gravity', 'gravity');
    bindSlider('param-reaction', 'reaction');
    bindSlider('param-hue', 'hue');

    // Global Key Listener for Pause
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent submission or other default actions
            if (mainP5 && mainP5.togglePause) {
                mainP5.togglePause();
            }
        }
    });

    // --- UI/MENU TOGGLE LOGIC ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const drawer = document.getElementById('settings-drawer');

    const toggleMenu = () => {
        if (drawer) drawer.classList.toggle('open');
    };

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuClose) menuClose.addEventListener('click', toggleMenu);

    // Close menu when clicking outside (Overlay click)
    document.addEventListener('click', (e) => {
        if (drawer && drawer.classList.contains('open') &&
            !drawer.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            drawer.classList.remove('open');
        }
    });

});
