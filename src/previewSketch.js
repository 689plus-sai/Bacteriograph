
export const previewSketch = (p) => {
    let currentCharField = 'ア';
    let myFont;

    p.preload = () => {
        try {
            console.log("PreviewSketch: Loading font...");
            myFont = p.loadFont('./fonts/DelaGothicOne-Regular.ttf');
        } catch (e) {
            console.error("PreviewSketch: Font load error", e);
        }
    };

    p.setup = () => {
        console.log("PreviewSketch: Setup started");
        let container = document.getElementById('sample-view');
        // Clear text content
        if (container) {
            container.innerHTML = '';
            console.log("PreviewSketch: Container cleared");
        }

        p.createCanvas(100, 100);
        p.pixelDensity(1);
        p.frameRate(30);

        // Load font here to be safe
        p.loadFont('./fonts/DelaGothicOne-Regular.ttf', (f) => {
            myFont = f;
            console.log("PreviewSketch: Font loaded");
        });
    };

    p.draw = () => {
        p.background(255); // White background

        if (!currentCharField) return;

        let char = currentCharField.charAt(0);
        let baseSize = 100;
        let fontSize = baseSize * 0.8;

        if (myFont) {
            // Font-based points
            // Centering offset
            let bbox = myFont.textBounds(char, 0, 0, fontSize);
            let cx = (p.width - bbox.w) / 2 - bbox.x;
            let cy = (p.height - bbox.h) / 2 - bbox.y;

            let pts = myFont.textToPoints(char, cx, cy, fontSize, {
                sampleFactor: 0.1,
                simplifyThreshold: 0
            });

            p.push();
            p.noStroke();
            p.fill(255, 50, 50); // Red

            // KINETIC ANIMATION (Match TextParticle.js)
            let time = p.frameCount * 0.05;
            let freq = 0.02;
            let amp = 5; // Smaller amp for preview

            p.beginShape();
            pts.forEach(pt => {
                let waveX = Math.sin(time + pt.y * freq) * amp;
                let waveY = Math.cos(time + pt.x * freq) * amp;
                p.vertex(pt.x + waveX, pt.y + waveY);
            });
            p.endShape(p.CLOSE);
            p.pop();
        } else {
            // Fallback if font missing
            p.fill(0);
            p.textSize(60);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(char, p.width / 2, p.height / 2);
        }
    };

    p.updateContent = (val) => {
        if (val) currentCharField = val;
    };

    // Listeners are now handled in main.js
    // const setupListeners = () => { ... }
};
