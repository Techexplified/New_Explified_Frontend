import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router";

const sampleOrders = [
  {
    client: "John Doe",
    item: "Brake Pads",
    partNumber: "BP-12345",
    mrp: 123,
    quantity: 5,
  },
  {
    client: "Acme Corp",
    item: "Air Filter",
    partNumber: "AF-98765",
    mrp: 1350,
    quantity: 10,
  },
  {
    client: "Speedy Motors",
    item: "Oil Filter",
    partNumber: "OF-24680",
    mrp: 2500,
    quantity: 3,
  },
  {
    client: "FastTrack Ltd",
    item: "Spark Plug",
    partNumber: "SP-13579",
    mrp: 780,
    quantity: 8,
  },
];

const PurchaseOrdersComp = () => {
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 p-4 flex items-center border-b border-gray-700 bg-gray-800 backdrop-blur-sm ">
        <Link
          to="/admin"
          className="text-gray-300 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-md border border-transparent hover:border-[#23b5b5] bg-gray-900 hover:bg-[#23b5b5]/20"
          aria-label="Go back"
        >
          <FiArrowLeft size={24} />
          Back
        </Link>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-3xl font-semibold tracking-wide select-none">
          Purchase Orders
        </h1>
      </div>

      {/* Orders list */}
      <main className="flex flex-1 flex-col items-center justify-start px-6 py-8 gap-8 overflow-auto max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-8 w-full">
          {sampleOrders.map((order, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-tr from-[#1f2937] via-[#111827] to-[#273449] rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-[#23b5b5] transition transform hover:scale-[1.03] cursor-pointer flex flex-col justify-between min-h-[170px]"
              style={{ boxShadow: "0 8px 20px rgba(35, 181, 181, 0.3)" }}
            >
              <div>
                <h3 className="text-2xl font-semibold mb-3 truncate">
                  <span className="text-[#23b5b5]">Client:</span>{" "}
                  <span className="text-white">{order.client}</span>
                </h3>

                <div className="space-y-1 text-gray-300 text-sm">
                  <p>
                    <span className="font-semibold text-gray-400">
                      Item Name:
                    </span>{" "}
                    {order.item}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-400">
                      Part Number:
                    </span>{" "}
                    {order.partNumber}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end items-center gap-8 text-white font-semibold text-lg relative">
                <div className="flex items-center gap-1 text-gray-400 text-base">
                  <span className="font-semibold">Qty:</span> {order.quantity}
                </div>

                <div className="flex items-center gap-1 text-[#0f766e] bg-[#22c55e]/20 px-4 py-2 rounded-full font-bold text-xl shadow-md select-none">
                  <span className="text-green-500 text-lg">₹</span>{" "}
                  {order.mrp.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrdersComp;
