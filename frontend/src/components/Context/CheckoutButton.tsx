import axios, { AxiosResponse } from "axios";
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

const CheckoutButton = ({ cart }: { cart: CartItem[] }) => {
  const handleCheckout = async () => {
    try {
      const cartData = cart.map((item) => ({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
      }));

      // ✅ Explicitly type Axios response
      const res: AxiosResponse<CheckoutSessionResponse> = await axios.post(
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

      // ✅ Use typed response
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data);
        alert(
          (err.response?.data as { error?: string })?.error || "Checkout failed"
        );
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
