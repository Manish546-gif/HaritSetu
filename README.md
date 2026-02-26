# HaritSetu

HaritSetu is a front-end prototype for a sustainable agriculture and carbon-credit ecosystem. It includes role-based panels, carbon calculators, a marketplace, a wallet, and field mapping.

## Features
- Role-based dashboards for farmer, business, and admin personas
- Carbon credit calculators for multiple activities
- Marketplace and wallet flows for credits
- Field mapping with Leaflet and polygon tools
- 3D visual elements with Three.js

## Tech Stack
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- React Router
- Leaflet + react-leaflet
- Three.js + @react-three/fiber
- Ethers.js (web3 integration)

## Project Structure
```
src/
	components/        # Shared, non-feature UI and layout components
	context/           # App context providers
	features/          # Feature modules (calculator, marketplace, wallet, map)
		calculator/
			components/
			utils/
		marketplace/
			components/
		wallet/
			components/
		map/
			components/
	hooks/             # Reusable hooks
	lib/               # Service wrappers (auth, ledger, web3)
	pages/             # Route-level pages
	utils/             # Shared utilities
	App.tsx
	main.tsx
```

## Getting Started
### Prerequisites
- Node.js 18+ (or compatible LTS)
- npm or bun

### Install
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Scripts
- `dev`: start the dev server
- `build`: production build
- `build:dev`: development-mode build
- `lint`: run ESLint
- `preview`: preview production build

## Environment Variables
No required environment variables are defined in the repo. If you add network or API configuration, use Vite-prefixed variables (for example, `VITE_RPC_URL`) in a `.env` file.

## Contributing
1. Create a feature branch
2. Make changes with focused commits
3. Run `npm run lint`
4. Open a PR with a short summary and screenshots if UI changes are involved

## License
This project is not currently licensed. Add a license file if you plan to distribute it.

