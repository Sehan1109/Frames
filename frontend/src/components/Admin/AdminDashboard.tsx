import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
  images?: string[];
}

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Phones");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [deletedCover, setDeletedCover] = useState(false);

  const [itemsByCategory, setItemsByCategory] = useState<
    Record<string, Item[]>
  >({});
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleRemoveCover = () => {
    setDeletedCover(true);
    setCoverImage(null);
    setEditingItem({ ...editingItem!, coverImage: "" });
  };

  const handleRemoveImage = (img: string) => {
    setDeletedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  // ✅ Fetch items grouped by category
  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/items/all");
    const data: Item[] = await res.json();

    const grouped: Record<string, Item[]> = {};
    data.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    setItemsByCategory(grouped);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Add new item
  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    if (coverImage) formData.append("coverImage", coverImage);
    if (images)
      Array.from(images).forEach((file) => formData.append("images", file));

    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: formData,
    });

    const data = await res.json();
    alert(data.message || "Item added successfully");
    fetchItems();
  };

  // ✅ Delete item
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    const data = await res.json();
    alert(data.message || "Item deleted");
    fetchItems();
  };

  // ✅ Save edited item
  const handleUpdate = async () => {
    if (!editingItem) return;

    const formData = new FormData();
    formData.append("title", editingItem.title);
    formData.append("description", editingItem.description);
    formData.append("category", editingItem.category);
    formData.append("price", editingItem.price.toString());

    if (coverImage) formData.append("coverImage", coverImage);
    if (images)
      Array.from(images).forEach((file) => formData.append("images", file));

    // Send delete requests
    formData.append("deletedImages", JSON.stringify(deletedImages));
    formData.append("deleteCover", deletedCover.toString());

    const res = await fetch(
      `http://localhost:5000/api/items/${editingItem._id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    alert(data.message || "Item updated");
    setEditingItem(null);
    setDeletedImages([]);
    setDeletedCover(false);
    fetchItems();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Add Product</h2>
        <div className="flex flex-col gap-2 mb-10">
          <input
            className="border p-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="border p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="border p-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            className="border p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Phones</option>
            <option>Watches</option>
            <option>Accessories</option>
            <option>Others</option>
          </select>
          <input
            type="file"
            className="border p-2"
            onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
          />
          <input
            type="file"
            multiple
            className="border p-2"
            onChange={(e) => setImages(e.target.files || null)}
          />
          <button onClick={handleAdd} className="bg-black text-white px-4 py-2">
            Add
          </button>
        </div>

        {/* ✅ Display items grouped by category */}
        {Object.entries(itemsByCategory).map(([cat, items]) => (
          <div key={cat} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{cat}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="border p-4 rounded-lg shadow flex flex-col"
                >
                  {item.coverImage && (
                    <img
                      src={`http://localhost:5000/${item.coverImage}`}
                      alt={item.title}
                      className="h-40 w-full object-cover rounded mb-3"
                    />
                  )}
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-gray-600 mb-2">${item.price}</p>
                  <div className="mt-auto flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ✅ Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h3 className="text-xl font-bold mb-4">Edit Item</h3>
              <input
                className="border p-2 mb-2 w-full"
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
              />
              <input
                className="border p-2 mb-2 w-full"
                value={editingItem.description}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    description: e.target.value,
                  })
                }
              />
              <input
                className="border p-2 mb-2 w-full"
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    price: Number(e.target.value),
                  })
                }
              />
              <select
                className="border p-2 mb-2 w-full"
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
              >
                <option>Phones</option>
                <option>Watches</option>
                <option>Accessories</option>
                <option>Others</option>
              </select>

              <p className="text-sm text-gray-600">Current Cover:</p>
              {editingItem.coverImage && !deletedCover && (
                <div className="relative mb-2">
                  <img
                    src={`http://localhost:5000/${editingItem.coverImage}`}
                    alt="cover"
                    className="h-24 rounded mb-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-1 rigth-1 bg-red-500 text-white px-2 rounded"
                  >
                    X
                  </button>
                </div>
              )}
              <input
                type="file"
                className="border p-2 mb-2 w-full"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              />

              <p className="text-sm text-gray-600">Current Images:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {editingItem.images?.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={`http://localhost:5000/${img}`}
                      alt={`img-${i}`}
                      className={`h-16 rounded ${
                        deletedImages.includes(img) ? "opacity-40" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white px-1 rounded"
                    >
                      {deletedImages.includes(img) ? "Undo" : "X"}
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                className="border p-2 mb-4 w-full"
                onChange={(e) => setImages(e.target.files || null)}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
