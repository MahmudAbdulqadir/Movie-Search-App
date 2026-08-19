import "./CategorySidebar.css";

function CategorySidebar({
  categories,
  selectedCategory,
  onCategoryClick,
  loading,
}) {
  return (
    <aside className="category-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label">DISCOVER</span>

        <h2>Genres</h2>

        <p>Explore movies by category</p>
      </div>

      <div className="sidebar-categories">
        {loading ? (
          <div className="sidebar-loading">
            <div className="sidebar-loader"></div>
            <span>Loading...</span>
          </div>
        ) : (
          categories.map((category) => (
            <button
              key={category.id}
              className={`sidebar-category ${
                selectedCategory?.id === category.id
                  ? "sidebar-category-active"
                  : ""
              }`}
              onClick={() => onCategoryClick(category)}
            >
              <span className="sidebar-category-dot"></span>

              <span className="sidebar-category-name">{category.name}</span>

              <span className="sidebar-category-arrow">→</span>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-dot"></span>

        <span>Powered by TMDB</span>
      </div>
    </aside>
  );
}

export default CategorySidebar;
