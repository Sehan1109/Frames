import { useEffect, useState } from "react";
import {
  FaBox,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
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
  });

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setStats(data);
  };

  const fetchItems = async () => {
    const res = await fetch(`${API_BASE}/items/all`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

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
      if (editingItem) {
        await fetch(`${API_BASE}/items/${editingItem._id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        showMessage("Product updated successfully ✅");
      } else {
        await fetch(`${API_BASE}/items`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        showMessage("Product added successfully ✅");
      }
      fetchItems();
      setShowModal(false);
    } catch {
      showMessage("Failed to save product ❌", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    const token = localStorage.getItem("token");
    if (!token) return showMessage("You must be logged in as admin", "error");

    try {
      await fetch(`${API_BASE}/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
      showMessage("Product deleted successfully ✅");
    } catch {
      showMessage("Failed to delete product ❌", "error");
    }
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex font-poppins min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/80 backdrop-blur-md border-r border-gray-700 flex flex-col">
        <div className="p-6 text-xl font-extrabold tracking-wide text-yellow-400">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition">
            <FaBox /> Products
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition">
            📊 Dashboard
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition">
            ⚙️ Settings
          </button>
        </nav>
        <div className="p-4 text-xs text-gray-400">© 2025 FujoFrame</div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Topbar */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 bg-gray-800 px-3 py-2 rounded-lg">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <FaBell className="text-gray-400 text-xl cursor-pointer hover:text-yellow-400 transition" />
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              className="w-10 h-10 rounded-full border border-yellow-400"
            />
          </div>
        </header>

        {/* Stats */}
        <section className="grid md:grid-cols-3 gap-6 mb-10 text-black">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
          <Link
            to="/admin/orders"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-gray-500">New Orders</h3>
            <p className="text-2xl font-bold">{stats.newOrders}</p>
          </Link>
        </section>

        {/* Products Table */}
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
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
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
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">${item.price}</td>
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg animate-fade-in">
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

            <div>
              <label className="block mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCoverImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <div>
              <label className="block mb-1">Other Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
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
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
