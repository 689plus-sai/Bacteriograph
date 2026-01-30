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

    // FIX: Explicitly prevent default touchmove on canvas to stop scrolling on iOS
    const container = document.getElementById('canvas-container');
    if (container) {
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        // iOS SPECIFIC FIX: Prevent native zooming (Pinch) so app can handle it
        container.addEventListener('gesturestart', (e) => e.preventDefault());
        container.addEventListener('gesturechange', (e) => e.preventDefault());
        container.addEventListener('gestureend', (e) => e.preventDefault());
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
    // Support multiple inputs (Desktop & Mobile)
    const inputs = document.querySelectorAll('.input-watcher');

    const updateAll = (val) => {
        if (!val) return;
        if (mainP5 && mainP5.updateContent) mainP5.updateContent(val);
        if (previewP5 && previewP5.updateContent) previewP5.updateContent(val);

        // Sync all inputs
        inputs.forEach(inp => {
            if (inp.value !== val) inp.value = val;
        });
    };

    inputs.forEach(sText => {
        sText.addEventListener('input', (e) => {
            if (!e.isComposing) updateAll(e.target.value);
        });
        sText.addEventListener('compositionend', (e) => updateAll(e.data));
        // Prevent Space Pause
        sText.addEventListener('keydown', (e) => e.stopPropagation());
    });

    // Button Logic
    const setRandom = () => {
        const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const char = katakana.charAt(Math.floor(Math.random() * katakana.length));
        updateAll(char);
    };

    // Bind to all random/next/prev buttons (using classes would be better but let's stick to IDs + multi-listeners if needed)
    // Actually, let's use class for random buttons
    document.querySelectorAll('.btn-random').forEach(b => b.addEventListener('click', setRandom));
    // Prev/Next logic skipped for simplicity as user only requested Random mainly
    document.querySelectorAll('.btn-prev').forEach(b => b.addEventListener('click', setRandom));
    document.querySelectorAll('.btn-next').forEach(b => b.addEventListener('click', setRandom));

    // Expose for debugging
    window.mainP5 = mainP5;
    window.previewP5 = previewP5;

    // Initial Sync
    if (inputs.length > 0 && inputs[0].value) {
        console.log("Initial Sync with value:", inputs[0].value);
        updateAll(inputs[0].value);
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

    // Force Type Toggle
    const forceRadios = document.querySelectorAll('input[name="force-type"]');
    forceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = parseFloat(e.target.value);
            if (mainP5 && mainP5.updateParam) mainP5.updateParam('forceSign', val);
        });
    });

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

    const toggleMenu = (e) => {
        if (e) e.stopPropagation(); // Critical: Stop bubbling to document
        if (drawer) drawer.classList.toggle('open');
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent ghost click
            toggleMenu(e);
        }, { passive: false });
    }

    if (menuClose) {
        menuClose.addEventListener('click', toggleMenu);
        menuClose.addEventListener('touchstart', (e) => {
            e.preventDefault();
            toggleMenu(e);
        }, { passive: false });
    }

    // Close menu when clicking/touching outside
    const closeIfOutside = (e) => {
        if (drawer && drawer.classList.contains('open') &&
            !drawer.contains(e.target) &&
            !menuToggle.contains(e.target)) {

            // If touch, prevent p5 processing if it's purely UI closing
            // But we want to allow canvas interaction?
            // Actually, if we close the menu, that IS the interaction.
            drawer.classList.remove('open');
        }
    };

    document.addEventListener('click', closeIfOutside);
    document.addEventListener('touchstart', (e) => {
        // We don't prevent default here because we want to allow scrolling/canvas touch
        // But we DO want to close the menu.
        closeIfOutside(e);
    }, { passive: true });

    // --- EXTRA MOBILE CONTROLS ---
    const btnGrid = document.getElementById('btn-grid');
    const btnFs = document.getElementById('btn-fullscreen');

    if (btnGrid) {
        btnGrid.addEventListener('click', () => {
            if (mainP5 && mainP5.toggleGrid) mainP5.toggleGrid();
        });
    }

    if (btnFs) {
        btnFs.addEventListener('click', () => {
            if (mainP5 && mainP5.toggleFullscreen) mainP5.toggleFullscreen();
        });
    }

});
