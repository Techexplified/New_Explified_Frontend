import { FiArrowLeft, FiBox, FiClipboard } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { Link } from "react-router";

const AcmecorpAdmin = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Top bar with back button */}
      <div className="p-4 flex items-center b">
        <Link
          to="/"
          className="text-gray-300 border-gray-400 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[#23b5b5] bg-gray-900 hover:bg-[#23b5b5]/20"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} />
          Back
        </Link>
      </div>

      {/* Centered buttons */}
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
        <Link
          to="/flowsense/explified/admin/training"
          className="w-96 h-36 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-3xl font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-4"
        >
          <LuBrain size={32} />
          Training
        </Link>
        <Link
          to="/flowsense/acmecorp/admin/inventory"
          className="w-96 h-36 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-3xl font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-4"
        >
          <FiBox size={32} />
          Inventory
        </Link>

        <Link
          to="/flowsense/acmecorp/admin/purchaseOrder"
          className="w-96 h-36 bg-[#23b5b5] hover:bg-[#1a8a8a] text-white text-3xl font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-4"
        >
          <FiClipboard size={32} />
          Purchase Orders
        </Link>
      </div>
    </div>
  );
};

export default AcmecorpAdmin;
