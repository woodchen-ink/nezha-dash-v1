# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based dashboard for Nezha monitoring system (哪吒监控面板V1版美化). It's a TypeScript + Vite application that displays server monitoring data with a modern UI built using Tailwind CSS and Radix UI components.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint with TypeScript extensions
- `npm run preview` - Preview production build locally

## Architecture

### Core Structure
- **App.tsx**: Main application component with routing, background layers, and error boundaries
- **main.tsx**: Application entry point with provider hierarchy
- **lib/nezha-api.ts**: API client for Nezha monitoring backend
- **vite.config.ts**: Vite configuration with proxy setup for development

### Key Patterns

**Provider Hierarchy** (from main.tsx):
```
MotionProvider → ThemeProvider → QueryClientProvider → WebSocketProvider → StatusProvider → SortProvider → TooltipProvider → App
```

**Context System**: The app uses multiple React contexts for state management:
- `WebSocketProvider`: Real-time server data via WebSocket (`/api/v1/ws/server`)
- `StatusProvider`: Server status management 
- `SortProvider`: Data sorting state
- `TooltipProvider`: UI tooltip management
- `ThemeProvider`: Dark/light theme switching

**API Communication**:
- REST API calls via React Query for data fetching
- WebSocket connection for real-time updates
- All API endpoints prefixed with `/api/v1/`
- Development proxy configured to `localhost:18009`

### Key Directories

- `src/components/`: UI components including charts, server cards, and layouts
- `src/components/ui/`: Reusable UI components based on Radix UI
- `src/context/`: React context providers and hooks
- `src/hooks/`: Custom React hooks
- `src/lib/`: Utility functions and API client
- `src/pages/`: Main page components (Server, ServerDetail, Error pages)
- `src/types/`: TypeScript type definitions

### Styling & UI
- Tailwind CSS for styling with custom configuration
- Framer Motion for animations
- Dynamic background with random images from `https://random-api.czl.net/pic/normal`
- Glassmorphism effect with backdrop blur and dark overlay

### State Management
- React Query for server state and caching
- React Context for client state
- WebSocket for real-time data synchronization

## Development Notes

**API Proxy**: The development server proxies `/api/v1/` requests to `http://localhost:18009` and WebSocket connections to `ws://localhost:18009`.

**Custom Code Injection**: The app supports custom code injection via the settings API response (`settingData?.data?.config?.custom_code`).

**Theme System**: Supports forced theme setting via global `window.ForceTheme` variable.

**Internationalization**: Uses i18next for translations (currently supports English).