import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CategoryPage from "./components/CollectionPage/CollectionPage";
import ItemPage from "./components/ItemPage/ItemPage";
import NewItemsPage from "./components/NewItemsPage/NewItems";
import TopRatedPage from "./components/ItemPage/TopRatedPage";
import CartPage from "./components/CartPage/CartPage";

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
    </Routes>
  );
}

export default App;
