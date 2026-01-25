import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import FoodItemSkeleton from "../FoodItem/FoodItemSkeleton";

const FoodDisplay = ({ category }) => {
  const { food_list, hasMore, setPage, loading } = useContext(StoreContext);
  const observerTarget = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading, setPage]);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || item.category === category) {
            return <FoodItem key={index} id={item._id} {...item} />;
          }
        })}
        {loading && (
            <>
              {[...Array(3)].map((_, index) => (
                  <FoodItemSkeleton key={`skeleton-${index}`} />
              ))}
            </>
        )}
      </div>
      {hasMore && (
        <div ref={observerTarget} style={{ height: "20px", margin: "10px 0" }}>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
