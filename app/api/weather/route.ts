import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get('city')

  if (!city) {
    return NextResponse.json(
      { error: 'City parameter is required' },
      { status: 400 }
    )
  }

  // Using OpenWeatherMap API (free tier)
  // You can get a free API key from https://openweathermap.org/api
  const API_KEY = process.env.WEATHER_API_KEY || 'demo_key'

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        )
      }
      throw new Error('Weather API error')
    }

    const data = await response.json()

    // Map weather icons
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌦️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️',
    }

    return NextResponse.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: iconMap[data.weather[0].icon] || '🌤️',
      feelsLike: Math.round(data.main.feels_like),
      pressure: data.main.pressure,
      visibility: data.visibility,
      country: data.sys.country,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    // Fallback mock data for demo purposes if API fails or no API key
    const mockData = {
      city: city,
      temperature: Math.floor(Math.random() * 15) + 15,
      description: 'partly cloudy',
      humidity: Math.floor(Math.random() * 30) + 50,
      windSpeed: Math.floor(Math.random() * 20) + 5,
      icon: '⛅',
      feelsLike: Math.floor(Math.random() * 15) + 15,
      pressure: Math.floor(Math.random() * 50) + 1000,
      visibility: Math.floor(Math.random() * 5 + 5) * 1000,
      country: 'Demo',
      timestamp: new Date().toISOString(),
    }
    
    // Only return mock data if API key is missing (demo mode)
    if (API_KEY === 'demo_key') {
      return NextResponse.json(mockData)
    }
    
    // Otherwise return error
    return NextResponse.json(
      { error: 'Failed to fetch weather data. Please check your API key or try again later.' },
      { status: 500 }
    )
  }
}

