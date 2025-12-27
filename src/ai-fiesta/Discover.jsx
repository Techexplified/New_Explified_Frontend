import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Heart,
  MoreHorizontal,
  X,
  Cloud,
  TrendingUp,
  TrendingDown,
  Loader,
} from "lucide-react";

const DiscoverPage = () => {
  const [selectedInterests, setSelectedInterests] = useState(["Tech & Science"]);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [newsData, setNewsData] = useState({
    featured: null,
    articles: [],
    loading: true,
    error: null,
  });
  const [weatherData, setWeatherData] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  // Fetch News
  const fetchNews = async () => {
    try {
      setNewsData((p) => ({ ...p, loading: true }));
      const res = await fetch(
        `https://newsdata.io/api/1/latest?apikey=pub_cf11ba2bd3eb49968e18868a5b7aeee2&language=en`
      );
      const data = await res.json();
      if (data.results?.length) {
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
            url: a.source_url,
            publishedTime: new Date(a.pubDate).toLocaleString(),
          })),
          loading: false,
          error: null,
        });
      }
    } catch (e) {
      console.error(e);
      setNewsData((p) => ({ ...p, loading: false, error: e.message }));
    }
  };

  // Fetch Weather
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=22.57&longitude=88.36&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
      );
      const data = await res.json();
      const getWeatherCondition = (code) => {
        if (code <= 3) return "sunny";
        if (code <= 67) return "rainy";
        return "cloudy";
      };
      if (data.current_weather) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const forecast = data.daily.time.slice(0, 5).map((d, i) => ({
          day: days[new Date(d).getDay()],
          temp: `${Math.round(data.daily.temperature_2m_max[i])}°`,
          condition: getWeatherCondition(data.daily.weathercode[i]),
        }));
        setWeatherData({
          current: `${Math.round(data.current_weather.temperature)}°C`,
          condition: getWeatherCondition(data.current_weather.weathercode),
          location: "Kolkata",
          forecast,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch Market Data
  const fetchMarketData = async () => {
    try {
      const cryptoRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
      );
      const data = await cryptoRes.json();
      const marketInfo = [
        {
          name: "S&P 500",
          symbol: "SPX",
          price: "5,850.25",
          change: "+0.45%",
          isPositive: true,
        },
      ];
      if (data.bitcoin) {
        marketInfo.push({
          name: "Bitcoin",
          symbol: "BTC",
          price: `$${data.bitcoin.usd.toLocaleString()}`,
          change: `${data.bitcoin.usd_24h_change.toFixed(2)}%`,
          isPositive: data.bitcoin.usd_24h_change > 0,
        });
      }
      if (data.ethereum) {
        marketInfo.push({
          name: "Ethereum",
          symbol: "ETH",
          price: `$${data.ethereum.usd.toLocaleString()}`,
          change: `${data.ethereum.usd_24h_change.toFixed(2)}%`,
          isPositive: data.ethereum.usd_24h_change > 0,
        });
      }
      setMarketData(marketInfo);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchNews();
    fetchWeather();
    fetchMarketData();
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const interests = [
    "Tech & Science",
    "Finance",
    "Arts & Culture",
    "Sports",
    "Entertainment",
    "Politics",
    "Health",
    "Travel",
  ];

  const handleArticleClick = (article) => {
    if (!article) return;
    const slug = encodeURIComponent(article.title.replace(/\s+/g, "-").toLowerCase());
    navigate(`/expli/discover/${slug}`, {
      state: { article: { title: article.title, url: article.url } },
    });
  };

  return (
    <div className="flex w-full h-full bg-[#0B0B0B] text-white">
      {/* Scrollable Main Section */}
      <main className="flex-1 overflow-y-auto h-full p-6 pr-3">
        {newsData.loading && (
          <div className="flex justify-center items-center py-16 text-gray-400">
            <Loader className="animate-spin text-[#23b5b5] mr-3" /> Loading latest news...
          </div>
        )}

        {/* Featured Article */}
        {newsData.featured && !newsData.loading && (
          <div
            onClick={() => handleArticleClick(newsData.featured)}
            className="bg-[#121212] rounded-2xl p-6 mb-8 flex flex-col md:flex-row cursor-pointer hover:bg-[#161616] transition"
          >
            <div className="flex-1 pr-0 md:pr-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#23b5b5] mb-4 leading-tight">
                {newsData.featured.title}
              </h2>
              <p className="text-gray-400 text-sm mb-3">
                📅 {newsData.featured.publishedTime}
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                {newsData.featured.summary}
              </p>
            </div>
            {newsData.featured.image && (
              <img
                src={newsData.featured.image}
                alt=""
                className="w-full md:w-80 h-48 md:h-64 rounded-xl object-cover"
              />
            )}
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsData.articles.map((a) => (
            <div
              key={a.id}
              onClick={() => handleArticleClick(a)}
              className="bg-[#121212] rounded-xl overflow-hidden hover:bg-[#1A1A1A] transition cursor-pointer"
            >
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-gray-400">{a.publishedTime}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={fetchNews}
            className="px-6 py-2 bg-[#23b5b5] hover:bg-[#1fa3a3] text-black rounded-lg font-semibold"
          >
            Refresh News
          </button>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 border-l border-[#1E1E1E] p-6 overflow-y-auto h-full hidden lg:block">
        {/* Weather Card */}
        {weatherData && (
          <div className="bg-[#121212] rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-2xl font-bold">{weatherData.current}</div>
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
              {weatherData.forecast.map((d, i) => (
                <div key={i} className="text-center text-sm">
                  <div className="text-gray-400">{d.day}</div>
                  <div>{d.temp}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Data */}
        <div className="bg-[#121212] rounded-xl p-4">
          <h3 className="font-semibold mb-4">Market Outlook</h3>
          {marketData.map((m, i) => (
            <div key={i} className="flex justify-between items-center mb-3">
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-gray-400">{m.symbol}</p>
              </div>
              <div className={`text-sm ${m.isPositive ? "text-green-400" : "text-red-400"}`}>
                {m.change}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default DiscoverPage;
