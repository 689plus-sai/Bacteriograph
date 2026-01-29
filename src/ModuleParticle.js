
import { SHAPE_TYPES } from './KatakanaData';

// Physics constants
const DRAG = 0.92;
const MAX_SPEED = 10;

export class ModuleParticle {
    constructor(p5, x, y, size, data, gridOffset) {
        this.p = p5;
        // Initial position (grid based)
        this.gridX = data.x;
        this.gridY = data.y;
        this.gridSize = size;

        // Target position (home)
        this.target = this.p.createVector(
            gridOffset.x + this.gridX * this.gridSize,
            gridOffset.y + this.gridY * this.gridSize
        );

        // Current position - start at target
        this.pos = this.target.copy();
        // Velocity
        this.vel = p5.createVector(0, 0);
        // Acceleration
        this.acc = p5.createVector(0, 0);

        this.data = data;
        this.type = data.type;

        // Visual params
        this.params = {
            radius: 0,
            gap: 0,
            color: p5.color(0),
        };

        // Random rotation for variation (static per particle)
        this.rotation = p5.random(p5.TWO_PI);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update(physicsParams) {
        this.applyForce(this.p.createVector(0, physicsParams.gravity * 0.1));

        let mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        let dir = this.target.copy().sub(mouse); // Correct way to sub if p5 instance method unavailable? No, target is vector.
        // Revert to known working vector math:
        // dir = p5.Vector.sub(this.pos, mouse) -- no we have this.p
        // dir = this.p.createVector(this.pos.x - mouse.x, this.pos.y - mouse.y);
        // But previously it was specific code I wrote. Let's keep it robust.
        dir = this.pos.copy().sub(mouse);

        let d = dir.mag();

        if (d < 200 * physicsParams.reaction) {
            dir.normalize();
            let force = this.p.map(d, 0, 200, 2, 0);
            dir.mult(force * physicsParams.reaction * 2);
            this.applyForce(dir);
        }

        let desired = this.target.copy().sub(this.pos);
        let dHome = desired.mag();
        let speed = MAX_SPEED;
        if (dHome < 100) {
            speed = this.p.map(dHome, 0, 100, 0, MAX_SPEED);
        }
        desired.setMag(speed);

        let steer = desired.sub(this.vel);
        steer.limit(0.2);
        this.applyForce(steer);

        if (physicsParams.attractPoint) {
            let attractDir = physicsParams.attractPoint.copy().sub(this.pos);
            let dist = attractDir.mag();
            if (dist > 5) {
                attractDir.normalize();
                attractDir.mult(1.0);
                this.applyForce(attractDir);
            }
        }

        if (this.pos.y > this.p.height + 50) {
            this.pos.y = -50;
            this.pos.x = this.p.random(this.p.width);
            this.vel.mult(0);
        }

        this.vel.add(this.acc);
        this.vel.limit(MAX_SPEED);
        this.pos.add(this.vel);
        this.vel.mult(DRAG);
        this.acc.mult(0);
    }

    // Consolidated Draw Logic
    // Can be used for both Canvas (screen) and Graphics (SVG)
    draw(settings) {
        this.renderOn(this.p, settings);
    }

    renderOn(pg, settings) {
        const { moduleSize, border, gap, color } = settings;

        let s = moduleSize * this.gridSize;

        // Data w/h are in grid units.
        // For primitives created by Densifier, data.w/h are usually 0.2 etc.
        let w = (this.data.w || (this.data.s || 1)) * moduleSize;
        let h = (this.data.h || (this.data.s || 1)) * moduleSize;

        let drawW = w - gap;
        let drawH = h - gap;

        if (drawW < 1) drawW = 1;
        if (drawH < 1) drawH = 1;

        pg.push();
        // Use current position for Screen draw, or Target?
        // renderOn is generic. If we are drawing the *current state*, use this.pos.
        // If we are drawing for SVG Save, we usually want the *current state* snapshot too.
        // (Wait, `renderOn` in `sketch.js` uses `this.pos`)

        // However, `renderOn` needs to know if `pg` is the main canvas instance or a separate buffer.
        // If it's the main canvas, `translate` works relative to global origin.
        // If it's a buffer, it helps to be consistent.

        pg.translate(this.pos.x, this.pos.y);

        // Rotation for Triangles/Hexagons (and maybe Rects) to add chaos
        if (this.type === SHAPE_TYPES.TRIANGLE || this.type === SHAPE_TYPES.HEXAGON || this.type === SHAPE_TYPES.RECT) {
            pg.rotate(this.rotation);
        }

        pg.noStroke();
        pg.fill(color);

        if (this.type === SHAPE_TYPES.RECT) {
            pg.rectMode(pg.CENTER);
            pg.rect(0, 0, drawW, drawH, border);
        } else if (this.type === SHAPE_TYPES.CIRCLE) {
            pg.ellipse(0, 0, drawW, drawW);
        } else if (this.type === SHAPE_TYPES.LINE) {
            pg.stroke(color);
            pg.strokeWeight(drawW / 4);
            pg.line(-drawW / 2, 0, drawW / 2, 0);
        } else if (this.type === SHAPE_TYPES.TRIANGLE) {
            // Equilateral Triangle
            let r = drawW / 2;
            // 3 points
            pg.triangle(
                0, -r,
                r * 0.866, r * 0.5,
                -r * 0.866, r * 0.5
            );
        } else if (this.type === SHAPE_TYPES.HEXAGON) {
            let r = drawW / 2;
            pg.beginShape();
            for (let i = 0; i < 6; i++) {
                let angle = pg.TWO_PI / 6 * i;
                pg.vertex(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            pg.endShape(pg.CLOSE);
        }

        pg.pop();
    }
}
