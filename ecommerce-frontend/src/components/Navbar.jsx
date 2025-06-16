import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, User, Lock, FileLock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useCartStore } from "../stores/useCartStore";
import { useItemStore, getItemImage } from "../stores/useItemStore";


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartImages, setCartImages] = useState({});
const { item, loading, error, fetchItemById } = useItemStore();
const getItemImageIds = useItemStore((state) => state.getItemImageIds);
  const { user, fetchUserProfile, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart, removeItemFromCart } = useCartStore();
const items = cart?.items || [];

useEffect(() => {
  fetchCart();

}, []);
  // const { cartItems } = useCartStore();

  const linkToCreatePage = async () => {
    navigate("/create-item");
  }

  const linkToUpdatePage = async () => {
    navigate("/items");
  }

  const handleUserClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      await fetchUserProfile();
      setShowProfile((prev) => !prev);
    }
  };

  useEffect(() => {
  // Fetch images for cart whenever cart items change
  const fetchImagesForCart = async () => {
    if (!cart?.items) return;

    const newImages = {};
    for (const item of cart.items) {
      if (!item.itemId) continue;
      const imageIds = await getItemImageIds(item.itemId);
      if (imageIds.length > 0) {
        newImages[item.itemId] = getItemImage(imageIds[0].id);
      }
    }
    setCartImages(newImages);
  };

  fetchImagesForCart();
}, [cart?.items]);  // Only when cart.items changes, no fetchCart call here

  const toggleCart = () => setIsCartOpen(!isCartOpen);

const subtotal = items.reduce((acc, item) => {
  if (typeof item.price !== 'number') return acc;
  return acc + item.price * item.quantity;
}, 0);

const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 left-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/home"><div className="text-2xl font-bold text-gray-800">Furniro</div></Link>

          <ul className="hidden md:flex gap-6 text-gray-600 font-medium">
            {["/home", "/shop", "/contact"].map((path) => (
              <Link key={path} to={path}>
                <li className={`cursor-pointer ${location.pathname === path ? "text-yellow-600 font-semibold" : ""}`}>
                  {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
                </li>
              </Link>
            ))}
          </ul>

          <div className="hidden md:flex gap-4 items-center">
                        {user?.roles?.includes("ROLE_ADMIN") && (
    <FileLock onClick={linkToUpdatePage} className="w-4 h-4 text-yellow-600" title="Admin user" />
  )}
            {user?.roles?.includes("ROLE_ADMIN") && (
    <Lock onClick={linkToCreatePage} className="w-4 h-4 text-yellow-600" title="Admin user" />
  )}
            <User onClick={handleUserClick} className={`w-5 h-5 cursor-pointer ${location.pathname === "/login" || location.pathname === "/signup" ? "text-yellow-600 font-semibold" : "" }`} />
            <div className="relative">
            <ShoppingCart onClick={toggleCart} className="w-5 h-5 cursor-pointer" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

            {showProfile && user && (
              <div className="absolute top-12 right-4 bg-white shadow-lg rounded p-4 w-64 z-50 space-y-2">
                <p className="font-semibold text-gray-800">Username: {user.username}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <button
                  onClick={async () => {
                    await logout();
                    setShowProfile(false);
                    navigate("/login");
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow">
          {["/home", "/shop", "/contact"].map((path) => (
            <Link key={path} to={path}>
              <li className={`block p-3 cursor-pointer ${location.pathname === path ? "text-yellow-600 font-semibold" : "text-gray-800 hover:text-yellow-600"}`}>
                {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
              </li>
            </Link>
          ))}
          
          <div className="flex gap-4 pt-2">
                <FileLock onClick={linkToUpdatePage} className="w-4 h-4 text-yellow-600" title="Admin user" />

                <Lock onClick={linkToCreatePage} className="w-4 h-4 text-yellow-600" title="Admin user" />

            <User onClick={handleUserClick} className="w-5 h-5 cursor-pointer text-gray-800" />
            
            <div className="relative">
            <ShoppingCart onClick={toggleCart} className="w-5 h-5 cursor-pointer text-gray-800" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>

          </div>
           {showProfile && user && (
              <div className="absolute top-12 right-4 bg-white shadow-lg rounded p-4 w-64 z-50 space-y-2">
                <p className="font-semibold text-gray-800">Username: {user.username}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <button
                  onClick={async () => {
                    await logout();
                    setShowProfile(false);
                    navigate("/login");
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 px-5 py-6 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Shopping Cart</h2>
            <button onClick={toggleCart}><X className="w-5 h-5" /></button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {items.map((cartItem) => (
              <div key={cartItem.itemId} className="flex items-center gap-4 border-b pb-2">
                <img
                  src={cartImages[cartItem.itemId] || "/default.jpg"}
                  alt={cartItem.itemName}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{cartItem.itemName}</p>
                  <p className="text-sm text-gray-500">
                    {cartItem.quantity} × MYR {cartItem.price.toFixed(2)}
                  </p>
                </div>
                <button onClick={() => 
          
                  removeItemFromCart(cartItem.itemId)}>
                  
                  <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            ))}



          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>MYR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => {
                toggleCart(); // Close cart
                navigate("/checkout");
              }} className="flex-1 border border-black px-3 py-1 rounded">Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
