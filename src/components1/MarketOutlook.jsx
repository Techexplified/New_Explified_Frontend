import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function MarketOutlook() {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState([]);

  // Load data on component mount
  useEffect(() => {
    fetchMarketData();

    const interval = setInterval(() => {
      fetchMarketData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const cryptoResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
      );
      const cryptoData = await cryptoResponse.json();

      const marketInfo = [
        {
          name: "S&P 500",
          symbol: "SPX",
          price: "5,850.25",
          change: "+0.45%",
          changeValue: "+25.8",
          isPositive: true,
        },
        {
          name: "NASDAQ",
          symbol: "IXIC",
          price: "18,574.25",
          change: "+0.32%",
          changeValue: "+58.7",
          isPositive: true,
        },
      ];

      if (cryptoData.bitcoin) {
        marketInfo.push({
          name: "Bitcoin",
          symbol: "BTC",
          price: `${cryptoData.bitcoin.usd.toLocaleString()}`,
          change: `${
            cryptoData.bitcoin.usd_24h_change > 0 ? "+" : ""
          }${cryptoData.bitcoin.usd_24h_change.toFixed(2)}%`,
          changeValue: `${cryptoData.bitcoin.usd_24h_change > 0 ? "+" : ""}${(
            (cryptoData.bitcoin.usd * cryptoData.bitcoin.usd_24h_change) /
            100
          ).toFixed(0)}`,
          isPositive: cryptoData.bitcoin.usd_24h_change > 0,
        });
      }

      if (cryptoData.ethereum) {
        marketInfo.push({
          name: "Ethereum",
          symbol: "ETH",
          price: `${cryptoData.ethereum.usd.toLocaleString()}`,
          change: `${
            cryptoData.ethereum.usd_24h_change > 0 ? "+" : ""
          }${cryptoData.ethereum.usd_24h_change.toFixed(2)}%`,
          changeValue: `${cryptoData.ethereum.usd_24h_change > 0 ? "+" : ""}${(
            (cryptoData.ethereum.usd * cryptoData.ethereum.usd_24h_change) /
            100
          ).toFixed(0)}`,
          isPositive: cryptoData.ethereum.usd_24h_change > 0,
        });
      }

      setMarketData(marketInfo);
    } catch (error) {
      console.error("Error fetching market data:", error);
      // fallback mock data
      setMarketData([
        {
          name: "S&P Future",
          symbol: "E$USD",
          price: "6,400.25",
          change: "+0.01%",
          changeValue: "+0.5",
          isPositive: true,
        },
        {
          name: "NASDAQ",
          symbol: "NQUSD",
          price: "23,641.25",
          change: "+0.02%",
          changeValue: "+1.75",
          isPositive: true,
        },
        {
          name: "Bitcoin",
          symbol: "BTCUSD",
          price: "96,789.45",
          change: "-0.13%",
          changeValue: "-$150.83",
          isPositive: false,
        },
        {
          name: "VIX",
          symbol: "^VIX",
          price: "18.42",
          change: "+0.12%",
          changeValue: "+0.02",
          isPositive: true,
        },
      ]);
    } finally {
      setLoading(false); // stop loading regardless of success or failure
    }
  };

  return (
    <div className="bg-[#121212] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Market Outlook</h3>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className={`text-xs ${
            loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-[#23b5b5] hover:text-[#1ca0a0]"
          }`}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Loader2 size={22} className="animate-spin mb-2 text-[#23b5b5]" />
          <p className="text-sm">Fetching latest market data...</p>
        </div>
      ) : (
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
                    item.isPositive ? "text-green-400" : "text-red-400"
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
      )}
    </div>
  );
}

export default MarketOutlook;
