import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemStore, getItemImage } from '../stores/useItemStore';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';

const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error, fetchItemById, getItemImageIds } = useItemStore();
  const { addItemToCart } = useCartStore();
const { isAuthenticated } = useAuthStore();
  const [imageUrl, setImageUrl] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const handleQuantityChange = (type) => {
  setQuantity((prevQuantity) => {
    if (type === 'decrement') {
      return prevQuantity > 1 ? prevQuantity - 1 : 1; // Prevent going below 1
    } else if (type === 'increment') {
      return prevQuantity + 1;
    }
    return prevQuantity;
  });
};


  useEffect(() => {
    fetchItemById(id);
  }, [id]);

  useEffect(() => {
    const fetchImage = async () => {
      if (item?.id) {
        const images = await getItemImageIds(item.id);
        if (images.length > 0) {
          const url = getItemImage(images[0].id);
          setImageUrl(url);
        }
      }
    };
    fetchImage();
  }, [item]);

    // Handle countdown and redirect
  useEffect(() => {
    if (showDialog) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/login'); // ✅ redirect to login
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showDialog, navigate]);

  const sizes = typeof item?.size === 'string' ? item.size.split(',') : item?.size || [];
  const colors = typeof item?.color === 'string' ? item.color.split(',') : item?.color || [];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowDialog(true);
    } else {
      addItemToCart(item.id, quantity);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!item) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Preview */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={item.itemName} className="w-full h-auto object-cover" />
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
        </div>

        {/* Item Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{item.itemName}</h1>
          <p className="text-xl text-yellow-600 mb-2">${item.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-4">
            {item.description}
          </p>

          {/* Size Options */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Size</h2>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button key={size} className="border rounded px-3 py-1 hover:bg-gray-100">
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Options */}
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Color</h2>
            <div className="flex gap-2">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                ></div>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="px-3 py-1 bg-gray-200"
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-10 text-center border-l border-r"
              />
              <button
                onClick={() => handleQuantityChange('increment')}
                className="px-3 py-1 bg-gray-200"
              >
                +
              </button>
            </div>
          <button
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            onClick={handleAddToCart} // ✅ Add this
          >
            Add to Cart
          </button>

          </div>

          {/* Metadata */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Material:</strong> {item.material}</p>
            <p><strong>Color:</strong> {item.color}</p>
            <p><strong>Stock Left:</strong> {item.stock}</p>
          </div>
        </div>
      </div>

            {/* Login Prompt Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center">
            <h2 className="text-xl font-semibold mb-4">Please sign in to add items to your cart</h2>
            <p className="text-gray-600">Redirecting to login in {countdown} seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
