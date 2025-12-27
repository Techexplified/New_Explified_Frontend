import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router";

const PurchaseOrdersComp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl = "https://explified-app.web.app/api/sales/get/contact/details";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const orders = data.data || [];

        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        const toMillis = (createdAt) =>
          createdAt._seconds * 1000 + Math.floor(createdAt._nanoseconds / 1e6);

        const isToday = (createdAt) => {
          const date = new Date(toMillis(createdAt))
            .toISOString()
            .split("T")[0];
          return date === todayStr;
        };

        const todayOrders = orders
          .filter((order) => isToday(order.createdAt))
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        const otherOrders = orders
          .filter((order) => !isToday(order.createdAt))
          .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));

        const markedToday = todayOrders.map((order) => ({
          ...order,
          isToday: true,
        }));
        const markedOthers = otherOrders.map((order) => ({
          ...order,
          isToday: false,
        }));

        setOrders([...markedToday, ...markedOthers]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load purchase orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 p-4 flex items-center border-b border-gray-700 bg-gray-800 backdrop-blur-sm">
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

      {/* Content */}
      <main className="flex flex-1 flex-col items-center justify-start px-6 py-8 gap-8 overflow-auto max-w-4xl mx-auto w-full">
        {loading && <p className="text-gray-400 text-lg">Loading orders...</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-400 text-lg">No purchase orders found.</p>
        )}
        <div className="flex flex-col gap-8 w-full">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gradient-to-tr from-[#1f2937] via-[#111827] to-[#273449] rounded-2xl p-6 shadow-2xl border border-gray-700 hover:border-[#23b5b5] transition transform hover:scale-[1.03] cursor-pointer flex flex-col justify-between min-h-[170px]"
              style={{ boxShadow: "0 8px 20px rgba(35, 181, 181, 0.3)" }}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-semibold mb-3 truncate">
                  <span className="text-[#23b5b5]">Client:</span>{" "}
                  <span className="text-white">{order.name || "N/A"}</span>
                </h3>

                {order.isToday && (
                  <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full shadow-md">
                    Today
                  </span>
                )}
              </div>

              <div className="space-y-1 text-gray-300 text-sm">
                <p>
                  <span className="font-semibold text-gray-400">Email:</span>{" "}
                  {order.emailId}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">Phone:</span>{" "}
                  {order.phoneNumber || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">
                    Preferred Contact Time:
                  </span>{" "}
                  {order.preferredContactTime || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Submitted:{" "}
                  {new Date(order.createdAt._seconds * 1000).toLocaleString()}
                </p>
              </div>

              <div className="mt-6 flex justify-end items-center gap-8 text-white font-semibold text-lg relative">
                <div className="text-sm text-gray-400">Sales Query</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrdersComp;
