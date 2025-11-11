import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const NewsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // article passed from DiscoverPage
  const [article, setArticle] = useState(location.state?.article || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const NEWS_API_KEY = "2bc51ce017dc42069fbe9574f32c0e75";

  useEffect(() => {
    const fetchFullArticle = async () => {
      if (!article?.url) return;
      setLoading(true);
      setError(null);

      try {
        const url = article?.url;

        const options = {
          method: "GET",
          url: "https://article-extractor-and-summarizer.p.rapidapi.com/extract",
          params: {
            url: url,
          },
          headers: {
            "x-rapidapi-key":
              "5c43358bb7msh620384fe8a16560p1a0fd1jsn853ee75f7459",
            "x-rapidapi-host":
              "article-extractor-and-summarizer.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);

        //   console.log(response);

        if (response?.data) {
          const fullArticle = response.data;
          setArticle((prev) => ({ ...prev, ...fullArticle }));
        } else {
          setError("No detailed content found for this article.");
        }
      } catch (err) {
        console.error("Error fetching article details:", err);
        setError("Failed to fetch article content.");
      } finally {
        setLoading(false);
      }
    };

    fetchFullArticle();
  }, [article?.url]);
  // useEffect(() => {
  //   const fetchFullArticle = async () => {
  //     if (!article?.title) return;
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const cleanTitle = article.title
  //         ?.replace(/[-–|:]/g, "")
  //         ?.split(" ")
  //         ?.slice(0, 6)
  //         ?.join(" ");

  //       const response = await axios.get("https://newsapi.org/v2/everything", {
  //         params: {
  //           q: cleanTitle || "latest news",
  //           apiKey: NEWS_API_KEY,
  //           language: "en",
  //           sortBy: "relevancy",
  //           pageSize: 1,
  //         },
  //       });

  //       if (response.data.articles.length > 0) {
  //         const fullArticle = response.data.articles[0];
  //         setArticle((prev) => ({ ...prev, ...fullArticle }));
  //       } else {
  //         setError("No detailed content found for this article.");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching article details:", err);
  //       setError("Failed to fetch article content.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFullArticle();
  // }, [article?.title]);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4">No article data found.</h2>
        <button
          onClick={() => navigate("/discover")}
          className="px-4 py-2 bg-[#23b5b5] rounded-lg text-black font-semibold hover:bg-[#1ca0a0] transition-colors"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white overflow-scroll">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#23b5b5] hover:text-[#1ca0a0] font-medium transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta Info */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
          <time className="text-gray-400">
            {article.publishedAt || article.publishedTime || "N/A"}
          </time>
          {article.source?.name && (
            <span className="px-3 py-1 bg-slate-800 rounded-full text-slate-300 font-medium text-xs">
              {article.source.name}
            </span>
          )}
          {article.author && (
            <span className="text-gray-400">
              By{" "}
              <span className="text-[#23b5b5] font-semibold">
                {article.author}
              </span>
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight text-white">
          {article.title}
        </h1>

        {/* Featured Image */}
        {(article.urlToImage || article.image) && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <img
              src={article.urlToImage || article.image}
              alt={article.title}
              className="w-full h-96 lg:h-[450px] object-cover"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-gray-400 italic py-8">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-[#23b5b5] rounded-full animate-pulse"></div>
              Fetching full article...
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 mb-6 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-6">
            {article.description && (
              <p className="text-lg text-gray-300 font-semibold leading-relaxed border-l-4 border-[#23b5b5] pl-4 py-2">
                {article.description}
              </p>
            )}
            {/* <p className="text-base lg:text-lg text-gray-300 leading-relaxed">
              {article.content || "No additional content available."}
            </p> */}
            <div
              className="text-base lg:text-lg text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content || "No additional content available.",
              }}
            />
          </div>
        )}

        {/* Source Link */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center gap-3">
          <span className="text-gray-400 text-sm">Source:</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#23b5b5] hover:text-[#1ca0a0] hover:underline font-medium transition-colors"
          >
            Read original on {article.source?.name || "External site"}
          </a>
        </div>
      </article>
    </div>
  );
};

export default NewsPage;
