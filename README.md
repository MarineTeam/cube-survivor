# Cube Survivor

A fast-paced 3D cube survival game built with Next.js and Three.js.

## Live Demo
🎮 [Play at cubesurvivor.vercel.app](https://cubesurvivor.vercel.app/)

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

### Build for Production
```bash
npm run build
npm start
```

## Deployment
Deploy to Vercel:
```bash
npm i -g vercel
vercel
```

## Game Features
- 🎮 Real-time 3D gameplay
- 🧊 Cube navigation and collision detection
- 🎯 Score system
- ⌨️ Keyboard controls
- 📱 Responsive design

## Controls
- **Arrow Keys** or **WASD** - Move
- **Space** - Jump/Action
- **ESC** - Pause/Menu

## Project Structure
```
├── pages/
│   ├── _app.tsx
│   └── index.tsx
├── components/
│   ├── Game.tsx
│   └── UI/
├── public/
└── styles/
```

## Technologies
- **Next.js** - React framework
- **Three.js** - 3D graphics
- **TypeScript** - Type safety