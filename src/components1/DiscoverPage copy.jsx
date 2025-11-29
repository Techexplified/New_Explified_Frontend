import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Cloud, Loader } from "lucide-react";

import MarketOutlook from "./MarketOutlook";

const DiscoverPage = () => {
  const [selectedInterests, setSelectedInterests] = useState(["example"]);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const navigate = useNavigate();

  // State for API data
  const [newsData, setNewsData] = useState({
    featured: null,
    articles: [],
    loading: true,
    error: null,
  });
  const [weatherData, setWeatherData] = useState(null);
  const fetchedRef = useRef(false);
  // API Configuration - Add your API keys here
  const API_KEYS = {
    // Get free API key from https://newsapi.org/
    news: "2bc51ce017dc42069fbe9574f32c0e75",
    // Get free API key from https://openweathermap.org/api
    weather: "YOUR_WEATHER_API_KEY",
    // No API key needed for Open-Meteo
    // Get free API key from https://www.alphavantage.co/
    finance: "YOUR_ALPHA_VANTAGE_KEY",
  };

  const NEWS_API_KEY = "2bc51ce017dc42069fbe9574f32c0e75";

  // Fetch News Data
  const fetchNews = async () => {
    try {
      setNewsData((prev) => ({ ...prev, loading: true }));
      const response = await fetch(
        ` https://newsdata.io/api/1/latest?apikey=${
          import.meta.env.VITE_NEWS_API_KEY_SARITA
        }&q=sports&language=en`
      );
      const data = await response.json();

      console.log(data);

      if (data.results && data.results.length > 0) {
        let articles = data.results;
        setNewsData({
          featured: {
            title: articles[0].title,
            publishedTime: new Date(articles[0].pubDate).toLocaleString(),
            summary: articles[0].description,
            url: articles[0].source_url,
            image: articles[0].image_url,
            sources: Math.floor(Math.random() * 50) + 10,
          },
          articles: articles.map((a, i) => ({
            id: i + 1,
            title: a.title,
            sources: Math.floor(Math.random() * 50) + 10,
            image: a.image_url,
            category: "tech",
            url: a.source_url,
            // content: a.content,
            publishedTime: new Date(a.pubDate).toLocaleString(),
          })),
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      // setNewsData((prev) => ({
      //   ...prev,
      //   loading: false,
      //   error: err.message,
      // }));
      console.log(err);
    }
  };

  // Fetch Weather Data
  const fetchWeather = async () => {
    try {
      // Using Open-Meteo (free, no API key required)
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
      );
      const data = await response.json();

      if (data.current_weather) {
        const getWeatherCondition = (code) => {
          if (code <= 3) return "sunny";
          if (code <= 67) return "rainy";
          return "cloudy";
        };

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const forecast = data.daily.time.slice(0, 5).map((date, index) => ({
          day: days[new Date(date).getDay()],
          temp: `${Math.round(data.daily.temperature_2m_max[index])}°`,
          condition: getWeatherCondition(data.daily.weathercode[index]),
        }));

        setWeatherData({
          current: `${Math.round(data.current_weather.temperature)}°C`,
          condition: getWeatherCondition(data.current_weather.weathercode),
          location: "Kolkata",
          forecast,
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
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
          { day: "Sat", temp: "33°", condition: "cloudy" },
        ],
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchNews();
    fetchWeather();

    const interval = setInterval(() => {
      fetchNews();
      fetchWeather();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleArticleClick = (article) => {
    if (article) {
      const slug = encodeURIComponent(
        article.title.replace(/\s+/g, "-").toLowerCase()
      );
      navigate(`/expli/discover/${slug}`, {
        state: { article: { title: article.title, url: article.url } },
      });
    } else {
      console.log("No article data available");
    }
  };

  const interests = [
    "business",
    "science",
    "tech",
    "finance",
    "arts",
    "sports",
    "entertainment",
    "politics",
    "health",
    "travel",
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest));
    } else {
      setSelectedInterests((prev) => [...prev, interest]);
    }
  };

  return (
    <div className="w-full flex-1 overflow-scroll border border-cyan-500/20 shadow-[...] bg-black flex flex-col gap-4 relative backdrop-blur-xl">
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
              <p className="text-red-400">
                Error loading news: {newsData.error}
              </p>
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
            <div
              className="bg-[#121212] rounded-2xl cursor-pointer p-6 mb-8 flex"
              onClick={() => handleArticleClick(newsData.featured)}
            >
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
                    <span className="text-gray-400 text-sm">
                      {newsData.featured.sources} sources
                    </span>
                  </div>
                  {/* <button className="text-gray-400 hover:text-[#23b5b5]">
                    <Heart size={20} />
                  </button> */}
                  {/* <button className="text-gray-400 hover:text-[#23b5b5]">
                    <MoreHorizontal size={20} />
                  </button> */}
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
                  onClick={() => handleArticleClick(article)}
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
                        <span className="text-gray-400 text-sm">
                          {article.sources} sources
                        </span>
                      </div>
                      {/* <div className="flex items-center space-x-2 text-gray-400">
                        <button className="hover:text-[#23b5b5]">
                          <Heart size={16} />
                        </button>
                        <button className="hover:text-[#23b5b5]">
                          <MoreHorizontal size={16} />
                        </button>
                      </div> */}
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
              {newsData.loading ? "Loading..." : "Refresh News"}
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
                      ? "bg-[#23b5b5] text-black border-[#23b5b5]"
                      : "bg-transparent text-white border-[#23b5b5]/50 hover:bg-[#23b5b5]/20"
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
                  <div className="text-2xl font-bold">
                    {weatherData.current}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {weatherData.condition}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {weatherData.location}
                  </div>
                </div>
                <Cloud size={32} className="text-gray-400" />
              </div>
              <div className="flex justify-between">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                    <div className="text-sm font-medium">{day.temp}</div>
                    <div className="text-xs mt-1">
                      {day.condition === "sunny" && "☀️"}
                      {day.condition === "cloudy" && "☁️"}
                      {day.condition === "rainy" && "🌧️"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Outlook */}
          <MarketOutlook />
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
                      ? "bg-[#23b5b5] text-black border-[#23b5b5]"
                      : "bg-transparent text-gray-300 border-gray-600 hover:bg-[#23b5b5]/20"
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
