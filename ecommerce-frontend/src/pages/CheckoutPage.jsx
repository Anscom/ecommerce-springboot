import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useCartStore } from "../stores/useCartStore";
import { useItemStore, getItemImage } from "../stores/useItemStore";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51RXJ7LBRiruHVj7Qp3YQua9yLxQ5d7Wyk68bFLl5utfhAH5u1EUkHN7QIYJlYoC3Up6m0PMybwYywjO7K6WfhUhr00hQwwIQzY"); // Replace with your own STRIPE PUBLIC KEY

const CheckoutForm = () => {
  const stripe = useStripe();
  const navigate = useNavigate();             // Initialize navigate function

  const elements = useElements();
  const { cart, clearCart } = useCartStore();
  const items = cart?.items || [];

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
    const [cartImages, setCartImages] = useState({});

  const getItemImageIds = useItemStore((state) => state.getItemImageIds);
const getItemById = useItemStore((state) => state.fetchItemById);


  useEffect(() => {
    // Call backend to create PaymentIntent
    const createPayment = async () => {
      try {
        const res = await axios.post("https://a-ecommerce.anscom-dev.com/payment/create-payment", {
          amount: Math.round(subtotal * 100), // Stripe expects amount in cents
          currency: "myr",
          description: "Furniro Checkout",
        });

        setClientSecret(res.data);
      } catch (err) {
        setError("Failed to initiate payment");
      }
    };

    if (subtotal > 0) createPayment();
  }, [subtotal]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError("");
      setSuccess(true);
      setProcessing(false);

        // Build full item details (including image and name)
            const enrichedItems = await Promise.all(
            cart.items.map(async (item) => {
                const fullItem = await getItemById(item.itemId); // ✅ await here
                return {
                ...item,
                name: fullItem?.name || "Unknown Item",
                description: fullItem?.description || "Unknown description",
                image: cartImages[item.itemId] || "/default.jpg",
                };
            })
            );


        navigate("/checkout-success", { state: { items: enrichedItems } });
        await clearCart(); // Clear after navigating (or use setTimeout if needed)

    }
  };

return (
  <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-20">
    <h2 className="text-xl font-semibold mb-4">Checkout</h2>

    {/* 🛒 Cart Summary */}
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Order Summary</h3>
      <ul className="space-y-4">
  {items.map((item) => (
    <li key={item.itemId} className="flex items-center gap-4 border-b pb-4">
      {/* Image */}
      <img
        src={cartImages[item.itemId] || "/default.jpg"}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />

      {/* Details */}
      <div className="flex-1">
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
      </div>

      {/* Price */}
      <div className="font-semibold text-right whitespace-nowrap">
        MYR {(item.price * item.quantity).toFixed(2)}
      </div>
    </li>
  ))}
</ul>


      <div className="flex justify-between mt-4 border-t pt-2 font-semibold">
        <span>Total</span>
        <span>MYR {subtotal.toFixed(2)}</span>
      </div>
    </div>

    {/* 🔻 Payment Section */}
    {error && <p className="text-red-500 mb-4">{error}</p>}
    {success ? (
      <p className="text-green-600">Payment Successful! 🎉</p>
    ) : (
      <form onSubmit={handleSubmit}>
        <CardElement className="p-3 border rounded mb-4" />
        <button
          type="submit"
          disabled={!stripe || processing}
          className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {processing ? "Processing..." : `Pay MYR ${subtotal.toFixed(2)}`}
        </button>
      </form>
    )}
  </div>
);

};

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
