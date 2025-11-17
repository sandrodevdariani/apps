'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
  feelsLike?: number
  pressure?: number
  visibility?: number
  country?: string
  timestamp?: string
}

export default function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load search history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('weatherSearchHistory')
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // Save search history to localStorage
  const updateSearchHistory = (cityName: string) => {
    const updated = [cityName, ...searchHistory.filter(c => c !== cityName)].slice(0, 5)
    setSearchHistory(updated)
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updated))
  }

  const fetchWeather = async (cityName?: string) => {
    const cityToSearch = cityName || city.trim()
    if (!cityToSearch) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityToSearch)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather')
      }

      setWeather(data)
      updateSearchHistory(cityToSearch)
      setCity('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto mt-4 md:mt-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🌤️ Weather Dashboard
          </h1>
          <p className="text-white/90 text-lg">Real-time weather data powered by Next.js & OpenWeatherMap API</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name (e.g., New York, London, Tokyo)..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 text-lg transition-colors"
            />
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Loading...
                </span>
              ) : (
                'Get Weather'
              )}
            </button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2 font-medium">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyCity, index) => (
                  <button
                    key={index}
                    onClick={() => fetchWeather(historyCity)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {historyCity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {/* Weather Display */}
          {weather && (
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 md:p-8 border-2 border-purple-200 animate-fadeIn">
              {/* Main Weather Info */}
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">{weather.icon}</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {weather.city}
                  {weather.country && <span className="text-xl text-gray-600">, {weather.country}</span>}
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 capitalize mb-2">
                  {weather.description}
                </p>
                <div className="text-6xl md:text-7xl font-bold text-gray-800">
                  {weather.temperature}°C
                </div>
                {weather.feelsLike && (
                  <p className="text-gray-600 mt-2">Feels like {weather.feelsLike}°C</p>
                )}
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-gray-600 text-sm mb-2 font-medium">Humidity</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {weather.humidity}%
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-gray-600 text-sm mb-2 font-medium">Wind Speed</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {weather.windSpeed} km/h
                  </div>
                </div>

                {weather.pressure && (
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-gray-600 text-sm mb-2 font-medium">Pressure</div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {weather.pressure} hPa
                    </div>
                  </div>
                )}

                {weather.visibility !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="text-gray-600 text-sm mb-2 font-medium">Visibility</div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800">
                      {(weather.visibility / 1000).toFixed(1)} km
                    </div>
                  </div>
                )}
              </div>

              {weather.timestamp && (
                <div className="mt-6 text-center text-sm text-gray-500">
                  Last updated: {new Date(weather.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!weather && !error && !loading && (
            <div className="text-center py-12 md:py-16 text-gray-500">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-lg md:text-xl mb-2">Search for weather information</p>
              <p className="text-sm text-gray-400">Enter a city name above to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 text-sm">
          <p>Built with Next.js, React, TypeScript & Tailwind CSS</p>
          <p className="mt-1">Deployed on Netlify • Powered by OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  )
}
