function TranscriptCard({ item }) {
  const formatTimestamp = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };
  return (
    <div className="flex items-start group relative">
      <div className="flex-shrink-0 w-16 text-white font-mono text-sm relative z-10">
        {formatTimestamp(item.timestamp)}
      </div>

      <div className="absolute left-16 top-2 w-4 h-[1px] bg-white  transform -translate-x-1/2 z-10"></div>

      <div className="flex-1 ml-4 relative">
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-6 hover:bg-gray-800 transition-colors cursor-pointer">
          <p className="text-gray-300 leading-relaxed">
            {item.text
              .replaceAll("&amp;#39;", "'")
              .replaceAll("&amp;quot;", "'")
              .replaceAll("&#39;", "'")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TranscriptCard;
