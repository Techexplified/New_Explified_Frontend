const Trending = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Trending</h2>
        <button className="bg-[#23b5b5] text-white px-4 py-2 rounded-md">
          AI Assistance
        </button>
      </div>
      <div>
        <img
          src="/images/aitiger.jpg"
          alt="image"
          className="h-[200px] w-[350px] object-contain"
        />
      </div>
      <h2 className="text-2xl font-semibold">Trending Shorts</h2>
      <div>
        <img
          src="/images/aitiger.jpg"
          alt="image"
          className="h-[200px] w-[350px] object-contain"
        />
      </div>
    </>
  );
};

export default Trending;
