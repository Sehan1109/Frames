import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ cart }: { cart: any[] }) => {
  const handleCheckout = async () => {
    try {
      const cartData = cart.map((item) => ({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      // Call backend to create checkout session
      const res = await axios.post(
        "http://localhost:5000/api/payments/create-checkout-session",
        { cart: cartData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Load Stripe.js
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Checkout failed");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Pay Now
    </button>
  );
};

export default CheckoutButton;
