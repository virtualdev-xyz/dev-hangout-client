# DevHangout

A real-time, interactive spatial platform for developers with a retro gaming aesthetic.

## 🎮 Features

- Real-time spatial interaction
- Retro-styled UI with 8-bit aesthetics
- Voice chat with spatial audio
- Code sharing and collaboration tools
- Customizable pixel art avatars

## 🛠 Tech Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit
- **Rendering Engine**: PixiJS
- **Networking**: Socket.io & WebRTC
- **Build Tool**: Vite
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devhangout.git
cd devhangout
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` to access the application.


## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

## 🎨 Design System

The UI follows a retro gaming aesthetic with:
- Pixel-perfect typography using "Press Start 2P" font
- 8-bit inspired color palette
- Grid-based layout (8px base unit)
- Arcade-style components and animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write unit tests for new features
- Follow component structure guidelines
- Use CSS Modules for styling

### Component Guidelines

- Keep components small and focused
- Use functional components with hooks
- Follow the container/presenter pattern
- Implement proper error boundaries
- Document complex component logic

### State Management

- Use Redux for global state
- Use local state for UI-specific state
- Implement proper error handling
- Follow Redux Toolkit patterns
- Use selectors for derived state

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PixiJS](https://pixijs.com/) for 2D rendering
- [Socket.IO](https://socket.io/) for real-time communication
- [Simple Peer](https://github.com/feross/simple-peer) for WebRTC