// AdminDashboard.tsx
import { useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Phones");

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/api/products", 
      { title, image, category },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Product added successfully!");
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <input className="border p-2 m-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 m-2" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
      <select className="border p-2 m-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Phones</option>
        <option>Watches</option>
        <option>Accessories</option>
        <option>Others</option>
      </select>
      <button onClick={handleAdd} className="bg-black text-white px-4 py-2">Add</button>
    </div>
  );
}
