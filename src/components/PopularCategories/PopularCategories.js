import React from 'react';
import './PopularCategories.css';

const PopularCategories = () => {
  const categories = [
    { name: "고기", icon: "🍖" },
    { name: "해산물", icon: "🐟" },
    { name: "한식", icon: "🍚" },
    { name: "양식", icon: "🍝" },
    { name: "중식", icon: "🍜" },
    { name: "해장", icon: "🍲" },
    { name: "웰빙/비건", icon: "🥗" },
    { name: "맥주", icon: "🍺" },
  ];

  return (
    <div className="categories-container">
      <h2 className="categories-title">인기 카테고리</h2>
      <div className="category-grid">
        {categories.map((category, index) => (
          <div key={index} className="category-item">
            <div className="category-icon-placeholder">{category.icon}</div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
