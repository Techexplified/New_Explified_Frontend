function SummaryCard({ item }) {
  return (
    <div className="bg-[#1f1f1f] text-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-400 mb-2">Time: {item.timeRange}</p>
      <p className="text-base whitespace-pre-line">{item.summary}</p>
    </div>
  );
}

export default SummaryCard;
