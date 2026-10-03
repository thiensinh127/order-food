import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContextDefinition";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";

const Cart = () => {
  const { cartItems, cartFoodList, clearFromCart, getTotalCartAmount, url } =
    useContext(StoreContext);

  const navigate = useNavigate();
  const itemCount = Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);

  return (
    <div className="cart">
      <div className="cart-heading">
        <div>
          <BackButton label="Back to menu" />
          <p className="cart-eyebrow">YOUR ORDER</p>
          <h1>Shopping cart</h1>
        </div>
        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
      </div>
      <div className="cart-items cart-panel">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />
        {cartFoodList.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + "/images/" + item.image} alt={item.name} />
                  <p data-label="Title">{item.name}</p>
                  <p data-label="Price">${item.price}</p>
                  <p data-label="Quantity">{cartItems[item._id]}</p>
                  <p data-label="Total">${cartItems[item._id] * item.price}</p>
                  <button
                    type="button"
                    onClick={() => clearFromCart(item._id)}
                    className="cart-remove"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total cart-summary">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="button" onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, Enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button type="button">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
