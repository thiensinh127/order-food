import React from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContextDefinition";
import { animateProductToCart } from "../../utils/cartFlight";
const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, clearFromCart, url } =
    React.useContext(StoreContext);
  const imageRef = React.useRef(null);

  const handleAddToCart = () => {
    addToCart(id, { _id: id, name, price, description, image });
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        animateProductToCart(imageRef.current, document.querySelector("[data-cart-target]"));
      });
    });
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <button type="button" className="food-item-image-button" onClick={handleAddToCart} aria-label={`Add ${name} to cart`}>
          <img ref={imageRef} className="food-item-image" src={url + "/images/" + image} alt={name} />
        </button>
        {!cartItems[id] ? (
          <img
            className="add"
            src={assets.add_icon_white}
            alt="add"
            onClick={handleAddToCart}
          />
        ) : (
          <div className="food-item-counter">
            <img
              src={assets.remove_icon_red}
              alt="minus"
              onClick={() => removeFromCart(id)}
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              alt="add"
              onClick={handleAddToCart}
            />
            <button type="button" className="food-item-clear" onClick={() => clearFromCart(id)} aria-label={`Remove ${name} from cart`}>×</button>
          </div>
        )}
      </div>
      <div className="foo-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="start" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
