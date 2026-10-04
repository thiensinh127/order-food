import React from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br />
        Tomato App{" "}
      </p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="play-store" width={216} height={69} />
        <img src={assets.app_store} alt="app-store" width={199} height={69} />
      </div>
    </div>
  );
};

export default AppDownload;
