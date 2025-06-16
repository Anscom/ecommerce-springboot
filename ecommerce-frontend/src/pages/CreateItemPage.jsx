import { useState } from "react";
import { useItemStore } from "../stores/useItemStore"; // adjust if path is different
import { useNavigate } from "react-router-dom";

const categories = ["T-SHIRT", "SHORTS", "SHIRTS", "HOODIE", "JEANS"];
const sizes = ["SMALL", "MEDIUM", "LARGE", "XL", "XXL"];
const genders = ["Male", "Female", "Unisex"];

const CreateItemPage = () => {
  const navigate = useNavigate();
  const createItem = useItemStore((state) => state.createItem);

  const [itemData, setItemData] = useState({
    name: "",
    description: "",
    gender: "",
    material: "",
    price: "",
    rating: "",
    color: "",
    size: "",
    stock: "",
    category: "",
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...itemData,
        price: parseFloat(itemData.price),
        rating: parseInt(itemData.rating),
        stock: parseInt(itemData.stock),
      };

      await createItem(formattedData, imageFiles);
      alert("Item created successfully!");
      navigate("/"); // redirect as needed
    } catch (err) {
      alert("Error creating item.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-yellow-200 shadow mt-20 rounded">
      <h2 className="text-2xl font-bold mb-6">Create New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="Name" className="w-full border p-2 rounded" value={itemData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" value={itemData.description} onChange={handleChange} required />

        <select name="gender" className="w-full border p-2 rounded" value={itemData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <input name="material" placeholder="Material" className="w-full border p-2 rounded" value={itemData.material} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price (e.g. 48)" className="w-full border p-2 rounded" value={itemData.price} onChange={handleChange} required />
        <input name="rating" type="number" min="1" max="5" placeholder="Rating (1-5)" className="w-full border p-2 rounded" value={itemData.rating} onChange={handleChange} required />
        <input name="color" placeholder="Color (comma separated)" className="w-full border p-2 rounded" value={itemData.color} onChange={handleChange} required />

        <select name="size" className="w-full border p-2 rounded" value={itemData.size} onChange={handleChange} required>
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <input name="stock" type="number" placeholder="Stock" className="w-full border p-2 rounded" value={itemData.stock} onChange={handleChange} required />

        <select name="category" className="w-full border p-2 rounded" value={itemData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div>
          <label className="block font-medium mb-1">Upload Images</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} required />
        </div>

        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default CreateItemPage;
