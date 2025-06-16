import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItemStore, getItemImage } from '../stores/useItemStore'

const ItemListPage = () => {
  const navigate = useNavigate()
  const { items, fetchAllItems, getItemImageIds, loading, error } = useItemStore()

  const [localItems, setLocalItems] = useState([])
  const [imageUrls, setImageUrls] = useState({})

  useEffect(() => {
    const loadItems = async () => {
      await fetchAllItems()
    }
    loadItems()
  }, [fetchAllItems])

  useEffect(() => {
    setLocalItems(items)
  }, [items])

  useEffect(() => {
    if (items.length > 0) {
      items.forEach(async (item) => {
        try {
          const imagesMeta = await getItemImageIds(item.id)
          if (imagesMeta && imagesMeta.length > 0) {
            const firstImageId = imagesMeta[0].id
            const url = getItemImage(firstImageId)
            setImageUrls(prev => ({ ...prev, [item.id]: url }))
          } else {
            setImageUrls(prev => ({ ...prev, [item.id]: null }))
          }
        } catch {
          setImageUrls(prev => ({ ...prev, [item.id]: null }))
        }
      })
    }
  }, [items, getItemImageIds])

  const handleClick = (id) => {
    navigate(`/items/update/${id}`)
  }

  return (
    <div className="mt-28 max-w-3xl mx-auto my-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Items List</h2>

      {loading && <p>Loading items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="list-none p-0">
        {localItems.map(item => (
          <li
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="flex items-center p-2.5 px-4 border border-gray-300 mb-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200 transition"
          >
            <div className="w-20 h-20 mr-4 bg-gray-200 flex justify-center items-center overflow-hidden rounded">
              {imageUrls[item.id] ? (
                <img
                  src={imageUrls[item.id]}
                  alt={item.name}
                  className="max-w-full max-h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <div>
              <strong>{item.name}</strong> — ${item.price.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ItemListPage
