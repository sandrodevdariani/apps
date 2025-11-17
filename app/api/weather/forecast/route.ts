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

  const API_KEY = process.env.WEATHER_API_KEY || 'demo_key'

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

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

    // Group forecast by day and get daily data
    const forecastMap = new Map<string, any>()
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()
      
      if (!forecastMap.has(dateKey) || date.getHours() === 12) {
        forecastMap.set(dateKey, {
          date: date.toISOString(),
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          description: item.weather[0].description,
          icon: iconMap[item.weather[0].icon] || '🌤️',
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6),
        })
      } else {
        const existing = forecastMap.get(dateKey)!
        if (item.main.temp_min < existing.tempMin) existing.tempMin = Math.round(item.main.temp_min)
        if (item.main.temp_max > existing.tempMax) existing.tempMax = Math.round(item.main.temp_max)
      }
    })

    const forecast = Array.from(forecastMap.values()).slice(0, 5)

    return NextResponse.json({
      city: data.city.name,
      country: data.city.country,
      forecast,
    })
  } catch (error: any) {
    // Mock forecast data for demo
    const mockForecast = []
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    for (let i = 0; i < 5; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      mockForecast.push({
        date: date.toISOString(),
        dayName: days[i] || date.toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.floor(Math.random() * 10) + 15,
        tempMin: Math.floor(Math.random() * 5) + 10,
        tempMax: Math.floor(Math.random() * 10) + 20,
        description: 'partly cloudy',
        icon: '⛅',
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 15) + 5,
      })
    }

    const apiKey = process.env.WEATHER_API_KEY || 'demo_key'
    if (apiKey === 'demo_key') {
      return NextResponse.json({
        city: city,
        country: 'Demo',
        forecast: mockForecast,
      })
    }

    return NextResponse.json(
      { error: 'Failed to fetch forecast data.' },
      { status: 500 }
    )
  }
}

