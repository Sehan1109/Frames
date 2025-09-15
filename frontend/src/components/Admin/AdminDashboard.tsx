import { useEffect, useState } from "react";
import {
  FaBox,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBell,
  FaSearch,
} from "react-icons/fa";

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

  // form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Phones");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);

  // ✅ Fetch items
  const fetchItems = async () => {
    const res = await fetch(`${API_BASE}/items/all`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
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
    if (!token) return alert("You must be logged in as admin");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);

    if (coverImage) formData.append("coverImage", coverImage);
    otherImages.forEach((img) => formData.append("images", img));

    if (editingItem) {
      // Update item
      await fetch(`${API_BASE}/items/${editingItem._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // only auth header; no Content-Type for FormData
        },
        body: formData,
      });
    } else {
      // Add new item
      await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    }

    fetchItems();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;

    const token = localStorage.getItem("token"); // 👈 retrieve stored token
    if (!token) {
      alert("You must be logged in as admin");
      return;
    }

    await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // 👈 add token
      },
    });
  };

  return (
    <div className="flex font-poppins h-screen text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
            <FaBox /> Products
          </button>
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
            📊 Dashboard
          </button>
          <button className="flex items-center gap-3 p-2 w-full hover:bg-gray-700 rounded">
            ⚙️ Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm">
          © 2025 MyStore
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">
        {/* Topbar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <FaBell className="text-gray-600 text-xl cursor-pointer" />
            <img
              src="https://ui-avatars.com/api/?name=Admin"
              alt="profile"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Dashboard Stats */}
        <section className="p-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Total Products</h3>
            <p className="text-2xl font-bold">{items.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-2xl font-bold">$12,430</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-gray-500">Orders</h3>
            <p className="text-2xl font-bold">56</p>
          </div>
        </section>

        {/* Products Table */}
        <section className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Products</h2>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              <FaPlus /> Add Product
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
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
                    <td className="p-3">{item.title}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">${item.price}</td>
                    <td className="p-3 flex gap-2">
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
