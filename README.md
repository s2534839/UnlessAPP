# SnailMail - The World's Most Hilariously Useless Email Service

> A hackathon project that sends emails at the speed of traditional postal service. Why deliver instantly when you can wait weeks?

SnailMail calculates the physical distance between sender and recipient, then delivers your email at the speed of walking, swimming, carrier pigeon, or rock climbing. Because sometimes, instant communication is just too convenient.

## Features

- **Real Distance Calculation**: Powered by Google Maps Distance Matrix API
- **Multiple Transport Modes**: Compare delivery times across 4 hilariously slow methods:
  - **Pigeon** (80 km/h) - The "express" option
  -  **Walking** (5 km/h) - Classic postal delivery experience
  -  **Swimming** (3 km/h) - For the aquatically inclined
  -  **Rock Climbing** (1 km/h) - The scenic route
- **Smart AI Fallback**: Claude AI provides estimates when Google Maps is unavailable
- **Beautiful UI**: Pixel art animations and responsive design
- **Email Delivery**: Actually sends emails (via Gmail) with calculated delays
- **Full TypeScript**: Type-safe throughout the entire stack

## Tech Stack

### Frontend
- React 19.2 + TypeScript 5.9
- Vite 7.2 (build tool)
- CSS3 with pixel art animations

### Backend
- Express.js + TypeScript
- Google Maps Distance Matrix API
- Anthropic Claude AI (fallback)
- Nodemailer (email delivery)

## Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│   (Vite + TS)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express API    │ (Port 3001)
│   (Node + TS)   │
└────────┬────────┘
         │
    ┌────┴─────────────────┐
    ▼                      ▼
┌──────────┐        ┌──────────┐
│  Google  │        │  Claude  │
│   Maps   │        │    AI    │
│   API    │        │(Fallback)│
└──────────┘        └──────────┘
```

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 16 or higher
- **npm** or **yarn**
- **Google Maps API Key** (with Distance Matrix API enabled)
- **Anthropic API Key** (for Claude AI fallback)
- **Gmail Account** with App Password (for sending emails)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd snailMail
```

### 2. Set Up the Backend

```bash
cd snailMail-Backend
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys (see "Obtaining API Keys" below):

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password_here
PORT=3001
```

### 3. Set Up the Frontend

```bash
cd ../snailMail-Frontend
npm install
```

Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

The default configuration should work:

```env
VITE_API_URL=http://localhost:3001
```

### 4. Run the Application

**Terminal 1 - Start the Backend:**
```bash
cd snailMail-Backend
npm run dev
```

Backend will run on: `http://localhost:3001`

**Terminal 2 - Start the Frontend:**
```bash
cd snailMail-Frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to use SnailMail!

## Obtaining API Keys

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Library**
4. Search for "Distance Matrix API" and enable it
5. Go to **APIs & Services** > **Credentials**
6. Click **Create Credentials** > **API Key**
7. Copy your API key
8. (Recommended) Restrict the API key to only Distance Matrix API

**Cost**: Google Maps API has a free tier with $200/month credit. Distance Matrix API costs $0.005-$0.010 per request after free tier.

### Anthropic Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy your API key

**Cost**: Anthropic charges per token used. The fallback feature uses minimal tokens (~100-200 per request).

### Gmail App Password

**Important**: Never use your regular Gmail password. Always use an App Password.

1. Go to your [Google Account](https://myaccount.google.com/)
2. Navigate to **Security**
3. Enable **2-Step Verification** (required for App Passwords)
4. Go to **Security** > **App Passwords**
5. Select **Mail** and your device
6. Click **Generate**
7. Copy the 16-character password (spaces don't matter)
8. Use this password in your `.env` file

## Project Structure

```
snailMail/
├── README.md                      # This file
├── .gitignore                     # Git ignore rules
│
├── snailMail-Backend/             # Express.js API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── distance.ts       # Distance calculation endpoints
│   │   │   └── email.ts          # Email endpoints
│   │   ├── services/
│   │   │   ├── distanceCalculator.ts    # Main orchestration
│   │   │   ├── googleMapsService.ts     # Google Maps integration
│   │   │   ├── claudeService.ts         # Claude AI fallback
│   │   │   └── emailService.ts          # Email sending
│   │   └── server.ts             # Express app setup
│   ├── .env.example              # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md                 # Backend-specific docs
│
└── snailMail-Frontend/           # React + Vite UI
    ├── src/
    │   ├── components/
    │   │   ├── DeliveryCalculator.tsx       # Main form
    │   │   ├── TransportResults.tsx         # Results display
    │   │   ├── TransportMode.tsx            # Individual mode
    │   │   ├── EmailComposer.tsx            # Email composer
    │   │   ├── EmailDeliveryProgress.tsx    # Progress tracker
    │   │   └── Homepage.tsx                 # Landing page
    │   ├── services/
    │   │   └── api.ts                       # Backend API client
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    ├── .gitignore
    ├── package.json
    ├── vite.config.ts
    └── README.md                 # Frontend-specific docs
```

## API Documentation

### Calculate All Transport Modes

```bash
POST /api/distance/calculate-all
Content-Type: application/json

{
  "origin": { "address": "San Francisco, CA" },
  "destination": { "address": "New York, NY" }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "transportMode": "pigeon",
      "speedKmH": 80,
      "distanceText": "4,135 km",
      "deliveryTimeText": "51 hours, 41 minutes",
      "isEstimate": false,
      "method": "google-maps"
    },
    {
      "transportMode": "walking",
      "speedKmH": 5,
      "distanceText": "4,135 km",
      "deliveryTimeText": "34 days, 10 hours",
      "isEstimate": false,
      "method": "google-maps"
    }
  ]
}
```

### Calculate Single Transport Mode

```bash
POST /api/distance/calculate
Content-Type: application/json

{
  "origin": { "address": "Tokyo, Japan" },
  "destination": { "address": "Sydney, Australia" },
  "mode": "swimming"
}
```

### Health Check

```bash
GET /api/distance/health
```

## How It Works

1. **User Input**: Enter origin and destination addresses
2. **Distance Calculation**:
   - Primary: Google Maps Distance Matrix API calculates actual distance
   - Fallback: Claude AI estimates distance if Google Maps fails
3. **Delivery Time Calculation**: Backend calculates how long it would take to physically travel that distance at each transport mode's speed
4. **Display Results**: Frontend shows all options sorted by delivery time (fastest first)
5. **Send Email**: User can compose and send an email that will be delivered after the calculated delay

## Transport Speeds

| Transport Mode | Speed | Example: SF to NYC (4,135 km) |
|----------------|-------|-------------------------------|
| 🕊️ Pigeon     | 80 km/h | 51 hours, 41 minutes         |
| 🚶 Walking     | 5 km/h  | 34 days, 10 hours            |
| 🏊 Swimming    | 3 km/h  | 57 days, 8 hours             |
| 🧗 Rock Climbing | 1 km/h | 172 days, 1 hour           |

## Development

### Backend Development

```bash
cd snailMail-Backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Run production build
```

### Frontend Development

```bash
cd snailMail-Frontend
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Troubleshooting

### Backend won't start

- Ensure all API keys are set in `.env`
- Check that port 3001 is not in use
- Run `npm install` to ensure dependencies are installed

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Google Maps API errors

- Verify Distance Matrix API is enabled in Google Cloud Console
- Check that your API key is not restricted from Distance Matrix API
- Ensure you haven't exceeded free tier quota

### Email not sending

- Verify you're using a Gmail App Password, not regular password
- Ensure 2-Step Verification is enabled on your Google Account
- Check EMAIL_USER and EMAIL_APP_PASSWORD in backend `.env`

## Security Notes

- Never commit `.env` files to git
- Never use your regular Gmail password (use App Passwords)
- Rotate API keys if accidentally exposed
- Consider adding rate limiting for production use

## License

MIT

## Credits

Built for a hackathon with the prompt: "Make the most hilariously useless app possible."

Mission accomplished. 🐌📧✨

---

**Questions or Issues?** Check the component-specific README files in the backend and frontend directories for more detailed documentation.
