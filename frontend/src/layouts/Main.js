import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";

import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
 import ListingGrid from "./ListingGrid";
import DetailProduct from "./DetailProduct";
import SearchResults from "../pages/product/SearchResults";
import CartPage from "../pages/cart/Cart";
import CheckoutPage from "../pages/cart/Checkout";
import CheckoutSuccessPage from "../pages/cart/CheckoutSuccess";
import { Favorite, Logout } from "@mui/icons-material";
import FavoritePage from "../pages/cart/Favorite";
import Logoutpage from "../pages/logout/Logout";



const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Detail" element={<DetailProduct />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Register" element={<UserRegister />} />
      <Route path="/ListingGrid" element={<ListingGrid />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkoutsuccess" element={<CheckoutSuccessPage />} />
      <Route path="/favorite" element={<FavoritePage />} />
      <Route path="/logout" element={<Logoutpage />} />
    </Routes>
  </main>
);

export default Main;
