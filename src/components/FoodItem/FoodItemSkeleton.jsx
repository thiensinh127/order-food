import React from "react";
import "./FoodItemSkeleton.css";

const FoodItemSkeleton = () => {
  return (
    <div className="food-item-skeleton">
      <div className="skeleton-image skeleton-pulse"></div>
      <div className="food-item-info-skeleton">
        <div className="food-item-name-rating" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton-text skeleton-title skeleton-pulse"></div>
          <div className="skeleton-text skeleton-rating skeleton-pulse"></div>
        </div>
        <div className="skeleton-text skeleton-desc skeleton-pulse"></div>
        <div className="skeleton-text skeleton-desc skeleton-desc-short skeleton-pulse"></div>
        <div className="skeleton-text skeleton-price skeleton-pulse"></div>
      </div>
    </div>
  );
};

export default FoodItemSkeleton;
