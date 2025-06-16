import { useEffect, useState } from 'react';
import { useItemStore, getItemImage } from '../stores/useItemStore';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ShopPage = () => {
  const { items, fetchAllItems, getItemImageIds } = useItemStore();
  const [filteredItems, setFilteredItems] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [imageUrls, setImageUrls] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);
const location = useLocation();
  const selectedCategory = location.state?.category || null;

  useEffect(() => {
    if (selectedCategory) {
      // Example: Filter items or call fetchItemsByCategory(selectedCategory)
    //   console.log("Filter by category:", selectedCategory);
    }
  }, [selectedCategory]);
    const handleSeeMore = () => {
    setVisibleCount(prev => prev + 8); // Load 8 more items
    };

  useEffect(() => {
    fetchAllItems();
  }, []);

  useEffect(() => {
    let tempItems = [...items];

    if (category) {
      tempItems = tempItems.filter(item => item.category === category);
    }

    if (minPrice) {
      tempItems = tempItems.filter(item => item.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      tempItems = tempItems.filter(item => item.price <= parseFloat(maxPrice));
    }

    setFilteredItems(tempItems);
  }, [items, category, minPrice, maxPrice]);

  useEffect(() => {
    // After items are loaded, fetch images metadata for each item
    if (items.length > 0) {
      items.forEach(async (item) => {
        try {
          const imagesMeta = await getItemImageIds(item.id)
          if (imagesMeta && imagesMeta.length > 0) {
            const firstImageId = imagesMeta[0].id
            const url = getItemImage(firstImageId)
            setImageUrls(prev => ({ ...prev, [item.id]: url }))
          } else {
            // No images found for this item
            setImageUrls(prev => ({ ...prev, [item.id]: null }))
          }
        } catch (err) {
          setImageUrls(prev => ({ ...prev, [item.id]: null }))
        }
      })
    }
  }, [items, getItemImageIds])


  const uniqueCategories = [...new Set(items.map(item => item.category))];

  return (
    <div className="pt-20 px-4">
      <h1 className="text-4xl font-bold text-center mb-6">Shop</h1>

     {/* Filter Section */}
<div className="bg-white shadow-md rounded-lg p-6 mb-10 max-w-5xl mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Filter Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {/* Category Select */}
<div className="relative">
  <label className="block text-sm text-gray-600 mb-1">Category</label>
  <div className="relative">
    <select
      className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      <option value="">All Categories</option>
      {uniqueCategories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
    {/* Dropdown icon */}
    <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>


    {/* Min Price */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Min Price (MYR)</label>
      <input
        type="number"
        placeholder="e.g. 10"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
    </div>

    {/* Max Price */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Max Price (MYR)</label>
      <input
        type="number"
        placeholder="e.g. 100"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
    </div>

    {/* Reset Button */}
    <div className="flex items-end">
      <button
        onClick={() => {
          setCategory('');
          setMinPrice('');
          setMaxPrice('');
        }}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded transition"
      >
        Reset Filters
      </button>
    </div>
  </div>
</div>


      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredItems.slice(0, visibleCount).map(item => (
<Link to={`/shop/${item.id}`} key={item.id} className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition block">
  <div className="h-48 bg-gray-100 flex justify-center items-center">
    {imageUrls[item.id] ? (
      <img src={imageUrls[item.id]} alt={item.itemName} className="object-cover h-full w-full" />
    ) : (
      <div className="flex justify-center items-center h-full text-gray-400">No Image</div>
    )}
  </div>
  <div className="p-4">
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{item.name}</h3>
    <p className="text-sm text-gray-500 mb-2">{item.category}</p>
    <p className="text-yellow-600 font-bold">MYR {item.price.toLocaleString()}</p>
  </div>
</Link>
        ))}
        
      </div>
      {visibleCount < filteredItems.length && (
  <div className="text-center mt-8">
    <button
      onClick={handleSeeMore}
      className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
    >
      See More
    </button>
  </div>
)}

    </div>
  );
};

export default ShopPage;
