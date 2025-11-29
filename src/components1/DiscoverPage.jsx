import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Cloud, Loader } from "lucide-react";
import MarketOutlook from "./MarketOutlook";

const DiscoverPage = () => {
  const [selectedInterest, setSelectedInterest] = useState("tech"); // ✅ single topic
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [newsData, setNewsData] = useState({
    featured: null,
    articles: [],
    loading: true,
    error: null,
  });
  const [weatherData, setWeatherData] = useState(null);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

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

  // ✅ Toggle single interest
  const toggleInterest = (interest) => {
    setSelectedInterest((prev) => (prev === interest ? null : interest));
  };

  // ✅ Fetch news based on selectedInterest
  const fetchNews = async () => {
    try {
      setNewsData((prev) => ({ ...prev, loading: true, error: null }));

      // Use selected interest or fallback
      const topic = selectedInterest || "world";

      const response = await fetch(
        `https://newsdata.io/api/1/latest?apikey=${
          import.meta.env.VITE_NEWS_API_KEY_SARITA
        }&q=${encodeURIComponent(topic)}&language=en`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const articles = data.results;

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
            category: topic,
            url: a.source_url,
            publishedTime: new Date(a.pubDate).toLocaleString(),
          })),
          loading: false,
          error: null,
        });
      } else {
        setNewsData({
          featured: null,
          articles: [],
          loading: false,
          error: "No articles found for this topic.",
        });
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setNewsData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to fetch news.",
      }));
    }
  };

  // ✅ Fetch Weather (unchanged)
  const fetchWeather = async () => {
    try {
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

  // ✅ Fetch on mount and whenever selectedInterest changes
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchNews();
      fetchWeather();
    } else {
      fetchNews();
    }
  }, [selectedInterest]);

  const handleArticleClick = (article) => {
    if (article) {
      const slug = encodeURIComponent(
        article.title.replace(/\s+/g, "-").toLowerCase()
      );
      navigate(`/expli/discover/${slug}`, {
        state: { article: { title: article.title, url: article.url } },
      });
    }
  };

  // --- UI Section
  return (
    <div className="w-full flex-1 overflow-scroll border border-cyan-500/20 bg-black flex flex-col gap-4 relative backdrop-blur-xl">
      <div className="flex">
        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {newsData.loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin text-[#23b5b5]" size={32} />
              <span className="ml-3 text-gray-400">
                Loading {selectedInterest || "world"} news...
              </span>
            </div>
          )}

          {newsData.error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-8">
              <p className="text-red-400">{newsData.error}</p>
            </div>
          )}

          {!newsData.loading && newsData.featured && (
            <div
              className="bg-[#121212] rounded-2xl cursor-pointer p-6 mb-8 flex"
              onClick={() => handleArticleClick(newsData.featured)}
            >
              <div className="flex-1 pr-6">
                <h2 className="text-4xl font-bold text-[#23b5b5] mb-4 leading-tight">
                  {newsData.featured.title}
                </h2>
                <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                  {newsData.featured.summary}
                </p>
              </div>
              {newsData.featured.image && (
                <img
                  src={newsData.featured.image}
                  alt="Featured"
                  className="w-96 h-64 object-cover rounded-lg"
                />
              )}
            </div>
          )}

          {!newsData.loading && newsData.articles.length > 0 && (
            <div className="grid grid-cols-3 gap-6">
              {newsData.articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article)}
                  className="bg-[#121212] rounded-xl overflow-hidden hover:bg-[#1a1a1a] transition-colors cursor-pointer"
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
                    <span className="text-gray-400 text-sm">
                      {article.sources} sources
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-80 p-6 border-l border-[#23b5b5]/30">
          {/* INTERESTS CARD */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-6 relative">
            <h3 className="font-bold text-lg mb-2">Choose Your Interest</h3>
            <p className="text-sm text-gray-400 mb-4">
              Select one topic to customize your Discover experience
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.slice(0, 8).map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    selectedInterest === interest
                      ? "bg-[#23b5b5] text-black border-[#23b5b5]"
                      : "bg-transparent text-white border-[#23b5b5]/50 hover:bg-[#23b5b5]/20"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* WEATHER CARD */}
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
            </div>
          )}

          {/* MARKET OUTLOOK */}
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
