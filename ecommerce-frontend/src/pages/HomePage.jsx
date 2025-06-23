import { useEffect, useState } from 'react'
import { useItemStore, getItemImage } from '../stores/useItemStore' 
import ShirtLogo from "../assets/shirts3.png";
import ShortLogo from "../assets/shorts3.jpg";
import TshirtLogo from "../assets/tshirt3.avif";
import JeansLogo from "../assets/jeans3.jpg";
import HoodieLogo from "../assets/hoodie3.jpg";
import { Link } from 'react-router-dom';

const HomePage = () => {
const { items = [], fetchPaginatedItems, getItemImageIds } = useItemStore()
  const [imageUrls, setImageUrls] = useState({}) // { itemId: imageUrl }
const itemsImage = [
  { name: 'T-Shirt', img: TshirtLogo },
  { name: 'Shorts', img: ShortLogo },
  { name: 'Shirts', img: ShirtLogo },
  { name: 'Hoodie', img: HoodieLogo },
  { name: 'Jeans', img: JeansLogo },
];
  const [visibleCount, setVisibleCount] = useState(8);
    const handleSeeMore = () => {
    setVisibleCount(prev => prev + 8); // Load 8 more items
    };

  useEffect(() => {
    fetchPaginatedItems()
  }, [])

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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gray-100 py-20 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Our New Collection</h1>
        <p className="text-gray-600 mb-6">Explore clothes with our special style</p>
        <Link to="/shop"><button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition">Buy Now</button></Link>
      </section>

{/* Browse the Range */}
<section className="py-12 px-4 text-center">
  <h2 className="text-3xl font-semibold text-gray-800 mb-8">Browse The Range</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
  {itemsImage.map(({ name, img }) => (
  <Link
    to="/shop"
    state={{ category: name }}
    key={name}
    className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition block"
  >
    <img src={img} alt={name} className="h-48 w-full object-cover" />
    <h3 className="py-4 text-lg font-medium text-gray-700">{name}</h3>
  </Link>
))}
  </div>
</section>
     {/* Our Products */}
<section className="py-12 px-4 text-center">
  <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Products</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
    {items.slice(0, 8).map((item) => (
      <div key={item.id} className="bg-white shadow rounded overflow-hidden">
        <div className="h-40 bg-gray-200">
          {imageUrls[item.id] ? (
            <img
              src={imageUrls[item.id]}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">{item.itemName}</h3>
          <p className="text-yellow-600 font-semibold">RM {item.price}</p>
        </div>
      </div>
    ))}
  </div>

  {/* See More Button */}
  <div className="mt-8">
    <Link to="/shop">
      <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition">
        Navigate to Shop Page
      </button>
    </Link>
  </div>
</section>


      {/* Inspiration */}
      {/* <section className="py-12 px-4 bg-yellow-50 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">50+ Fashion clothes inspiration</h2>
        <p className="text-gray-600 mb-4">Our designers have created a variety of styles to inspire you</p>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition">Explore More</button>
      </section> */}

      {/* Instagram Style */}
      {/* <section className="py-12 px-4 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">#FurniroFurniture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-40 bg-gray-200"></div>
          ))}
        </div>
      </section> */}
  
    </div>
  )
}

export default HomePage
