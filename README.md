# Bacteriograph

**Bacteriograph** is a generative design tool that reconstructs Japanese Katakana characters using particle physics simulations. It allows users to create, manipulate, and export unique typographic designs in SVG format.

**Design Philosophy**: Swiss Style / Constructivist (Minimalist, Grid-based, Sans-serif typography, Dark Mode).

![Preview](./public/vite.svg) (*Replace with actual screenshot if available*)

## Features

- **Generative Typography**: Reconstructs Katakana input with geometric particles.
- **Physics Simulation**: Features gravity, floating, and mouse interaction (repel/attract).
- **Customizable**: Adjust size, zoom, particle shape, and physics parameters.
- **Color Modes**:
  - **Multicolor**: Harmonious random colors (Pastel/Neon).
  - **Monochromatic**: tonal variations based on a selected hue.
- **Export**: Robust SVG export (Vector) for use in Illustrator/Figma.

## Usage

1. **Input Text**: Type Katakana in the input box.
2. **Adjust Controls**: Use sliders to tweak physics and visuals.
3. **Shortcuts**:
   - `F`: Toggle UI (Fullscreen view)
   - `G`: Toggle Background Grid
   - `Enter`: Pause/Resume Simulation
   - `Space + Drag`: Pan the view
   - `Scroll`: Zoom in/out
4. **Save**: Click "SVG保存" to download the vector file.

## Installation & Development

This project uses [Vite](https://vitejs.dev/) and [p5.js](https://p5js.org/).

### Prerequisites
- Node.js (v18+)

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Build

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## File Structure

- `src/sketch.js`: Core p5.js logic (Rendering, Physics, Interaction).
- `src/TextParticle.js`: Particle class definition.
- `src/main.js`: Entry point.
- `index.html`: UI structure.

## License
MIT
