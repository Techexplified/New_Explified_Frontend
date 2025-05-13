import { Link } from "react-router-dom";

const Tabs = () => {
  return (
    <div className="flex gap-4 ">
      <Link to="/">
        <button className="bg-[#23b5b5] text-white px-6 py-1 rounded">
          Create
        </button>
      </Link>
      <Link to="/publish">
        <button className="bg-white text-black px-6 py-1 rounded">
          Publish
        </button>
      </Link>

      <Link to="/grow">
        <button className="bg-white text-black px-6 py-1 rounded">Grow</button>
      </Link>
    </div>
  );
};

export default Tabs;
