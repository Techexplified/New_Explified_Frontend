import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MoreHorizontal, X, Cloud, TrendingUp, TrendingDown, Loader } from 'lucide-react';

const DiscoverPage = () => {
  const [selectedInterests, setSelectedInterests] = useState(['Tech & Science']);
  const [showInterestModal, setShowInterestModal] = useState(false);
  
  // State for API data
  const [newsData, setNewsData] = useState({
    featured: null,
    articles: [],
    loading: true,
    error: null
  });
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState([]);

  // API Configuration - Add your API keys here
  const API_KEYS = {
    // Get free API key from https://newsapi.org/
    news: '2bc51ce017dc42069fbe9574f32c0e75', 
    // Get free API key from https://openweathermap.org/api
    weather: 'YOUR_WEATHER_API_KEY',
    // No API key needed for Open-Meteo
    // Get free API key from https://www.alphavantage.co/
    finance: 'YOUR_ALPHA_VANTAGE_KEY'
  };

  // Fetch News Data
  const fetchNews = async () => {
  try {
    setNewsData(prev => ({ ...prev, loading: true }));

    // Helper to shuffle articles
    const shuffleArray = (array) => {
      return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };

    // Using NewsAPI
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=${API_KEYS.news}`
    );

    // Fallback logic
    if (!response.ok) {
      const fallbackResponse = await fetch(
        'https://api.thenewsapi.com/v1/news/top?api_token=demo&language=en&limit=10'
      );
      const fallbackData = await fallbackResponse.json();

      let articles = shuffleArray(fallbackData.data || []);

      setNewsData({
        featured: articles[0]
          ? {
              title: articles[0].title,
              publishedTime: new Date(articles[0].published_at).toLocaleString(),
              summary: articles[0].description || articles[0].snippet,
              sources: Math.floor(Math.random() * 50) + 10,
              url: articles[0].url,
              image:
                articles[0].image_url ||
                `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center`,
            }
          : null,
        articles: articles.slice(1, 4).map((article, index) => ({
          id: index + 1,
          title: article.title,
          sources: Math.floor(Math.random() * 50) + 10,
          image:
            article.image_url ||
            `https://images.unsplash.com/photo-${1472099645785 + index}?w=400&h=300&fit=crop&crop=center`,
          category: article.categories?.[0] || 'general',
          url: article.url,
        })),
        loading: false,
        error: null,
      });
      return;
    }

    const data = await response.json();
    let articles = shuffleArray(data.articles || []);

    setNewsData({
      featured: articles[0]
        ? {
            title: articles[0].title,
            publishedTime: new Date(articles[0].publishedAt).toLocaleString(),
            summary: articles[0].description,
            sources: Math.floor(Math.random() * 50) + 10,
            url: articles[0].url,
            image:
              articles[0].urlToImage ||
              `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&crop=center`,
          }
        : null,
      articles: articles.slice(1, 4).map((article, index) => ({
        id: index + 1,
        title: article.title,
        sources: Math.floor(Math.random() * 50) + 10,
        image:
          article.urlToImage ||
          `https://images.unsplash.com/photo-${1472099645785 + index}?w=400&h=300&fit=crop&crop=center`,
        category: 'tech',
        url: article.url,
      })),
      loading: false,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    setNewsData(prev => ({ ...prev, loading: false, error: error.message }));
  }
};


  // Fetch Weather Data
  const fetchWeather = async () => {
    try {
      // Using Open-Meteo (free, no API key required)
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto'
      );
      const data = await response.json();
      
      if (data.current_weather) {
        const getWeatherCondition = (code) => {
          if (code <= 3) return 'sunny';
          if (code <= 67) return 'rainy';
          return 'cloudy';
        };
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const forecast = data.daily.time.slice(0, 5).map((date, index) => ({
          day: days[new Date(date).getDay()],
          temp: `${Math.round(data.daily.temperature_2m_max[index])}°`,
          condition: getWeatherCondition(data.daily.weathercode[index])
        }));
        
        setWeatherData({
          current: `${Math.round(data.current_weather.temperature)}°C`,
          condition: getWeatherCondition(data.current_weather.weathercode),
          location: "Kolkata",
          forecast
        });
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback to mock data
      setWeatherData({
        current: "30°C",
        condition: "Mostly cloudy",
        location: "Kolkata",
        forecast: [
          { day: "Tue", temp: "36°", condition: "sunny" },
          { day: "Wed", temp: "33°", condition: "cloudy" },
          { day: "Thu", temp: "31°", condition: "rainy" },
          { day: "Fri", temp: "33°", condition: "cloudy" },
          { day: "Sat", temp: "33°", condition: "cloudy" }
        ]
      });
    }
  };

  // Fetch Market Data
  const fetchMarketData = async () => {
    try {
      // Fetch crypto data from CoinGecko (free)
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
      );
      const cryptoData = await cryptoResponse.json();
      
      const marketInfo = [
        {
          name: "S&P 500",
          symbol: "SPX",
          price: "5,850.25",
          change: "+0.45%",
          changeValue: "+25.8",
          isPositive: true
        },
        {
          name: "NASDAQ",
          symbol: "IXIC",
          price: "18,574.25",
          change: "+0.32%",
          changeValue: "+58.7",
          isPositive: true
        }
      ];
      
      if (cryptoData.bitcoin) {
        marketInfo.push({
          name: "Bitcoin",
          symbol: "BTC",
          price: `${cryptoData.bitcoin.usd.toLocaleString()}`,
          change: `${cryptoData.bitcoin.usd_24h_change > 0 ? '+' : ''}${cryptoData.bitcoin.usd_24h_change.toFixed(2)}%`,
          changeValue: `${cryptoData.bitcoin.usd_24h_change > 0 ? '+' : ''}${(cryptoData.bitcoin.usd * cryptoData.bitcoin.usd_24h_change / 100).toFixed(0)}`,
          isPositive: cryptoData.bitcoin.usd_24h_change > 0
        });
      }
      
      if (cryptoData.ethereum) {
        marketInfo.push({
          name: "Ethereum",
          symbol: "ETH",
          price: `${cryptoData.ethereum.usd.toLocaleString()}`,
          change: `${cryptoData.ethereum.usd_24h_change > 0 ? '+' : ''}${cryptoData.ethereum.usd_24h_change.toFixed(2)}%`,
          changeValue: `${cryptoData.ethereum.usd_24h_change > 0 ? '+' : ''}${(cryptoData.ethereum.usd * cryptoData.ethereum.usd_24h_change / 100).toFixed(0)}`,
          isPositive: cryptoData.ethereum.usd_24h_change > 0
        });
      }
      
      setMarketData(marketInfo);
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      setMarketData([
        {
          name: "S&P Future",
          symbol: "E$USD",
          price: "6,400.25",
          change: "+0.01%",
          changeValue: "+0.5",
          isPositive: true
        },
        {
          name: "NASDAQ",
          symbol: "NQUSD",
          price: "23,641.25",
          change: "+0.02%",
          changeValue: "+1.75",
          isPositive: true
        },
        {
          name: "Bitcoin",
          symbol: "BTCUSD",
          price: "96,789.45",
          change: "-0.13%",
          changeValue: "-$150.83",
          isPositive: false
        },
        {
          name: "VIX",
          symbol: "^VIX",
          price: "18.42",
          change: "+0.12%",
          changeValue: "+0.02",
          isPositive: true
        }
      ]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchNews();
    fetchWeather();
    fetchMarketData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
      fetchWeather();
      fetchMarketData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);


   const handleArticleClick = (url) => {
    if (url) {
      // Open in new tab to keep user on your site
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log('No URL available for this article');
    }
  };

  const interests = [
    'Tech & Science',
    'Finance',
    'Arts & Culture',
    'Sports',
    'Entertainment',
    'Politics',
    'Health',
    'Travel'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
  {/* Header */}
  <header className="flex items-center justify-between p-6 border-b border-[#23b5b5]/30">
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#23b5b5] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">D</span>
        </div>
        <h1 className="text-2xl font-bold">Discover</h1>
      </div>

      <nav className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 bg-black border border-[#23b5b5]/40 px-4 py-2 rounded-lg">
          <span className="text-[#23b5b5]">⚡</span>
          <span>For You</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-[#23b5b5]">
          <span>⭐</span>
          <span>Top</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-400 hover:text-[#23b5b5]">
          <span>📋</span>
          <span>Topics</span>
        </button>
      </nav>
    </div>
  </header>

  <div className="flex">
    {/* Main Content */}
    <main className="flex-1 p-6">
      {/* Loading State */}
      {newsData.loading && (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-[#23b5b5]" size={32} />
          <span className="ml-3 text-gray-400">Loading latest news...</span>
        </div>
      )}

      {/* Error State */}
      {newsData.error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-8">
          <p className="text-red-400">Error loading news: {newsData.error}</p>
          <button
            onClick={fetchNews}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Featured Article */}
      {newsData.featured && !newsData.loading && (
        <div className="bg-[#121212] rounded-2xl p-6 mb-8 flex" onClick={() => handleArticleClick(newsData.featured.url)}>
          <div className="flex-1 pr-6">
            <h2 className="text-4xl font-bold text-[#23b5b5] mb-4 leading-tight">
              {newsData.featured.title}
            </h2>
            <div className="flex items-center text-gray-400 text-sm mb-4">
              <span>📅 Published {newsData.featured.publishedTime}</span>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {newsData.featured.summary}
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-[#23b5b5] rounded-full border-2 border-black"></div>
                  <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-black"></div>
                  <div className="w-6 h-6 bg-gray-700 rounded-full border-2 border-black"></div>
                </div>
                <span className="text-gray-400 text-sm">{newsData.featured.sources} sources</span>
              </div>
              <button className="text-gray-400 hover:text-[#23b5b5]">
                <Heart size={20} />
              </button>
              <button className="text-gray-400 hover:text-[#23b5b5]">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>
          <div className="w-96">
            <img
              src={newsData.featured.image}
              alt="Featured article"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* News Grid */}
      {!newsData.loading && newsData.articles.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          {newsData.articles.map((article) => (
            <div
              key={article.id}
              className="bg-[#121212] rounded-xl overflow-hidden hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              onClick={() => handleArticleClick(article.url)}
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-3 leading-tight">
                  {article.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 bg-[#23b5b5] rounded-full border border-black"></div>
                      <div className="w-4 h-4 bg-gray-500 rounded-full border border-black"></div>
                    </div>
                    <span className="text-gray-400 text-sm">{article.sources} sources</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <button className="hover:text-[#23b5b5]">
                      <Heart size={16} />
                    </button>
                    <button className="hover:text-[#23b5b5]">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchNews}
          className="px-6 py-2 bg-[#23b5b5] hover:bg-[#1ca0a0] text-black rounded-lg text-sm font-medium"
          disabled={newsData.loading}
        >
          {newsData.loading ? 'Loading...' : 'Refresh News'}
        </button>
      </div>
    </main>

    {/* Right Sidebar */}
    <aside className="w-80 p-6 border-l border-[#23b5b5]/30">
      {/* Interests Card */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 relative">
        <button
          className="absolute top-2 right-2 text-white hover:text-[#23b5b5]"
          onClick={() => setShowInterestModal(false)}
        >
          <X size={20} />
        </button>
        <h3 className="font-bold text-lg mb-2">Make it yours</h3>
        <p className="text-sm text-gray-400 mb-4">
          Select topics and interests to customize your Discover experience
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.slice(0, 4).map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedInterests.includes(interest)
                  ? 'bg-[#23b5b5] text-black border-[#23b5b5]'
                  : 'bg-transparent text-white border-[#23b5b5]/50 hover:bg-[#23b5b5]/20'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-[#23b5b5] hover:bg-[#1ca0a0] text-black py-2 px-4 rounded-lg font-medium"
          onClick={() => setShowInterestModal(true)}
        >
          Save Interests
        </button>
      </div>

      {/* Weather Card */}
      {weatherData && (
        <div className="bg-[#121212] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold">{weatherData.current}</div>
              <div className="text-gray-400 text-sm">{weatherData.condition}</div>
              <div className="text-gray-400 text-sm">{weatherData.location}</div>
            </div>
            <Cloud size={32} className="text-gray-400" />
          </div>
          <div className="flex justify-between">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                <div className="text-sm font-medium">{day.temp}</div>
                <div className="text-xs mt-1">
                  {day.condition === 'sunny' && '☀️'}
                  {day.condition === 'cloudy' && '☁️'}
                  {day.condition === 'rainy' && '🌧️'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Outlook */}
      <div className="bg-[#121212] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Market Outlook</h3>
          <button
            onClick={fetchMarketData}
            className="text-xs text-[#23b5b5] hover:text-[#1ca0a0]"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-4">
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-gray-400">{item.symbol}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.price}</div>
                <div
                  className={`text-xs flex items-center ${
                    item.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {item.isPositive ? (
                    <TrendingUp size={12} className="mr-1" />
                  ) : (
                    <TrendingDown size={12} className="mr-1" />
                  )}
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  </div>

  {/* Interest Modal */}
  {showInterestModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121212] rounded-xl p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Select Your Interests</h3>
          <button
            onClick={() => setShowInterestModal(false)}
            className="text-gray-400 hover:text-[#23b5b5]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                selectedInterests.includes(interest)
                  ? 'bg-[#23b5b5] text-black border-[#23b5b5]'
                  : 'bg-transparent text-gray-300 border-gray-600 hover:bg-[#23b5b5]/20'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-[#23b5b5] hover:bg-[#1ca0a0] text-black py-2 px-4 rounded-lg font-medium"
          onClick={() => setShowInterestModal(false)}
        >
          Save Interests
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default DiscoverPage;