import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContextDefinition";
import { shouldShowFloatingCart } from "../../utils/navigation";
const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");

  const { token, setToken, cartItemCount } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li><Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link></li>
        <li><a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a></li>
        <li><a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a></li>
        <li><a href="#footer" onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>contact us</a></li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        {!token ? (
          <button onClick={() => setShowLogin(true)}>signin</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="bag" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
      {cartItemCount > 0 && shouldShowFloatingCart(location.pathname) && (
        <div className="floating-cart" data-cart-target>
          <Link to="/cart">
            <img src={assets.basket_icon} alt="cart-icon" />
          </Link>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
