// AdminDashboard.tsx
import { useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Phones");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // preview image
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    if (image) formData.append("image", image); // 👈 send file

    await axios.post("http://localhost:5000/api/items", formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    alert("Product added successfully!");
  };

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center mt-20">
      <h2 className="text-2xl font-bold">Add Product</h2>
      <input className="border p-2 m-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-2 m-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
      <label className="cursor-pointer border p-4 m-2 flex flex-col items-center justify-center w-48 h-48">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span>Click to upload image</span>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      <input className="border p-2 m-2" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <select className="border p-2 m-2" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Phones</option>
        <option>Watches</option>
        <option>Accessories</option>
        <option>Others</option>
      </select>
      <button onClick={handleAdd} className="bg-black text-white px-4 py-2">Add</button>
    </div>
    <Footer />
    </>
  );
}
