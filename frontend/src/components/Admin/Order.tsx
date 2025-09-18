import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Order {
  _id: string;
  name: string;
  address: string;
  whatsapp: string;
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

  const deleteOrder = async (orderId: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (res.ok) {
      fetchOrders();
      showMessage("Order deleted 🗑️");
    } else {
      showMessage(data.message || "Failed to delete order ❌", "error");
    }
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const pendingOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {/* Pending Orders */}
      <div>
        <h3 className="text-lg font-semibold mb-2">New / Pending Orders</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Address</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Item</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-black">{order.name}</td>
                  <td className="p-3 text-black">{order.address}</td>
                  <td className="p-3">
                    <a
                      href={`https://wa.me/${order.whatsapp.replace(
                        /\D/g,
                        ""
                      )}?text=Hello%20${encodeURIComponent(
                        order.name
                      )},%20regarding%20your%20order%20from%20Frames%20Shop`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-medium hover:underline"
                    >
                      {order.whatsapp}
                    </a>
                  </td>

                  <td className="p-3 text-black">{order.product?.title}</td>
                  <td className="p-3 text-black">{order.quantity}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => markComplete(order._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 p-4">
                    No new orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Completed Orders */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Completed Orders</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Product</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-black">{order.name}</td>
                  <td className="p-3 text-black">{order.product?.title}</td>
                  <td className="p-3 text-black">{order.quantity}</td>
                  <td className="p-3 text-black">${order.totalAmount}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    Completed
                  </td>
                </tr>
              ))}
              {completedOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 p-4">
                    No completed orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
