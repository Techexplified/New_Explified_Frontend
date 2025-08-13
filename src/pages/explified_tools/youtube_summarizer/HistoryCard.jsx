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
        <img src={item.thumbnail} alt="title" />
      </div>
      <div>
        <p className="text-xl mb-2">{item?.title}</p>
        <div className="flex gap-2 items-center">
          <div className="h-8 w-8 rounded-full">
            <img
              src={item.profile}
              alt="profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <div>{item?.channelTitle}</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
