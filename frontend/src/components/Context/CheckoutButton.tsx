import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51S6AMCL1PGDmrKPOGfpa6MW1j1HKokaA3owih5FP86hjJccLO4DzsAQj28AntnceMFHKdf0AytAypOcsdHfArSmc00inzpoIvV"
);

const CheckoutButton = ({ cart }: { cart: any[] }) => {
  const handleCheckout = async () => {
    try {
      const cartData = cart.map((item) => ({
        _id: item._id,
        title: item.title,
        price: item.price,
        quantity: 1,
      }));
      // if you want all items in cart, use cart from CartContext
      // const cartData = cart;

      const res = await axios.post(
        "http://localhost:5000/api/payments/create-checkout-session",
        { cart: cartData },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const sessionId = res.data.id;
      const stripe = (window as any).Stripe(
        "pk_test_51S6AMCL1PGDmrKPOGfpa6MW1j1HKokaA3owih5FP86hjJccLO4DzsAQj28AntnceMFHKdf0AytAypOcsdHfArSmc00inzpoIvV"
      ); // your publishable key
      await stripe.redirectToCheckout({ sessionId });
    } catch (err: any) {
      alert(err.response?.data?.message || "Checkout failed");
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
