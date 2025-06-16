import { useLocation } from "react-router-dom";

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const purchasedItems = location.state?.items || [];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-20 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="mb-6">Thank you for your purchase. Here is what you bought:</p>

      <ul className="space-y-4">
        {purchasedItems.map((item) => (
          <li key={item.id} className="flex items-center gap-4 border-b pb-4">
            <img
              src={item.image || "/default.jpg"}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="font-semibold text-right whitespace-nowrap">
              MYR {(item.price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckoutSuccessPage;
