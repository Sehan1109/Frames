import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);
const API_BASE = import.meta.env.VITE_API_BASE as string;

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity?: number;
}

interface CheckoutSessionResponse {
  id: string;
}

// ✅ Custom type guard without importing AxiosError
function isAxiosError(
  error: unknown
): error is { isAxiosError: boolean; response?: any } {
  return typeof error === "object" && error !== null && "isAxiosError" in error;
}

const CheckoutButton = ({ cart }: { cart: CartItem[] }) => {
  const handleCheckout = async () => {
    try {
      const cartData = cart.map((item) => ({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      const res = await axios.post<CheckoutSessionResponse>(
        `${API_BASE}/payments/create-checkout-session`,
        { cart: cartData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        console.error(err.response?.data);
        alert(err.response?.data?.error || "Checkout failed");
      } else {
        console.error(err);
        alert("Unexpected error occurred");
      }
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
