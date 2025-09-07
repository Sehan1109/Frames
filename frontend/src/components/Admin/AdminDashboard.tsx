// AdminDashboard.tsx
import { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Phones");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    if (coverImage) formData.append("coverImage", coverImage);
    if (images) {
      Array.from(images).forEach((file) => formData.append("images", file));
    }

    const res = await fetch("http://localhost:5000/api/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    
    const data = await res.json();
    alert(data.message || "Item added successfully");
  };

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <input className="border p-2 m-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 m-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <input className="border p-2 m-2" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <select className="border p-2 m-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Phones</option>
        <option>Watches</option>
        <option>Accessories</option>
        <option>Others</option>
      </select>
      <input type="file" className="border p-2 m-2" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
      <input type="file" multiple className="border p-2 m-2" onChange={(e) => setImages(e.target.files || null)} />
      <button onClick={handleAdd} className="bg-black text-white px-4 py-2">Add</button>
    </div>
    <Footer />
    </>
  );
}
