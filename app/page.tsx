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

interface ForecastDay {
  date: string
  dayName: string
  temp: number
  tempMin: number
  tempMax: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
}

interface ForecastData {
  city: string
  country: string
  forecast: ForecastDay[]
}

type TabType = 'current' | 'forecast' | 'favorites' | 'compare'

export default function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [loading, setLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareCities, setCompareCities] = useState<string[]>([])
  const [compareWeather, setCompareWeather] = useState<WeatherData[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('current')

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory')
    const savedFavorites = localStorage.getItem('weatherFavorites')
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory))
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  const updateSearchHistory = (cityName: string) => {
    const updated = [cityName, ...searchHistory.filter(c => c !== cityName)].slice(0, 5)
    setSearchHistory(updated)
    localStorage.setItem('weatherSearchHistory', JSON.stringify(updated))
  }

  const toggleFavorite = (cityName: string) => {
    const updated = favorites.includes(cityName)
      ? favorites.filter(c => c !== cityName)
      : [...favorites, cityName]
    setFavorites(updated)
    localStorage.setItem('weatherFavorites', JSON.stringify(updated))
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
      
      // Auto-fetch forecast when weather is loaded
      if (activeTab === 'forecast') {
        fetchForecast(cityToSearch)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchForecast = async (cityName?: string) => {
    const cityToSearch = cityName || weather?.city || ''
    if (!cityToSearch) return

    setForecastLoading(true)
    try {
      const response = await fetch(`/api/weather/forecast?city=${encodeURIComponent(cityToSearch)}`)
      const data = await response.json()

      if (response.ok) {
        setForecast(data)
      }
    } catch (err) {
      console.error('Failed to fetch forecast')
    } finally {
      setForecastLoading(false)
    }
  }

  const addToCompare = async (cityName: string) => {
    if (compareCities.includes(cityName) || compareCities.length >= 3) return

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`)
      const data = await response.json()

      if (response.ok) {
        setCompareCities([...compareCities, cityName])
        setCompareWeather([...compareWeather, data])
      }
    } catch (err) {
      console.error('Failed to add to compare')
    }
  }

  const removeFromCompare = (cityName: string) => {
    const index = compareCities.indexOf(cityName)
    setCompareCities(compareCities.filter(c => c !== cityName))
    setCompareWeather(compareWeather.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchWeather()
    }
  }

  const getWeatherBackground = () => {
    if (!weather) return 'weather-bg-default'
    const desc = weather.description.toLowerCase()
    const temp = weather.temperature
    
    if (desc.includes('rain') || desc.includes('drizzle')) return 'weather-bg-rainy'
    if (desc.includes('snow') || desc.includes('sleet')) return 'weather-bg-snowy'
    if (desc.includes('cloud')) return 'weather-bg-cloudy'
    if (desc.includes('clear') || desc.includes('sun')) return 'weather-bg-sunny'
    if (temp >= 25) return 'temp-hot'
    if (temp >= 15) return 'temp-warm'
    if (temp >= 5) return 'temp-cool'
    return 'temp-cold'
  }

  const getTempClass = () => {
    if (!weather) return ''
    const temp = weather.temperature
    if (temp >= 25) return 'temp-hot'
    if (temp >= 15) return 'temp-warm'
    if (temp >= 5) return 'temp-cool'
    return 'temp-cold'
  }

  useEffect(() => {
    if (activeTab === 'forecast' && weather) {
      fetchForecast(weather.city)
    }
  }, [activeTab])

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-1000 ${getWeatherBackground()}`}>
      {/* Animated Background Particles */}
      {weather && (
        <div className="particles fixed inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                animation: `float ${Math.random() * 10 + 10}s infinite`,
                animationDelay: Math.random() * 5 + 's',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-4 md:mt-10 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl animate-pulse-slow">
            <span className="inline-block animate-float">🌤️</span> Weather Dashboard
          </h1>
          <p className="text-white/90 text-lg font-medium">Real-time weather data powered by Next.js & OpenWeatherMap API</p>
        </div>

        {/* Main Card */}
        <div className="glass-card rounded-3xl shadow-2xl p-6 md:p-8 mb-6 animate-scale-in">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name (e.g., New York, London, Tokyo)..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 text-lg transition-all duration-300 hover:shadow-lg"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-lg animate-shimmer"
              style={{ backgroundSize: '200% auto' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-2xl">⏳</span> Loading...
                </span>
              ) : (
                'Get Weather'
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b-2 border-gray-200">
            {[
              { id: 'current', label: '📊 Current', icon: '📊' },
              { id: 'forecast', label: '📅 Forecast', icon: '📅' },
              { id: 'favorites', label: '⭐ Favorites', icon: '⭐' },
              { id: 'compare', label: '⚖️ Compare', icon: '⚖️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-6 py-3 rounded-t-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mb-6 animate-slide-in">
              <p className="text-gray-600 text-sm mb-3 font-semibold">Recent Searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyCity, index) => (
                  <button
                    key={index}
                    onClick={() => fetchWeather(historyCity)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-pink-100 text-gray-700 hover:text-purple-700 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 hover:shadow-lg smooth-transition"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {historyCity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl mb-4 animate-slide-in shadow-lg">
              <p className="font-semibold flex items-center gap-2">
                <span className="text-xl">⚠️</span> {error}
              </p>
            </div>
          )}

          {/* Current Weather Tab */}
          {activeTab === 'current' && weather && (
            <div className="animate-fadeIn">
              <div className={`rounded-2xl p-8 md:p-10 mb-6 shadow-2xl ${getTempClass()} bg-opacity-90 backdrop-blur-sm relative overflow-hidden`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1"></div>
                  <button
                    onClick={() => toggleFavorite(weather.city)}
                    className={`text-3xl transition-transform duration-300 hover:scale-125 ${
                      favorites.includes(weather.city) ? 'text-yellow-400' : 'text-white/60'
                    }`}
                  >
                    {favorites.includes(weather.city) ? '⭐' : '☆'}
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-8xl md:text-9xl inline-block animate-float mb-6">
                    {weather.icon}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                    {weather.city}
                    {weather.country && <span className="text-2xl text-white/80">, {weather.country}</span>}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/90 capitalize mb-4 font-semibold">
                    {weather.description}
                  </p>
                  <div className="mb-4">
                    <div className="text-7xl md:text-8xl font-bold text-white drop-shadow-2xl inline-block">
                      {weather.temperature}°
                    </div>
                    <div className="text-4xl text-white/80 font-semibold inline-block ml-2">C</div>
                  </div>
                  {weather.feelsLike && (
                    <p className="text-lg text-white/80 font-medium">Feels like {weather.feelsLike}°C</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-lg hover-lift border-2 border-blue-200">
                  <div className="text-blue-600 text-sm mb-2 font-bold flex items-center gap-2">💧 Humidity</div>
                  <div className="text-3xl md:text-4xl font-bold text-blue-800">{weather.humidity}%</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-lg hover-lift border-2 border-green-200 floating-delay-1">
                  <div className="text-green-600 text-sm mb-2 font-bold flex items-center gap-2">💨 Wind</div>
                  <div className="text-3xl md:text-4xl font-bold text-green-800 animate-wind">
                    {weather.windSpeed} <span className="text-xl">km/h</span>
                  </div>
                </div>
                {weather.pressure && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-lg hover-lift border-2 border-purple-200 floating-delay-2">
                    <div className="text-purple-600 text-sm mb-2 font-bold flex items-center gap-2">📊 Pressure</div>
                    <div className="text-3xl md:text-4xl font-bold text-purple-800">
                      {weather.pressure} <span className="text-xl">hPa</span>
                    </div>
                  </div>
                )}
                {weather.visibility !== undefined && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-lg hover-lift border-2 border-orange-200 floating-delay-3">
                    <div className="text-orange-600 text-sm mb-2 font-bold flex items-center gap-2">👁️ Visibility</div>
                    <div className="text-3xl md:text-4xl font-bold text-orange-800">
                      {(weather.visibility / 1000).toFixed(1)} <span className="text-xl">km</span>
                    </div>
                  </div>
                )}
              </div>

              {weather.timestamp && (
                <div className="text-center text-sm text-gray-500 font-medium">
                  Last updated: {new Date(weather.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {/* Forecast Tab */}
          {activeTab === 'forecast' && (
            <div className="animate-fadeIn">
              {!weather ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Search for a city first to see the forecast</p>
                </div>
              ) : forecastLoading ? (
                <div className="text-center py-12">
                  <span className="animate-spin text-4xl">⏳</span>
                  <p className="mt-4 text-gray-600">Loading forecast...</p>
                </div>
              ) : forecast ? (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    5-Day Forecast for {forecast.city}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.forecast.map((day, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 shadow-lg hover-lift border-2 border-purple-200 animate-slide-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2 animate-float">{day.icon}</div>
                          <div className="font-bold text-gray-800 mb-1">{day.dayName}</div>
                          <div className="text-2xl font-bold text-gray-800 mb-1">{day.temp}°C</div>
                          <div className="text-sm text-gray-600 mb-2">
                            {day.tempMin}° / {day.tempMax}°
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{day.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => fetchForecast(weather.city)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                >
                  Load 5-Day Forecast
                </button>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="animate-fadeIn">
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-lg">No favorite cities yet</p>
                  <p className="text-sm text-gray-400 mt-2">Click the star icon on any city to add it to favorites</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((favCity, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        fetchWeather(favCity)
                        setActiveTab('current')
                      }}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg hover-lift border-2 border-yellow-200 text-left animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl mb-2">⭐</div>
                          <div className="text-xl font-bold text-gray-800">{favCity}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(favCity)
                          }}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          ✕
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <div className="animate-fadeIn">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add city to compare (max 3)..."
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      await addToCompare(e.currentTarget.value.trim())
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              
              {compareWeather.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">⚖️</div>
                  <p className="text-lg">Add up to 3 cities to compare weather</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {compareWeather.map((w, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border-2 border-purple-200 animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-4xl mb-2">{w.icon}</div>
                          <div className="font-bold text-gray-800">{w.city}</div>
                        </div>
                        <button
                          onClick={() => removeFromCompare(compareCities[index])}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-3xl font-bold text-gray-800 mb-2">{w.temperature}°C</div>
                      <div className="text-sm text-gray-600 capitalize mb-2">{w.description}</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>💧 {w.humidity}%</div>
                        <div>💨 {w.windSpeed} km/h</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!weather && !error && !loading && activeTab === 'current' && (
            <div className="text-center py-16 md:py-20 text-gray-500 animate-fadeIn">
              <div className="text-8xl mb-6 animate-float inline-block">🌍</div>
              <p className="text-xl md:text-2xl mb-3 font-semibold">Search for weather information</p>
              <p className="text-base text-gray-400">Enter a city name above to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-white/90 text-sm font-medium animate-fadeIn">
          <div className="glass rounded-xl px-6 py-4 inline-block backdrop-blur-md">
            <p>Built with Next.js, React, TypeScript & Tailwind CSS</p>
            <p className="mt-1">Deployed on Netlify • Powered by OpenWeatherMap API</p>
          </div>
        </div>
      </div>
    </div>
  )
}
