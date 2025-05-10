const Tabs = () => {
  return (
    <div className="flex gap-4 ">
      <button className="bg-[#23b5b5] text-white px-6 py-1 rounded">
        Create
      </button>
      <button className="bg-white text-black px-6 py-1 rounded">Publish</button>
      <button className="bg-white text-black px-6 py-1 rounded">Grow</button>
    </div>
  );
};

export default Tabs;
