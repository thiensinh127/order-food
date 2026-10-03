import React, { useContext, useEffect, useRef } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContextDefinition";
import FoodItem from "../FoodItem/FoodItem";
import FoodItemSkeleton from "../FoodItem/FoodItemSkeleton";

const FoodDisplay = () => {
  const { food_list, hasMore, setPage, loading, foodError, retryFoodList } = useContext(StoreContext);
  const observerTarget = useRef(null);

  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !foodError) setPage((current) => current + 1);
    }, { threshold: 1 });
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loading, foodError, setPage]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item) => <FoodItem key={item._id} id={item._id} {...item} />)}
        {loading && [...Array(3)].map((_, index) => <FoodItemSkeleton key={`skeleton-${index}`} />)}
      </div>
      {foodError && <button type="button" onClick={retryFoodList}>{foodError} Retry</button>}
      {hasMore && <div ref={observerTarget} aria-hidden="true" style={{ height: 20 }} />}
    </div>
  );
};

export default FoodDisplay;
