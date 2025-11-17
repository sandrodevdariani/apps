# 🌤️ Weather Dashboard

A modern, full-stack weather application built with Next.js, React, and TypeScript. Features real-time weather data, beautiful UI, and comprehensive weather details for any city worldwide. Perfect for showcasing React and Node.js skills in your portfolio.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

## ✨ Features

- 🌍 **Real-time Weather Data** - Get current weather information for any city worldwide
- 🔍 **City Search** - Quick search with Enter key support
- 📚 **Search History** - Automatically saves last 5 searched cities (localStorage)
- 📊 **Comprehensive Details** - Temperature, feels-like, humidity, wind speed, pressure, visibility
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🚀 **Server-side API Routes** - Next.js API routes for secure backend operations
- ⚡ **Fast Performance** - Optimized with Next.js App Router
- 🎯 **TypeScript** - Fully typed for better developer experience
- 🌈 **Mock Data Fallback** - Works even without API key (demo mode)

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js** - Runtime environment

### APIs & Services
- **OpenWeatherMap API** - Weather data provider
- **Netlify** - Hosting platform

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (Optional)
   
   Create a `.env.local` file in the root directory:
   ```env
   WEATHER_API_KEY=your_openweathermap_api_key
   ```
   
   > 💡 **Get a free API key**: Sign up at [OpenWeatherMap](https://openweathermap.org/api) to get your free API key (no credit card required).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

1. Enter a city name in the search input (e.g., "New York", "London", "Tokyo")
2. Click "Get Weather" or press Enter
3. View comprehensive weather information including:
   - Current temperature and "feels like" temperature
   - Weather description and icon
   - Humidity, wind speed, pressure, and visibility
4. Click on any city in "Recent Searches" to quickly view its weather again

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🌐 Deployment to Netlify

### Method 1: Deploy via Netlify Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Netlify will auto-detect Next.js (via `netlify.toml`)

4. **Add Environment Variable**
   - Go to Site settings → Environment variables
   - Add `WEATHER_API_KEY` with your OpenWeatherMap API key
   - Click "Deploy site"

### Method 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

### Netlify Configuration

The `netlify.toml` file is pre-configured:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
nextjs-weather-dashboard/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts      # Weather API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page component
│   └── globals.css           # Global styles
├── public/                   # Static assets
├── netlify.toml             # Netlify configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## 📝 API Details

### Weather API Route

**Endpoint**: `/api/weather`

**Method**: `GET`

**Query Parameters**:
- `city` (required): City name to search for

**Example**:
```
GET /api/weather?city=London
```

**Response**:
```json
{
  "city": "London",
  "temperature": 15,
  "description": "clear sky",
  "humidity": 65,
  "windSpeed": 12,
  "icon": "☀️",
  "feelsLike": 14,
  "pressure": 1013,
  "visibility": 10000,
  "country": "GB",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Features Showcase

### Portfolio Highlights

This project demonstrates:
- ✅ Full-stack development (React + Node.js)
- ✅ Modern React patterns (Hooks, State Management)
- ✅ TypeScript for type safety
- ✅ RESTful API design
- ✅ Responsive web design
- ✅ Third-party API integration
- ✅ Error handling and loading states
- ✅ Local storage for persistence
- ✅ Clean, maintainable code structure

## 🐛 Troubleshooting

### Issue: "City not found"
- Ensure the city name is spelled correctly
- Try using the city's English name
- Some cities may need country code (e.g., "London, UK")

### Issue: API not working
- Check if `WEATHER_API_KEY` is set correctly
- Verify your API key is active on OpenWeatherMap
- The app will use mock data if no API key is provided

### Issue: Build fails on Netlify
- Ensure Node.js version is 18+ in Netlify settings
- Check that all dependencies are in `package.json`
- Review build logs for specific errors

## 📄 License

This project is open source and available for portfolio use.

## 👨‍💻 Author

Built as a portfolio project showcasing React and Node.js skills.

---

**Made with ❤️ using Next.js, React, and TypeScript**
