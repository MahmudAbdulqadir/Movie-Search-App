import "./SearchBar.css";

function SearchBar({ search, setSearch, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (search.trim()) {
      onSearch();
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="search-container">
      <form className="search-box" onSubmit={handleSubmit}>
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search movies, series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button type="button" className="clear-search" onClick={clearSearch}>
            ×
          </button>
        )}

        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <p className="search-hint">
        Press <kbd>Enter</kbd> to search
      </p>
    </div>
  );
}

export default SearchBar;
