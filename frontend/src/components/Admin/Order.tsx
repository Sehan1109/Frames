import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Order {
  _id: string;
  name: string;
  product?: { title: string };
  quantity: number;
  totalAmount: number;
  status: string;
}

export default function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) {
      showMessage(data.message || "Failed to fetch orders", "error");
      setOrders([]);
      return;
    }

    setOrders(data.orders || data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markComplete = async (orderId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/complete`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok) {
      fetchOrders();
      showMessage("Order marked as complete ✅");
    } else {
      showMessage(data.message || "Failed to update order ❌", "error");
    }
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.product?.title}</td>
                <td className="p-3">{order.quantity}</td>
                <td className="p-3">${order.totalAmount}</td>
                <td className="p-3">
                  {order.status === "completed" ? (
                    <span className="text-green-600 font-semibold">
                      Completed
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {order.status !== "completed" && (
                    <button
                      onClick={() => markComplete(order._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-lg text-white 
      ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
