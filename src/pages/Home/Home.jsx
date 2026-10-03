import React, { useContext } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import { StoreContext } from "../../context/StoreContext";
const Home = () => {
  const { category, selectCategory } = useContext(StoreContext);
  return (
    <div className="home">
      <Header />
      <ExploreMenu category={category} setCategory={selectCategory} />
      <FoodDisplay />
      <AppDownload />
    </div>
  );
};

export default Home;
