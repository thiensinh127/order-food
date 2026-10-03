import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContextDefinition";
import { createOrderPayload } from "../../utils/orderPayload";
import BackButton from "../../components/BackButton/BackButton";
import "./PlaceOrder.css";

const DELIVERY_FEE = 2;
const initialAddress = { firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: "" };

const PlaceOrder = () => {
  const { getTotalCartAmount, token, cartFoodList, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState(initialAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const itemCount = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);

  const onChangeHandler = ({ target: { name, value } }) => setData((previous) => ({ ...previous, [name]: value }));

  const onPlaceOrder = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");
    try {
      const response = await axios.post(
        `${url}/api/order/create`,
        createOrderPayload({ items: cartFoodList, cartItems, address: data, subtotal }),
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.replace(response.data.session_url);
        return;
      }
      setSubmissionError("We couldn't start payment. Please try again.");
    } catch {
      setSubmissionError("We couldn't start payment. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token || subtotal === 0) navigate("/cart");
  }, [token, subtotal, navigate]);

  const field = (label, name, autoComplete, type = "text") => (
    <label>{label}<input required name={name} autoComplete={autoComplete} onChange={onChangeHandler} value={data[name]} type={type} /></label>
  );

  return (
    <form onSubmit={onPlaceOrder} className="place-order">
      <header className="checkout-heading">
        <BackButton fallback="/cart" label="Back to cart" />
        <p>CHECKOUT</p>
        <h1>Delivery details</h1>
        <ol aria-label="Checkout progress"><li>Cart</li><li className="current" aria-current="step">Delivery</li><li>Payment</li></ol>
      </header>
      <section className="place-order-left" aria-labelledby="delivery-title">
        <div className="checkout-section-heading"><div><p className="section-kicker">STEP 1 OF 2</p><h2 id="delivery-title">Where should we deliver?</h2></div><p>Fields marked required are needed for delivery.</p></div>
        <div className="multi-fields">{field("First name", "firstName", "given-name")}{field("Last name", "lastName", "family-name")}</div>
        {field("Email address", "email", "email", "email")}
        {field("Street address", "street", "street-address")}
        <div className="multi-fields">{field("City", "city", "address-level2")}{field("State / Province", "state", "address-level1")}</div>
        <div className="multi-fields">{field("Postal code", "zipcode", "postal-code")}{field("Country", "country", "country-name")}</div>
        {field("Phone number", "phone", "tel", "tel")}
      </section>
      <aside className="place-order-right" aria-labelledby="summary-title">
        <div className="order-summary">
          <div className="order-summary-heading"><div><p className="section-kicker">YOUR ORDER</p><h2 id="summary-title">Order summary</h2></div><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
          <div className="order-lines">{cartFoodList.filter((item) => cartItems[item._id] > 0).map((item) => <div key={item._id}><span>{item.name} × {cartItems[item._id]}</span><b>${item.price * cartItems[item._id]}</b></div>)}</div>
          <div className="summary-totals"><div><span>Subtotal</span><span>${subtotal}</span></div><div><span>Delivery</span><span>${deliveryFee}</span></div><div className="summary-total"><b>Total</b><b>${total}</b></div></div>
          {submissionError && <p className="submission-error" role="alert">{submissionError}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Opening secure payment…" : "Proceed to payment"}</button>
          <p className="secure-note">🔒 Secure checkout. You will be redirected to payment.</p>
        </div>
      </aside>
    </form>
  );
};

export default PlaceOrder;
