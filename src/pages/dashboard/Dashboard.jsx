const Dashboard = () => {
  return (
    <>
      <h2>Dashboard</h2>
      <div className="text-center my-12">
        <h1 className="text-3xl font-bold mb-2">What are you looking for ?</h1>
        <p>Some Tagline or Description</p>
      </div>
      <div className="space-y-4 ">
        <h1>Suggested Tool</h1>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <button
              key={i}
              className="bg-gray-800 p-3 rounded text-center text-sm"
            >
              Any Tool Name/Topic Suggestions
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Write your prompt here..."
          className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
        />
      </div>
    </>
  );
};

export default Dashboard;
