# SnailMail Frontend

A hilarious email delivery service frontend that calculates delivery times based on ridiculously slow transport methods. Built with React, TypeScript, and Vite.

## Features

- **Real Distance Calculation**: Integrates with backend API using Google Maps Distance Matrix API
- **Multiple Transport Modes**: Compare delivery times across 4 different transport methods:
  - 🕊️ **Pigeon** (80 km/h) - The fastest option
  - 🚶 **Walking** (5 km/h) - Classic postal delivery
  - 🏊 **Swimming** (3 km/h) - Aquatic mail service
  - 🧗 **Rock Climbing** (1 km/h) - The most adventurous route
- **Beautiful Pixel Art Animations**: Each transport mode has custom pixel art animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and loading states
- **Smart Fallback**: Shows AI estimates when Google Maps is unavailable

## Tech Stack

- **React 19.2** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7.2** - Build tool and dev server
- **CSS3** - Styling with animations

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Running SnailMail Backend (see `../snailMail-Backend/README.md`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and set your backend URL (default is http://localhost:3001)
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
snailMail-Frontend/
├── src/
│   ├── components/
│   │   ├── DeliveryCalculator.tsx    # Main calculator component
│   │   ├── DeliveryCalculator.css
│   │   ├── TransportResults.tsx      # Results display with all transport modes
│   │   ├── TransportResults.css
│   │   ├── TransportMode.tsx         # Individual transport mode with pixel art
│   │   └── TransportMode.css         # Pixel art animations
│   ├── services/
│   │   └── api.ts                    # Backend API integration
│   ├── App.tsx                       # Root component
│   ├── App.css                       # Global styles
│   └── main.tsx                      # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## API Integration

The frontend communicates with the backend through the API service layer (`src/services/api.ts`).

### Main API Endpoints Used

- `POST /api/distance/calculate-all` - Calculate delivery times for all transport modes
- `GET /api/distance/health` - Check backend health

### Example API Call

```typescript
import { apiService } from './services/api';

const results = await apiService.calculateAll(
  { address: 'San Francisco, CA' },
  { address: 'New York, NY' }
);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Use TypeScript for all components
- Use functional components with hooks
- Follow React best practices
- Use type-only imports for types when `verbatimModuleSyntax` is enabled

## How It Works

1. User enters origin and destination addresses
2. Frontend calls the backend API with the addresses
3. Backend uses Google Maps Distance Matrix API to calculate actual distance
4. Backend calculates delivery time for each transport mode based on speed
5. Frontend displays all options sorted by delivery time (fastest first)
6. User can click on any transport mode to see detailed information

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Backend Connection Issues

If you see "Failed to calculate delivery times", ensure:
1. Backend is running on the correct port (default: 3001)
2. CORS is configured correctly in backend
3. `VITE_API_URL` in `.env` matches your backend URL

### Build Errors

If you encounter TypeScript errors:
1. Run `npm install` to ensure all dependencies are installed
2. Check that you're using Node.js 16 or higher
3. Clear TypeScript cache: `rm -rf node_modules/.cache`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Credits

Built with love and humor for the most inefficient email service in the world! 🐌📬
