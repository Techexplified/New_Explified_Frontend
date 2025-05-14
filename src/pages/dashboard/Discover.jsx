import { Link } from "react-router-dom";
const cards = [
  {
    title: "Personalized Recommendations",
    description: "Smart picks, just for you.",
    link: "/dashboard/trending",
  },
  {
    title: "Trending",
    description: "What everyone’s talking about.",
    link: "/dashboard/trending",
  },
  {
    title: "Competitors",
    description: "Stay ahead of the game.",
    link: "/dashboard/trending",
  },
  {
    title: "Subscribers",
    description: "Know your audience, grow your impact.",
    link: "/dashboard/trending",
  },
  {
    title: "Learn",
    description: "Grow smarter, create better.",
    link: "/dashboard/trending",
  },
  {
    title: "New or Featured Content",
    description: "",
    link: "/dashboard/trending",
  },
];
const Discover = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Discover</h2>
        <button className="bg-[#23b5b5] text-white px-4 py-2 rounded-md">
          AI Assistance
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link to={`${card.link}`} key={index}>
            <div className="bg-[#23b5b5] rounded-lg p-4 text-center h-full text-white">
              <h3 className="font-bold">{card.title}</h3>
              <p className="text-sm mt-1 italic">"{card.description}"</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Discover;
