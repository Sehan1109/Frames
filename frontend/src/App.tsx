import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CategoryPage from "./components/CollectionPage/CollectionPage";
import ItemPage from "./components/ItemPage/ItemPage";
import NewItemsPage from "./components/NewItemsPage/NewItems";
import TopRatedPage from "./components/ItemPage/TopRatedPage";
import CartPage from "./components/CartPage/CartPage";
import Order from "./components/Admin/Order";

// Import new payment status pages
import PaymentSuccess from "./components/CartPage/PaymentSuccess";
import PaymentCancel from "./components/CartPage/PaymentCancel";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/item/:id" element={<ItemPage />} />
      <Route path="/items" element={<NewItemsPage />} />
      <Route path="/top-rated" element={<TopRatedPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin/orders" element={<Order />} />

      {/* New routes for PayHere return */}
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/cancel" element={<PaymentCancel />} />
    </Routes>
  );
}

export default App;
