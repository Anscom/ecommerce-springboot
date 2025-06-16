import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useItemStore } from '../stores/useItemStore'

const UpdateItemPage = () => {
  const { itemId } = useParams()
  const navigate = useNavigate()

  const fetchItemById = useItemStore(state => state.fetchItemById)
  const updateItem = useItemStore(state => state.updateItem)
  const loading = useItemStore(state => state.loading)
  const error = useItemStore(state => state.error)

const [itemData, setItemData] = useState({
  name: '',
  description: '',
  gender: '',
  material: '',
  price: '',
  rating: '',
  color: '',
  size: '',
  stock: '',
  category: '',
})

  const [newImages, setNewImages] = useState([])
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      const item = await fetchItemById(itemId)
      if (item) {
        setItemData({
        name: item.name || '',
        description: item.description || '',
        gender: item.gender || '',
        material: item.material || '',
        price: item.price || '',
        rating: item.rating || '',
        color: item.color || '',
        size: item.size || '',
        stock: item.stock || '',
        category: item.category || '',
        })
      }
    }
    loadItem()
  }, [itemId, fetchItemById])

  const handleChange = e => {
    const { name, value } = e.target
    setItemData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = e => {
    setNewImages(e.target.files)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      await updateItem(itemId, itemData, newImages)
      setSubmitSuccess('Item updated successfully!')
      setTimeout(() => navigate('/items'), 1500)
    } catch (err) {
      setSubmitError('Failed to update item')
    }
  }

  return (
    <div className="max-w-lg mx-auto my-8 p-6 border border-gray-300 rounded-lg shadow-sm mt-20">
      <h2 className="text-2xl font-semibold mb-6">Update Item</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {submitError && <p className="text-red-600 mb-2">{submitError}</p>}
      {submitSuccess && <p className="text-green-600 mb-2">{submitSuccess}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
<div className="mb-4">
  <label className="block font-medium mb-1">Name</label>
  <input
    name="name"
    value={itemData.name}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    required
  />
</div>

{/* Description */}
<div className="mb-4">
  <label className="block font-medium mb-1">Description</label>
  <textarea
    name="description"
    value={itemData.description}
    onChange={handleChange}
    rows={3}
    className="w-full p-2 border border-gray-300 rounded resize-none"
  />
</div>

{/* Gender */}
<div className="mb-4">
  <label className="block font-medium mb-1">Gender</label>
  <input
    name="gender"
    value={itemData.gender}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
</div>

{/* Material */}
<div className="mb-4">
  <label className="block font-medium mb-1">Material</label>
  <input
    name="material"
    value={itemData.material}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
</div>

{/* Price */}
<div className="mb-4">
  <label className="block font-medium mb-1">Price</label>
  <input
    type="number"
    name="price"
    value={itemData.price}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    min="0"
  />
</div>

{/* Rating */}
<div className="mb-4">
  <label className="block font-medium mb-1">Rating (0–5)</label>
  <input
    type="number"
    name="rating"
    value={itemData.rating}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    min="0"
    max="5"
  />
</div>

{/* Color */}
<div className="mb-4">
  <label className="block font-medium mb-1">Color</label>
  <input
    name="color"
    value={itemData.color}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  />
</div>

{/* Size */}
<div className="mb-4">
  <label className="block font-medium mb-1">Size</label>
  <select
    name="size"
    value={itemData.size}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  >
    <option value="">Select Size</option>
    {['SMALL', 'MEDIUM', 'LARGE', 'X_LARGE', 'XXL_LARGE'].map(size => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>
</div>

{/* Stock */}
<div className="mb-4">
  <label className="block font-medium mb-1">Stock</label>
  <input
    type="number"
    name="stock"
    value={itemData.stock}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
    min="0"
  />
</div>

{/* Category */}
<div className="mb-6">
  <label className="block font-medium mb-1">Category</label>
  <select
    name="category"
    value={itemData.category}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded"
  >
    <option value="">Select Category</option>
    {['TSHIRT', 'SHORTS', 'SHIRTS', 'HOODIE', 'JEANS'].map(cat => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
          } transition-colors duration-200`}
        >
          {loading ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  )
}

export default UpdateItemPage
