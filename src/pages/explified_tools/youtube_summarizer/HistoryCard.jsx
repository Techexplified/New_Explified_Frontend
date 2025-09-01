function HistoryCard({ item, setVideoId, setVideoUrl }) {
  return (
    <div
      className="flex items-center gap-6  max-w-3xl mx-auto"
      onClick={() => {
        setVideoId(item.videoId);
        setVideoUrl(`https://www.youtube.com/watch?v=${item.videoId}`);
      }}
    >
      <div>
        {item.thumbnail ? (
          <img src={item.thumbnail} alt="title" />
        ) : (
          <div className="w-32 h-24 bg-gray-800 rounded flex items-center justify-center">
            <span className="text-gray-400 text-sm">No thumbnail</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xl mb-2">{item?.title}</p>
        <div className="flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full">
            {item.profile ? (
              <img
                src={item.profile}
                alt="profile"
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <div className="h-full w-full bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">?</span>
              </div>
            )}
          </div>
          <div>{item?.channelTitle}</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
