import p5 from 'p5';
// import 'p5.js-svg'; // Disabled in favor of manual string export
import { TextParticle } from './TextParticle';

// Main Sketch Logic - PARTICLES & DOM SYNC
export const sketch = (p) => {
    let currentChar = 'ア';
    let myFont = null;
    let fontReady = false;

    // Physics State
    let particles = [];
    let lastGeneratedChar = '';

    // UI Params
    let params = {
        zoom: 1.0,
        size: 6,        // Standard Size
        radius: 0,      // Roundedness
        gravity: 0,
        reaction: 0.5,
        hue: 0,         // Color
        forceSign: 1    // 1 = Repel, -1 = Attract
    };

    // OPTIMIZATION: Detect Mobile for Performance
    // Simple check: Width < 768px (Standard Mobile Breakpoint)
    // We check this in setup or dynamically.
    const isMobile = () => {
        return (p.windowWidth < 768);
    };

    // Dynamic Cap based on device
    const getMaxParticles = () => {
        return isMobile() ? 2500 : 10000;
    };

    // --- EXPOSED METHODS ---
    p.updateContent = (input) => {
        if (input !== undefined) {
            currentChar = input;
        }
    };

    p.updateParam = (key, val) => {
        // console.log("Update Param", key, val);
        params[key] = val;
        // Trigger regen for visual params affecting generation
        if (['zoom', 'gap', 'hue'].includes(key)) {
            params.dirty = true;
        }
    };

    p.togglePause = () => {
        isPaused = !isPaused;
        console.log("Paused:", isPaused);
    };

    // --- PAN & ZOOM STATE ---
    let panX = 0;
    let panY = 0;
    let viewScale = 1.0;
    let targetViewScale = 1.0; // Target for smooth animation
    let isPanning = false;
    let isSpacePressed = false;
    let isPaused = false; // Pause State
    let simTime = 0; // Accumulated time for pause-able physics

    // TOUCH FIX: Flag to ignore "ghost" mouse events after touch ends
    let ignoreMouse = false;

    // UI Toggles
    let showGrid = true;

    p.mouseWheel = (event) => {
        // Zoom Logic: Exponential
        let zoomSensitivity = 0.001;
        // Update TARGET instead of direct value
        targetViewScale *= Math.exp(-event.deltaY * zoomSensitivity);
        // Clamp Target
        targetViewScale = p.constrain(targetViewScale, 0.1, 5.0);
        return false; // Prevent browser scroll
    };

    // p.keyPressed merged below for Fullscreen support

    p.keyReleased = () => {
        if (p.keyCode === 32) { // Space
            isSpacePressed = false;
            isPanning = false;
            document.body.style.cursor = 'default';
        }
    };

    p.mousePressed = () => {
        if (isSpacePressed) {
            isPanning = true;
            document.body.style.cursor = 'grabbing';
            return false;
        }
    };

    p.mouseReleased = () => {
        isPanning = false;
        if (isSpacePressed) document.body.style.cursor = 'grab';
    };

    p.mouseDragged = () => {
        if (isPanning) {
            panX += p.movedX;
            panY += p.movedY;
            return false;
        }
    };

    // --- TOUCH EVENTS (Mobile Support) ---
    // Variables for pinch zoom
    let distStart = -1;
    let scaleStart = -1;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isTouchActive = false; // Flag to distinguish Touch vs Mouse

    p.touchStarted = (e) => {
        isTouchActive = true;
        ignoreMouse = false; // FIX: Reset ignore flag on new touch

        // Allow UI interactions (Buttons, Inputs) to work by not preventing default
        if (e.target && e.target.tagName !== 'CANVAS') {
            return true;
        }

        // Prevent default browser behavior (scroll/zoom) ONLY if touching canvas
        if (p.touches.length === 1) {
            // Single touch: Pan
            lastTouchX = p.touches[0].x;
            lastTouchY = p.touches[0].y;
            // FIX: Prevent default to stop scrolling/zooming immediately on touch start
            return false;
        } else if (p.touches.length === 2) {
            // Two touches: Pinch Zoom
            distStart = p.dist(
                p.touches[0].x, p.touches[0].y,
                p.touches[1].x, p.touches[1].y
            );
            scaleStart = targetViewScale;
            return false;
        }
    };

    p.touchMoved = () => {
        isTouchActive = true;
        if (p.touches.length === 1) {
            ignoreMouse = false; // Re-enable if dragging
            // Pan
            let dx = p.touches[0].x - lastTouchX;
            let dy = p.touches[0].y - lastTouchY;
            panX += dx;
            panY += dy;
            lastTouchX = p.touches[0].x;
            lastTouchY = p.touches[0].y;
            return false;
        } else if (p.touches.length === 2) {
            // Pinch Zoom
            let distCurrent = p.dist(
                p.touches[0].x, p.touches[0].y,
                p.touches[1].x, p.touches[1].y
            );

            if (distStart > 0) {
                let ratio = distCurrent / distStart;
                // Exponential feel or direct ratio? Direct is usually better for pinch.
                targetViewScale = scaleStart * ratio;
                targetViewScale = p.constrain(targetViewScale, 0.1, 5.0);
            }
            return false;
        }
        return false;
    };

    p.touchEnded = (e) => {
        // Allow UI interactions
        if (e.target && e.target.tagName !== 'CANVAS') {
            return true;
        }

        // Reset pinch state
        if (p.touches.length < 2) {
            distStart = -1;
            scaleStart = -1;
        }

        // Disable Touch Active if no touches remain
        if (p.touches.length === 0) {
            isTouchActive = false;
            // CRITICAL: Reset Mouse Pos so particles don't stuck to last touch
            p.mouseX = -9999;
            p.mouseY = -9999;
            // Also reset internal tracker
            lastTouchX = -9999;
            lastTouchY = -9999;

            // FIX: Set flag to ignore subsequent mouse events (emulated by browser)
            ignoreMouse = true;
        }

        // If 0 touches, pan ends automatically
        return false;
    };

    // Add touchCancelled handling for safety
    p.touchCancelled = (e) => {
        isTouchActive = false;
        p.mouseX = -9999;
        p.mouseY = -9999;
        return false;
    };

    p.setup = () => {
        console.log("p.setup called");
        p.disableFriendlyErrors = true;

        // Setup Canvas
        let container = document.getElementById('canvas-container');
        console.log("Container found:", container);
        if (container) container.innerHTML = '';
        let w = container ? (container.clientWidth || window.innerWidth) : 800;
        let h = container ? (container.clientHeight || window.innerHeight) : 600;
        p.createCanvas(w, h);
        p.pixelDensity(1);

        // Async Font Load
        p.loadFont('./fonts/LINESeedJP-ExtraBold.ttf',
            (loadedFont) => {
                myFont = loadedFont;
                fontReady = true;
                console.log("Font Loaded Successfully", myFont);
            },
            (err) => console.error("Font Load Failed", err)
        );

        // SVG Save (Vector Export)
        document.getElementById('btn-save')?.addEventListener('click', async () => {
            if (!particles.length) {
                console.warn("No particles to save");
                return;
            }

            // --- DEPENDENCY-FREE MANUAL SVG EXPORT ---
            try {
                // 1. Setup SVG Header
                // Use viewbox matching canvas
                let svgW = p.width;
                let svgH = p.height;
                let buffer = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="black" />
`;

                // 2. Iterate and append shapes
                for (let pt of particles) {
                    let zoom = params.zoom || 1.0;
                    let size = (params.size || 6) * pt.sizeOffset * zoom;
                    let x = pt.pos.x.toFixed(2);
                    let y = pt.pos.y.toFixed(2);
                    let rot = (pt.angle * 180 / Math.PI).toFixed(2); // SVG rotate is deg

                    // --- COLOR LOGIC (Match Preview) ---
                    // params.hue = 0 -> Multicolor
                    // params.hue > 0 -> Targeted
                    let finalColor;
                    p.colorMode(p.HSB, 360, 100, 100);

                    if (params.hue <= 0) {
                        // Multicolor
                        let h = (pt.hueOffset || 0) % 360;
                        if (h < 0) h += 360;
                        finalColor = p.color(h, 70, 90);
                    } else {
                        // Targeted
                        let h = (params.hue + (pt.hueOffset || 0) / 6) % 360;
                        if (h < 0) h += 360;
                        finalColor = p.color(h, 80, 90);
                    }

                    // Convert to Hex
                    let hexColor = finalColor.toString('#rrggbb');
                    p.colorMode(p.RGB); // Reset

                    let fill = "none";
                    let stroke = "none";
                    let strokeW = 0;

                    if (pt.renderMode === 'STROKE') {
                        stroke = hexColor;
                        strokeW = (1.5 * zoom).toFixed(2);
                    } else {
                        fill = hexColor;
                    }

                    // Transform Group
                    buffer += `<g transform="translate(${x}, ${y}) rotate(${rot})">`;

                    switch (pt.shapeType) {
                        case 0: // Ellipse
                            let r = (size / 2).toFixed(2);
                            buffer += `<circle cx="0" cy="0" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />`;
                            break;
                        case 1: // Rect
                            let s = size.toFixed(2);
                            let rx = (params.radius || 0).toFixed(2);
                            buffer += `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />`;
                            break;
                        case 2: // Triangle (3)
                        case 3: // Pentagon (5)
                        case 4: // Hexagon (6)
                            let n = (pt.shapeType === 2) ? 3 : (pt.shapeType === 3 ? 5 : 6);
                            let pts = "";
                            let radius = size * 0.6;
                            let angleStep = (Math.PI * 2) / n;
                            for (let i = 0; i < n; i++) {
                                let px = (Math.cos(i * angleStep) * radius).toFixed(2);
                                let py = (Math.sin(i * angleStep) * radius).toFixed(2);
                                pts += `${px},${py} `;
                            }
                            buffer += `<polygon points="${pts.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />`;
                            break;
                    }
                    buffer += `</g>\n`;
                }

                // 3. Close SVG
                buffer += `</svg>`;

                // 4. Download Trigger
                try {
                    // Modern Way: Explicit Save Dialog (Chrome/Edge/Desktop)
                    // This solves "Where did it go?" by forcing user to pick location
                    if (window.showSaveFilePicker) {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: 'bacteriograph_design.svg',
                            types: [{
                                description: 'SVG Vector Image',
                                accept: { 'image/svg+xml': ['.svg'] },
                            }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(buffer);
                        await writable.close();
                        console.log("Saved via File System Access API");
                    } else {
                        // Fallback: Classic Download Link
                        throw new Error("File System Access API not supported");
                    }
                } catch (err) {
                    console.log("Fallback to legacy download:", err);
                    const blob = new Blob([buffer], { type: "image/svg+xml;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "bacteriograph_design.svg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                }

                console.log("SVG Exported Manually");

            } catch (e) {
                console.error("Manual SVG Export Failed:", e);
            }
        });
    };

    // --- FULLSCREEN TOGGLE ---
    // --- UI/STATE TOGGLES (Exposed for Buttons) ---
    p.toggleFullscreen = () => {
        let fs = p.fullscreen();
        p.fullscreen(!fs);

        // Toggle Body Class for CSS styling
        if (!fs) {
            document.body.classList.add('is-fullscreen');
        } else {
            document.body.classList.remove('is-fullscreen');
        }
    };

    p.toggleGrid = () => {
        showGrid = !showGrid;
    };

    // --- KEYBOARD CONTROLS ---
    p.keyPressed = () => {
        if (p.key === 'f' || p.key === 'F') {
            p.toggleFullscreen();
        }

        // Toggle Grid
        if (p.key === 'g' || p.key === 'G') {
            p.toggleGrid();
        }
        if (p.keyCode === 32) { // Space
            isSpacePressed = true;
            document.body.style.cursor = 'grab';
        }
    };
    // Generate Particles from Text
    const generateParticles = (char, fontSize, centerX, centerY) => {
        particles = [];
        if (!char || !fontReady) return;

        // Apply Zoom to display size
        let zoom = params.zoom !== undefined ? params.zoom : 1.0;
        let displaySize = fontSize * zoom;

        // Ensure Main P5 uses the font for correct measurement
        p.textFont(myFont);
        p.textSize(displaySize);

        // Increase buffer to prevent clipping
        let pgW = Math.ceil(p.textWidth(char) * 1.5);
        let pgH = Math.ceil(displaySize * 1.5);

        // SAFETY CAP: Prevent texture overflow on high zoom or long strings
        // 4096 is a safe limit for most GPUs (some go 8k, 16k, but p5/canvas can lag)
        const MAX_TEXTURE_SIZE = 4096;
        if (pgW > MAX_TEXTURE_SIZE || pgH > MAX_TEXTURE_SIZE) {
            let scale = MAX_TEXTURE_SIZE / Math.max(pgW, pgH);
            pgW = Math.floor(pgW * scale);
            pgH = Math.floor(pgH * scale);
            displaySize *= scale; // Scale font size to match
            zoom *= scale; // Effective zoom is limited
        }

        if (pgW < 1 || pgH < 1) return;

        let pg = p.createGraphics(pgW, pgH);
        pg.pixelDensity(1);
        pg.clear(); // Transparent background

        pg.textFont(myFont);
        pg.textSize(displaySize);
        pg.textAlign(p.CENTER, p.CENTER);
        pg.fill(0);
        pg.noStroke();
        // Draw text in center of buffer
        pg.text(char, pg.width / 2, pg.height / 2 - (displaySize * 0.15));

        pg.loadPixels();

        // Monte Carlo Sampling for Random Distribution
        let area = pg.width * pg.height;

        // Gap Control: Higher Gap = Lower Density
        // Gap 0 => High Density (Ratio ~1.2)
        // Gap 20 => Low Density (Ratio ~0.1)
        let gap = params.gap !== undefined ? params.gap : 2;
        // Formula: Base 0.8, reduced by gap. 
        // gap=2 -> 0.8/1 = 0.8
        // gap=10 -> 0.8/5 = 0.16
        // INCREASED DENSITY: Base 3.0 (was 0.8)
        let attemptRatio = 3.0 / (Math.max(1, gap * 0.5));

        // Estimate attempts based on area
        let attempts = Math.floor(area * 0.1 * attemptRatio);

        // Dynamic Cap: Scale with text length
        // Base 3000 -> 8000 per char for high density
        // let len = char.length || 1;
        // let safetyCap = 8000 * len; 

        // PERFORMANCE OPTIMIZATION:
        // Use global MAX_PARTICLES to prevent crash on long strings
        // Just clamp the total attempts. This naturally reduces density if area is huge.
        // Mobile: 2500, Desktop: 10000
        attempts = Math.min(attempts, getMaxParticles());

        for (let i = 0; i < attempts; i++) {
            let x = Math.floor(p.random(pg.width));
            let y = Math.floor(p.random(pg.height));

            let index = (x + y * pg.width) * 4;
            let alpha = pg.pixels[index + 3];

            if (alpha > 128) {
                // Buffer center -> Canvas center
                let pX = (x - pg.width / 2) + centerX;
                let pY = (y - pg.height / 2) + centerY;

                // Add slight random jitter to prevent any grid artifacts from pixel alignment
                pX += p.random(-2, 2);
                pY += p.random(-2, 2);

                // ARTIFACT FILTER:
                // 1. Strict NaN check
                if (Number.isNaN(pX) || Number.isNaN(pY)) continue;

                // 2. Center Distance Filter
                // Kill particles that are absurdly far from the text center (e.g. top-left artifacts)
                // Text is centered at (centerX, centerY). 
                // Any valid particle should be within roughly width/2 distance.
                // The puddle is at ~80,30 while center is ~500,400. Distance ~500.
                let dx = pX - centerX;
                let dy = pY - centerY;
                // Use a generous box relative to displaySize
                // displaySize is the font size. Text might be wider.
                // Let's use a safe absolute distance or relative to available width.
                // If it's more than 800px away from center, it's likely garbage.
                if (Math.abs(dx) > p.width * 0.8 || Math.abs(dy) > p.height * 0.8) continue;

                // 3. Absolute Puddle Filter (Top-Left corner killer)
                // If particle is in the top-left 150x150 box, kill it.
                // Valid text never touches top-left because we center it in AVAILABLE_W (Right side has margin).
                if (pX < 150 && pY < 150) continue;

                particles.push(new TextParticle(p, pX, pY));
            }
        }

        pg.remove();
        lastGeneratedChar = char;
    };

    p.windowResized = () => {
        let container = document.getElementById('canvas-container');
        if (container) {
            let w = container.clientWidth || window.innerWidth;
            let h = container.clientHeight || window.innerHeight;
            p.resizeCanvas(w, h);
        }
        lastGeneratedChar = ''; // Force regen
    };

    // --- MOUSE BOUNDARY HELPER ---
    let isMouseOver = false;
    // Add listeners to container once setup is done
    setTimeout(() => {
        const c = document.getElementById('canvas-container');
        if (c) {
            c.addEventListener('mouseenter', () => isMouseOver = true);
            c.addEventListener('mouseleave', () => isMouseOver = false);
        }
    }, 100);

    const isMouseInside = () => {
        // Robust check: Element hover state && Coordinates validity && Document focus

        // If Touch is active, we valid if finger is on screen.
        // But if isTouchActive is false, we MUST return false for touch-based interactions.
        if (isTouchActive) return true;

        // FIX: If ignoring mouse (just finished touch), return false
        if (ignoreMouse) return false;

        // If p.mouseX is "reset" value, force false
        if (p.mouseX < -5000) return false;

        return isMouseOver &&
            (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height);
    };

    p.mouseMoved = () => {
        // Re-enable mouse interaction when real mouse moves
        ignoreMouse = false;
    };

    p.draw = () => {
        // SMOOTH ZOOM ANIMATION
        // Interpolate current scale towards target scale
        viewScale = p.lerp(viewScale, targetViewScale, 0.1);

        p.background(0); // BLACK BACKGROUND

        if (!fontReady) return;

        // --- POLLING SYNC ---
        const domInput = document.getElementById('input-text');
        if (domInput && domInput.value && domInput.value !== currentChar) {
            currentChar = domInput.value;
        }

        if (currentChar) {
            // Layout Calculation
            const UI_RIGHT_MARGIN = 340;
            const AVAILABLE_W = p.width - UI_RIGHT_MARGIN;

            let testSize = 100;
            p.textSize(testSize);
            let testWidth = p.textWidth(currentChar);

            let targetIndentation = 0.9;
            let scaleW = (AVAILABLE_W * targetIndentation) / testWidth;
            let scaleH = (p.height * 0.7) / testSize;
            let finalSize = testSize * Math.min(scaleW, scaleH);
            let centerX = AVAILABLE_W / 2;
            let centerY = p.height / 2;

            // Regen if char changed OR significant param change detected (e.g. zoom, gap)
            // Ideally we track params state. For now, we rely on 'updateParam' resetting 'lastGeneratedChar' or similar?
            // Actually, we should just check if we need to regen.
            // Simplified: If currentChar changed, regen. 
            // If params changed, we need a signal. 
            // Let's use a dirty flag.

            if (currentChar !== lastGeneratedChar || params.dirty) {
                generateParticles(currentChar, finalSize, centerX, centerY); // generateParticles applies zoom internally
                params.dirty = false;
            }

            // --- AUTO-SCALE CALCULATION ---
            // Reference font size for roughly 1 character filling the screen is approx 400-500px.
            // When we have 5 chars, finalSize drops to ~100px.
            // We want particles to scale down with text size, BUT not linearly 1:1 or they vanish.
            // Let's try a square root curve or dampened linear.
            // Ratio: finalSize / 300 (300 is arbitrary "standard" size)
            // Ratio: finalSize / 300 (300 is arbitrary "standard" size)
            let fontScaleRatio = finalSize / 300;
            // Clamp it so it doesn't get too tiny or too huge
            fontScaleRatio = p.constrain(fontScaleRatio, 0.4, 1.5);

            // Inject into params for particle access
            params.fontScale = fontScaleRatio;

            // --- SIMULATION TIME (For True Pause) ---
            // Fallback to 16ms if deltaTime is missing or zero (prevent stasis)
            let dt = (p.deltaTime || 16.66) * 0.001;
            if (!isPaused) {
                simTime += dt;
            }

            // --- GLOBAL FLOATING & PAN ---
            // Use simTime instead of p.millis()
            let floatX = Math.sin(simTime * 0.5) * 10;
            let floatY = Math.cos(simTime * 0.3) * 10;

            let totalX = floatX + panX;
            let totalY = floatY + panY;

            // DRAW GRID (Behind everything)
            if (showGrid) {
                p.push();
                p.translate(panX, panY);
                drawSwissGrid(p, p.width, p.height, panX, panY);
                p.pop();
            }

            // DIRECT DRAWING (No Liquid Buffer)
            p.push();

            // GLOBAL TRANSFORM: Pan + Zoom (Centered on Screen Center)
            p.translate(p.width / 2, p.height / 2);
            p.scale(viewScale);
            p.translate(-p.width / 2, -p.height / 2);
            p.translate(panX + floatX, panY + floatY);

            // Correct Mouse Coords for Physics (Screen -> View Space)
            // Screen -> Global: Undo Scale
            // 1. Shift to Center
            let mx = p.mouseX - p.width / 2;
            let my = p.mouseY - p.height / 2;
            // 2. Undo Scale
            mx /= viewScale;
            my /= viewScale;
            // 3. Undo Center shift to get back to relative coords
            // In normal space, 0,0 is top-left.
            // After scale, we are effectively working in a zoomed coordinate system centered at w/2, h/2.
            // But we also applied translate(-w/2, -h/2) then translate(pan...)
            // So effective translation is: panX + floatX - p.width/2 + p.width/2 ... wait.
            // Transform stack:
            // T(w/2) -> S(z) -> T(-w/2) -> T(pan) -> Draw
            // Point P_screen = T(w/2) * S(z) * T(-w/2) * T(pan) * P_local
            // P_screen = T(w/2) * S(z) * (P_local + pan - w/2)
            // P_screen = (P_local + pan - w/2) * z + w/2
            // P_screen - w/2 = (P_local + pan - w/2) * z
            // (P_screen - w/2) / z = P_local + pan - w/2
            // P_local = (P_screen - w/2) / z - pan + w/2

            let localMouseX = (p.mouseX - p.width / 2) / viewScale - (panX + floatX) + p.width / 2;
            let localMouseY = (p.mouseY - p.height / 2) / viewScale - (panY + floatY) + p.height / 2;

            // --- PHYSICS INTERACTIONS (SPATIAL GRID) ---
            let cellSize = 50;
            let grid = {};

            // 1. Bin particles
            for (let i = 0; i < particles.length; i++) {
                let pt = particles[i];
                let gx = Math.floor(pt.pos.x / cellSize);
                let gy = Math.floor(pt.pos.y / cellSize);
                let key = `${gx},${gy}`;
                if (!grid[key]) grid[key] = [];
                grid[key].push(pt);
            }

            // 2. Interact & Draw
            // OPTIMIZED: Iterate particles and use grid directly.
            for (let i = 0; i < particles.length; i++) {
                let pt = particles[i];
                let gx = Math.floor(pt.pos.x / cellSize);
                let gy = Math.floor(pt.pos.y / cellSize);

                // Update only if NOT paused
                if (!isPaused) {
                    pt.interact(grid, cellSize, gx, gy, params);
                    // Pass simulated frame count: simTime * 60
                    // Pass isMouseInside() to prevent off-canvas interaction
                    pt.update(params, localMouseX, localMouseY, simTime * 60, isMouseInside());
                }

                // Render directly
                pt.draw(params);
            }

            p.pop();

            // Draw Pause Indicator
            if (isPaused) {
                p.push();
                p.resetMatrix(); // Draw on top of everything, screen space
                p.fill(255);
                p.noStroke();
                p.textSize(24);
                p.textAlign(p.RIGHT, p.TOP);
                p.text("PAUSED", p.width - 20, 20);
                p.pop();
            }
        }
    };

    // --- SWISS GRID HELPER ---
    const drawSwissGrid = (p, w, h, panX, panY) => {
        let step = 200; // Wider modules (was 100)
        let subStep = 20; // Small modules

        // Calculate visible range based on Pan to optimize (or just draw ample overshoot)
        // Simple approach: Draw large enough area centered on 0,0 relative to pan?
        // Actually, we are already translated by panX, panY.
        // So (0,0) is the center of the "World".
        // We want the grid to cover the viewport.
        // Viewport top-left in "World" coords is: (-panX, -panY)

        let startX = -panX;
        let startY = -panY;
        let endX = -panX + w;
        let endY = -panY + h;

        // Extend bounds for smooth scrolling
        startX -= step; startY -= step;
        endX += step; endY += step;

        // Snap to grid
        let gridStartX = Math.floor(startX / step) * step;
        let gridStartY = Math.floor(startY / step) * step;

        p.push();
        // Dark Mode Grid Colors
        p.stroke(255, 30); // White transparent
        p.strokeWeight(1);

        // Draw Lines
        for (let x = gridStartX; x < endX; x += step) {
            p.line(x, startY, x, endY);
        }
        for (let y = gridStartY; y < endY; y += step) {
            p.line(startX, y, endX, y);
        }

        // Crosshairs for Swiss feel at intersections
        p.stroke(255, 60); // Accents (White)
        p.strokeWeight(2);
        for (let x = gridStartX; x < endX; x += step) {
            for (let y = gridStartY; y < endY; y += step) {
                let len = 5;
                p.line(x - len, y, x + len, y);
                p.line(x, y - len, x, y + len);
            }
        }

        p.pop();
    };
};
