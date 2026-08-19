import "./Navbar.css";

function Navbar({ page, setPage, favoritesCount }) {
  return (
    <nav className="movie-navbar">
      <div className="nav-inner">
        <button
          className={`nav-item ${page === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${page === "favorites" ? "active" : ""}`}
          onClick={() => setPage("favorites")}
        >
          <span className="nav-icon">{page === "favorites" ? "♥" : "♡"}</span>

          <span>Favorites</span>

          {favoritesCount > 0 && (
            <span className="favorite-count">{favoritesCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
