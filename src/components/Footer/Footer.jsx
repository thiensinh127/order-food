import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <a href="/" aria-label="Food Sinh home">
            <img src={assets.logo} alt="Food Sinh" />
          </a>
          <p>
            Food Sinh makes discovering great food, ordering in seconds, and
            tracking your delivery effortless.
          </p>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:0965356603">0965356603</a></li>
            <li><a href="mailto:thiensinh127@gmail.com">thiensinh127@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        © 2026 Food Sinh. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
