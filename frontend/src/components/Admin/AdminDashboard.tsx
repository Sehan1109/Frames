import { useEffect, useState } from "react";
import {
  FaBox,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
}

interface Message {
  _id: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Phones");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newOrders: 0,
    unreadMessages: 0,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [view, setView] = useState<"items" | "messages">("items");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats({
            totalOrders: data.totalOrders || 0,
            totalRevenue: data.totalRevenue || 0,
            newOrders: data.newOrders || 0,
            unreadMessages: data.unreadMessages || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/items/all`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.log("Failed to fetch items", err);
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data); // This was the bug, setting 'message' instead of 'messages'
      } else {
        showMessage(data.message || "Failed to fetch messages", "error");
      }
    } catch (err) {
      showMessage("Client error fetching messages", "error");
    }
  };

  useEffect(() => {
    if (view === "items") {
      fetchItems();
    } else if (view === "messages") {
      fetchMessages();
    }
  }, [view]);

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setCategory(item.category);
      setDescription(item.description);
      setPrice(item.price.toString());
    } else {
      setEditingItem(null);
      setTitle("");
      setCategory("Phones");
      setDescription("");
      setPrice("");
    }
    // Reset file inputs
    setCoverImage(null);
    setOtherImages([]);
    setShowModal(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return showMessage("You must be logged in as admin", "error");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);

    if (coverImage) formData.append("coverImage", coverImage);
    otherImages.forEach((img) => formData.append("images", img));

    try {
      const url = editingItem
        ? `${API_BASE}/items/${editingItem._id}`
        : `${API_BASE}/items`;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(
          editingItem
            ? "Product updated successfully ✅"
            : "Product added successfully ✅",
          "success" // This was incorrectly "error"
        );
        fetchItems();
        setShowModal(false);
      } else {
        throw new Error(data.message || "Failed to save");
      }
    } catch (err: any) {
      showMessage(err.message || "Failed to save product ❌", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    const token = localStorage.getItem("token");
    if (!token) return showMessage("You must be logged in as admin", "error");

    try {
      const res = await fetch(`${API_BASE}/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        fetchItems();
        showMessage("Product deleted successfully ✅", "success"); // This was incorrectly "error"
      } else {
        throw new Error(data.message || "Failed to delete");
      }
    } catch (err: any) {
      showMessage(err.message || "Failed to delete product ❌", "error");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
        );

        setStats((prev) => ({ ...prev, unreadMessages: data.unreadMessages }));
        showMessage("Message marked as read", "success");
      } else {
        showMessage(data.message || "Failed to mark as read", "error");
      }
    } catch (err) {
      showMessage("Client error", "error");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        setStats((prev) => ({ ...prev, unreadMessages: data.unreadMessages }));
        showMessage("Message deleted", "success");
      } else {
        showMessage(data.message || "Failed to delete", "error");
      }
    } catch (err) {
      showMessage("Client error", "error");
    }
  };

  return (
    <div className="flex font-poppins min-h-screen bg-black text-white">
      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Topbar */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <h1 className="text-2xl font-bold cursor-pointer">
              Fujo
              {/* CHANGED: Added consistent branding */}
              <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
                Frame
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-yellow-400 transition" />
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="Admin"
              className="w-10 h-10 rounded-full border border-yellow-400 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute top-20 right-2 bg-white border border-yellow-400 rounded-lg shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-2 text-gray-700 hover:bg-yellow-100 rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Stats */}
        <section className="grid md:grid-cols-4 gap-6 mb-10 text-black">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-gray-500">New Orders</h3>
            <p className="text-2xl font-bold">{stats.newOrders}</p>
          </Link>
          {/* New Message Stat */}
          <div
            onClick={() => setView("messages")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-gray-500">New Messages</h3>
            <p className="text-2xl font-bold">{stats.unreadMessages}</p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setView("items")}
            className={`py-2 px-4 font-semibold flex items-center gap-2 ${
              view === "items"
                ? "border-b-2 border-yellow-400 text-white"
                : "text-gray-400"
            }`}
          >
            <FaBox />
            Manage Items
          </button>
          <button
            onClick={() => setView("messages")}
            className={`py-2 px-4 font-semibold flex items-center gap-2 ${
              view === "messages"
                ? "border-b-2 border-yellow-400 text-white"
                : "text-gray-400"
            }`}
          >
            <FaEnvelope />
            Messages
            {stats.unreadMessages > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.unreadMessages}
              </span>
            )}
          </button>
        </div>

        {/* Conditional View: Items */}
        {view === "items" && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
              >
                <FaPlus /> Add Product
              </button>
            </div>

            <div className="bg-white text-black rounded-xl shadow-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">
                        {item.coverImage && (
                          <img
                            src={`${API_BASE.replace("/api", "")}/uploads/${
                              item.coverImage
                            }`}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </td>
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3 text-gray-600">{item.category}</td>
                      <td className="p-3 font-medium">${item.price}</td>
                      <td className="p-3 flex gap-3">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1 text-red-600 hover:underline"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Conditional View: Messages */}
        {view === "messages" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
            <div className="bg-white text-black rounded-xl shadow-lg p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No messages found.
                  </p>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-4 border rounded-lg ${
                      msg.read
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-yellow-400"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`font-semibold ${
                          msg.read ? "text-gray-700" : "text-black"
                        }`}
                      >
                        From: {msg.email}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p
                      className={`mt-2 ${
                        msg.read ? "text-gray-600" : "text-black"
                      }`}
                    >
                      {msg.message}
                    </p>
                    <div className="flex gap-2 mt-4">
                      {!msg.read && (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Toast */}
      {message && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white ${
            messageType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Edit Product" : "Add Product"}
            </h2>
            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <select
                className="w-full border p-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Phones</option>
                <option>Watches</option>
                <option>Accessories</option>
                <option>Others</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100"
                onChange={(e) =>
                  setCoverImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <div className="mt-4">
              {/* 👈 *** FIX IS HERE *** */}
              <label className="block mb-1">Other Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-50 file:text-gray-700
                  hover:file:bg-gray-100"
                onChange={(e) =>
                  setOtherImages(
                    e.target.files ? Array.from(e.target.files) : []
                  )
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
