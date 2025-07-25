import { FiPlus, FiMic, FiSliders } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";

function Trone() {
  return (
    <div className=" bg-black h-full text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
        Ready when you are.
      </h1>

      {/* Input + Icons Container */}
      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-2xl shadow-md px-4 py-2">
        {/* Input Field */}
        <input
          type="text"
          placeholder="Ask anything"
          className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
        />

        {/* Icons Row */}
        <div className="flex items-center justify-between mt-2 text-gray-400">
          {/* Left Icons */}
          <div className="flex items-center gap-2">
            <FiPlus className="text-lg" />
            <FiSliders className="text-lg" />
            <span className="text-sm">Tools</span>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <FiMic className="text-lg" />
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
              <BsSoundwave className="text-base" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trone;
