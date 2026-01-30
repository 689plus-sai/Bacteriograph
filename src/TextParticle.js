export class TextParticle {
    constructor(p5, x, y) {
        this.p = p5;
        this.baseX = x;
        this.baseY = y;
        this.pos = p5.createVector(x, y);
        this.vel = p5.createVector(0, 0);
        this.acc = p5.createVector(0, 0);

        this.maxSpeed = 8;
        this.maxForce = 0.5;

        // --- VISUAL VARIATION ---
        this.hueOffset = p5.random(360); // Unique color seed

        let r = p5.random();
        // REDUCED SIZE (70% of original)
        if (r < 0.6) {
            this.sizeOffset = p5.random(0.2, 0.55); // was 0.3-0.8
        } else if (r < 0.9) {
            this.sizeOffset = p5.random(0.55, 1.0); // was 0.8-1.5
        } else {
            this.sizeOffset = p5.random(1.0, 2.4); // was 1.5-3.5
        }

        this.shapeType = Math.floor(p5.random(5));
        this.renderMode = p5.random() > 0.5 ? 'FILL' : 'STROKE';

        // --- BEHAVIOR ROLES ---
        // 1. WANDER: Roams freely (high wander, loose tether)
        // 2. STAY: Anchored (low wander, strong tether)
        // 3. ATTRACT: Gravitational core (pulls others)
        // 4. REPEL: Force field (pushes others)
        const roles = ['WANDER', 'STAY', 'ATTRACT', 'REPEL'];
        this.role = p5.random(roles);

        // --- MOTION PARAMS ---
        this.floatPhase = p5.random(p5.TWO_PI);
        this.floatSpeed = p5.random(0.01, 0.03);
        this.angle = p5.random(p5.TWO_PI);
        this.angleSpeed = p5.random(-0.05, 0.05);
        this.wanderTheta = p5.random(p5.TWO_PI);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    // Interaction with other particles (Grid Optimized)
    interact(grid, cellSize, gx, gy, params) {
        let zoom = params.zoom || 1.0;
        let perception = 30 * zoom; // Interaction radius

        // Safety / Perf Cap
        let maxNeighbors = 15;
        let checked = 0;

        let localMaxSpeed = 8 * zoom;
        let localMaxForce = 0.5 * zoom;

        let separation = this.p.createVector(0, 0);
        let attraction = this.p.createVector(0, 0);
        let repulsion = this.p.createVector(0, 0);

        let countSep = 0;
        let countAttr = 0;
        let countRep = 0;

        // Iterate 3x3 cells
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                let key = `${gx + xOffset},${gy + yOffset}`;
                let cell = grid[key];
                if (cell) {
                    for (let i = 0; i < cell.length; i++) {
                        let other = cell[i];
                        if (other === this) continue;

                        checked++;
                        if (checked > maxNeighbors) break;

                        let d = this.pos.dist(other.pos);
                        let combinedSize = (this.sizeOffset + other.sizeOffset) * 4 * zoom; // Approx radius

                        // 1. GLOBAL COLLISION (Separation)
                        // All particles collide/separate if too close
                        if (d < combinedSize && d > 0) {
                            let diff = this.pos.copy().sub(other.pos);
                            diff.normalize();
                            diff.div(d); // Weight by distance
                            separation.add(diff);
                            countSep++;
                        }

                        // 2. ROLE-BASED INTERACTION
                        if (d < perception && d > 0) {
                            // If OTHER is ATTRACTOR, I am pulled
                            if (other.role === 'ATTRACT') {
                                let pull = other.pos.copy().sub(this.pos);
                                pull.normalize();
                                pull.div(d); // Stronger when close
                                attraction.add(pull);
                                countAttr++;
                            }

                            // If OTHER is REPELLER, I am pushed
                            if (other.role === 'REPEL') {
                                let push = this.pos.copy().sub(other.pos);
                                push.normalize();
                                push.div(d); // Stronger when close
                                repulsion.add(push);
                                countRep++;
                            }
                        }
                    }
                }
                if (checked > maxNeighbors) break;
            }
        }

        // Apply Forces
        if (countSep > 0) {
            separation.div(countSep);
            separation.setMag(localMaxSpeed);
            separation.sub(this.vel);
            separation.limit(localMaxForce * 2.0); // High priority
            this.applyForce(separation);
        }

        if (countAttr > 0) {
            attraction.div(countAttr);
            attraction.setMag(localMaxSpeed);
            attraction.sub(this.vel);
            attraction.limit(localMaxForce);
            this.applyForce(attraction);
        }

        if (countRep > 0) {
            repulsion.div(countRep);
            repulsion.setMag(localMaxSpeed);
            repulsion.sub(this.vel);
            repulsion.limit(localMaxForce * 1.5);
            this.applyForce(repulsion);
        }
    }

    update(params, mouseX, mouseY, timeFrame, isMouseActive = true) {
        let zoom = params.zoom || 1.0;
        let localMaxSpeed = 8 * zoom;
        let localMaxForce = 0.5 * zoom;

        // --- PARAMETERS ---
        let reactionParam = (params.reaction !== undefined) ? params.reaction : 0.5;
        let gravityParam = (params.gravity !== undefined) ? params.gravity : 0.1;

        // Damping & Stability based on Gravity
        let damping = this.p.map(gravityParam, 0, 2, 0.96, 0.85);
        let stayMultiplier = this.p.map(gravityParam, 0, 2, 1.0, 4.0);

        this.angle += this.angleSpeed;

        // --- 1. MOUSE INTERACTION (PRIORITY OVERRIDE) ---
        let isUnderMouse = false;

        // Only calculate mouse interaction if mouse is active (inside canvas)
        if (isMouseActive) {
            let mouse = this.p.createVector(mouseX, mouseY);
            let mbDir = this.pos.copy().sub(mouse);
            let mbDist = mbDir.mag();
            // User requested smaller max range.
            let repelRange = 150 * reactionParam * zoom;
            if (repelRange < 20) repelRange = 20;

            if (mbDist < repelRange) {
                isUnderMouse = true;
                mbDir.normalize();

                // SMOOTHER PHYSICS: Quadratic Falloff
                // Curve: (1 - dist/range)^2 -> Gentle Start, Strong Center
                let normDist = mbDist / repelRange;
                let intensity = Math.pow(1.0 - normDist, 2);
                let baseForce = 40;

                // Scale Force by Reaction param (Squared)
                let forceMultiplier = reactionParam * reactionParam * 2.0;
                let forceMag = baseForce * intensity * forceMultiplier;

                // Apply Force Sign (1 = Repel, -1 = Attract)
                let sign = params.forceSign !== undefined ? params.forceSign : 1;
                mbDir.mult(forceMag * sign);
                this.applyForce(mbDir);

                this.isBroken = true;
                this.breakTimer = 30;
            }
        }

        // --- ARTIFACT KILL SWITCH ---
        if (this.pos.x < 100 && this.pos.y < 100) {
            this.pos.x = -9999;
            this.pos.y = -9999;
            this.vel.set(0, 0);
            return;
        }

        // --- CLUMP BREAKING (Universal) ---
        if (this.vel.mag() > (5 * zoom)) {
            this.isBroken = true;
            this.breakTimer = 20;
        }
        if (this.breakTimer > 0) this.breakTimer--;
        else this.isBroken = false;

        // --- WAVE TARGET CALCULATION ---
        // (Shared baseline animation)
        let time = (timeFrame || 0) * 0.05;
        let freq = 0.02;
        let amp = 15 * zoom;

        let waveX = Math.sin(time + this.baseY * freq) * amp;
        let waveY = Math.cos(time + this.baseX * freq) * amp;
        let target = this.p.createVector(this.baseX + waveX, this.baseY + waveY);

        let d = this.pos.dist(target);
        // --- ROLE-BASED SELF BEHAVIOR ---
        // If under mouse influence, ignore internal drives (Wander/Stay).

        if (!isUnderMouse) {
            // --- WAVE TARGET CALCULATION ---

            // 1. WANDERER (回遊)
            if (this.role === 'WANDER') {
                // Strong Wander Force
                let wanderR = 15 * zoom;
                let wanderD = 60 * zoom;
                let change = 0.2;
                this.wanderTheta += this.p.random(-change, change);

                let circlePos = this.vel.copy();
                circlePos.normalize();
                circlePos.mult(wanderD);
                circlePos.add(this.pos);
                let h = this.vel.heading();
                let circleOffset = this.p.createVector(wanderR * Math.cos(this.wanderTheta + h), wanderR * Math.sin(this.wanderTheta + h));
                let wanderTarget = circlePos.add(circleOffset);
                let wanderSteer = wanderTarget.sub(this.pos);
                wanderSteer.setMag(localMaxSpeed);
                wanderSteer.sub(this.vel);
                wanderSteer.limit(localMaxForce);
                this.applyForce(wanderSteer);

                // 2. ELASTIC WALL BOUNDARY (Bounce off the "edge")
                // Instead of pulling back (which kills speed), we REFLECT velocity.
                // This allows free movement inside the radius, but hard constraint at edge.

                let wallRadius = 10 * zoom;

                if (d > wallRadius) {
                    // Determine Surface Normal (Direction from Center -> Outward)
                    // We want to bounce IN, so Normal is towards Center? 
                    // Reflection formula uses surface normal. 
                    // Wall is a circle around 'target'. Normal at impact is (pos - target).normalized().
                    let normal = this.pos.copy().sub(target).normalize();

                    // Reflect Velocity: V_new = V - 2(V dot N)N
                    // p5 doesn't have reflect(), calculating manually or using simple logic.
                    // Simple logic: Reverse component along the normal.

                    let vDotN = this.vel.dot(normal);

                    // Only reflect if moving OUTWARD (dot product > 0)
                    if (vDotN > 0) {
                        // V = V - (1 + restitution) * (V . N) * N
                        let restitution = 0.8; // Bounciness
                        let impulseMag = (1 + restitution) * vDotN;
                        let impulse = normal.copy().mult(impulseMag);
                        this.vel.sub(impulse);
                    }

                    // Hard Clamp to Surface (prevent tunneling)
                    let surfacePos = normal.copy().mult(wallRadius).add(target);
                    this.pos = surfacePos;
                }

            }
            // 2. STAY (Stable when gravity high)
            else if (this.role === 'STAY' || gravityParam > 1.5) {
                if (!this.isBroken) {
                    let desired = target.copy().sub(this.pos);
                    // Add Gravity Sag (Offset target downwards)
                    if (gravityParam > 0.5) {
                        desired.y += (gravityParam * 5 * zoom);
                    }

                    let dMag = desired.mag();
                    let speed = localMaxSpeed;
                    if (dMag < 50 * zoom) speed = this.p.map(dMag, 0, 50 * zoom, 0, localMaxSpeed);
                    desired.setMag(speed);
                    let steer = desired.sub(this.vel);

                    // Apply Stability Limit
                    steer.limit(localMaxForce * 2.5 * stayMultiplier);
                    this.applyForce(steer);
                }
                // If broken, it acts like a temporary wanderer/floater
            }
            // 3 & 4. ATTRACT / REPEL
            // These roles define social status, but how do they move themselves?
            // Let's give them "Normal" behavior: Mild Wander + Avg Tether
            else {
                // Mild Wander
                let wanderR = 10 * zoom;
                let wanderD = 80 * zoom;
                this.wanderTheta += this.p.random(-0.1, 0.1);
                let circlePos = this.vel.copy().normalize().mult(wanderD).add(this.pos);
                let h = this.vel.heading();
                let circleOffset = this.p.createVector(wanderR * Math.cos(this.wanderTheta + h), wanderR * Math.sin(this.wanderTheta + h));
                let wanderSteer = circlePos.add(circleOffset).sub(this.pos).setMag(localMaxSpeed).sub(this.vel).limit(localMaxForce * 0.5);
                this.applyForce(wanderSteer);

                // Medium Wall for Social Particles (Slightly looser)
                let wallRadius = 8 * zoom;

                if (d > wallRadius) {
                    let normal = this.pos.copy().sub(target).normalize();
                    let vDotN = this.vel.dot(normal);
                    if (vDotN > 0) {
                        let restitution = 0.8;
                        let impulse = normal.copy().mult((1 + restitution) * vDotN);
                        this.vel.sub(impulse);
                    }
                    this.pos = normal.copy().mult(wallRadius).add(target);
                }
            }

            // Mouse logic moved to Top (Priority 1)

            // --- 3. GRAVITY (Downward Bias) ---
            if (gravityParam > 0.5 && !isUnderMouse) {
                // Only light constant force, mapped from param
                let gForce = this.p.createVector(0, gravityParam * 0.1);
                this.applyForce(gForce);
            }

        }

        // --- PHYSICS INTEGRATION (Universal) ---
        this.vel.add(this.acc);
        this.vel.limit(localMaxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.acc.mult(0);
        this.vel.mult(damping); // Variable Damping
    }

    draw(params) {
        let baseSize = (params.size || 6);
        // Apply Zoom Scaling AND Auto-Font Scaling
        let zoom = params.zoom || 1.0;
        let fontScale = params.fontScale || 1.0;

        let size = baseSize * this.sizeOffset * zoom * fontScale;

        this.p.push();
        this.p.translate(this.pos.x, this.pos.y);
        this.p.rotate(this.angle);

        // Style
        // --- COLOR LOGIC ---
        // params.hue = 0 -> Multicolor Mode (uses this.hueOffset as base)
        // params.hue > 0 -> Monochromatic Mode with variation (uses params.hue + this.hueOffset)

        let cHue, cSat, cBri;

        // Note: Global hues are 0-360.
        // If params.hue is near 0, we treat it as "Multicolor" mode.
        // Wait, slider default 0 is usually red. But user requested simple "Random".
        // Let's assume params.hue <= 0 invokes Multicolor.

        if (params.hue <= 0) {
            // Multicolor Mode
            cHue = this.hueOffset; // Use the particle's unique random hue
            cSat = 70; // High saturation
            cBri = 90; // High brightness
        } else {
            // Targeted Hue Mode (with slight variation)
            // Using modulo to wrap around 360
            cHue = (params.hue + this.hueOffset / 6) % 360; // Reduce variation range for mono mode
            if (cHue < 0) cHue += 360;
            cSat = 80;
            cBri = 90;
        }

        if (params.hue > 0 || params.hue <= 0) this.p.colorMode(this.p.HSB, 360, 100, 100);
        // else this.p.colorMode(this.p.RGB); // (Legacy white mode removed)

        let c = this.p.color(cHue, cSat, cBri);

        if (this.renderMode === 'STROKE') {
            this.p.noFill();
            this.p.stroke(c);
            this.p.strokeWeight(1.5 * zoom);
        } else {
            this.p.noStroke();
            this.p.fill(c);
        }

        // Shape Rendering
        switch (this.shapeType) {
            case 0: // Circle
                this.p.ellipse(0, 0, size, size);
                break;
            case 1: // Square
                this.p.rectMode(this.p.CENTER);
                this.p.rect(0, 0, size, size, params.radius);
                break;
            case 2: // Triangle
                this.drawPolygon(this.p, 0, 0, size * 0.6, 3);
                break;
            case 3: // Pentagon
                this.drawPolygon(this.p, 0, 0, size * 0.6, 5);
                break;
            case 4: // Hexagon
                this.drawPolygon(this.p, 0, 0, size * 0.6, 6);
                break;
        }

        this.p.pop();
        this.p.colorMode(this.p.RGB);
    }

    drawPolygon(p, x, y, radius, npoints) {
        let angle = p.TWO_PI / npoints;
        p.beginShape();
        for (let a = 0; a < p.TWO_PI; a += angle) {
            let sx = x + p.cos(a) * radius;
            let sy = y + p.sin(a) * radius;
            p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
    }
}
