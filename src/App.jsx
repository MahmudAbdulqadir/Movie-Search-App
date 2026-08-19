import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Card from "./components/Cards";
import MovieModal from "./components/MovieModal";
import CategorySidebar from "./components/CategorySidebar";

import "./App.css";

function App() {
  const OMDB_API_KEY = "16f4abd";
  const TMDB_API_KEY = "f3c58068ce7edc74c457fd0f26ea1e2d";

  // ================================
  // STATE
  // ================================

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [page, setPage] = useState("home");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("movieFavorites");

    return saved ? JSON.parse(saved) : [];
  });

  // TMDB categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // ================================
  // RANDOM FEATURED MOVIES
  // ================================

  const movieCategories = [
    "avengers",
    "batman",
    "spider",
    "star",
    "war",
    "love",
    "night",
    "dark",
    "man",
    "girl",
    "world",
    "life",
    "dead",
    "home",
    "last",
    "future",
    "time",
    "city",
    "king",
    "american",
  ];

  // ================================
  // GET FULL OMDB DETAILS
  // ================================

  const getMovieDetails = async (moviesList) => {
    const detailedMovies = await Promise.all(
      moviesList.map(async (movie) => {
        try {
          if (!movie.imdbID) return null;

          const response = await fetch(
            `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=full`,
          );

          const data = await response.json();

          if (data.Response === "True") {
            return data;
          }

          return null;
        } catch (error) {
          console.error("Movie details error:", error);

          return null;
        }
      }),
    );

    return detailedMovies.filter(Boolean);
  };

  // ================================
  // GET TMDB IMDb ID
  // ================================

  const getIMDbIdFromTMDB = async (tmdbMovieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${tmdbMovieId}/external_ids?api_key=${TMDB_API_KEY}`,
      );

      const data = await response.json();

      return data.imdb_id || null;
    } catch (error) {
      console.error("TMDB external ID error:", error);

      return null;
    }
  };

  // ================================
  // LOAD TMDB CATEGORIES
  // ================================

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`,
        );

        const data = await response.json();

        if (data.genres) {
          setCategories(data.genres);
        } else {
          console.error("TMDB category error:", data);
        }
      } catch (error) {
        console.error("Category error:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // ================================
  // RANDOM FEATURED MOVIES
  // ================================

  useEffect(() => {
    const loadRandomMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const randomCategory =
          movieCategories[Math.floor(Math.random() * movieCategories.length)];

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
            randomCategory,
          )}&type=movie&page=1`,
        );

        const data = await response.json();

        if (data.Response !== "True" || !data.Search) {
          setError("Could not load featured movies.");

          return;
        }

        const shuffledMovies = [...data.Search].sort(() => Math.random() - 0.5);

        const selectedMovies = shuffledMovies.slice(0, 8);

        const detailedMovies = await getMovieDetails(selectedMovies);

        setMovies(detailedMovies);
      } catch (err) {
        console.error(err);

        setError("Could not load featured movies.");
      } finally {
        setLoading(false);
      }
    };

    loadRandomMovies();
  }, []);

  // ================================
  // LOAD CATEGORY MOVIES
  // ================================

  const handleCategoryClick = async (category) => {
    try {
      setSelectedCategory(category);

      setSearch("");

      setMovies([]);

      setError("");

      setLoading(true);

      setPage("home");

      setSelectedMovie(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // --------------------------------
      // TMDB DISCOVER
      // --------------------------------

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${category.id}&sort_by=popularity.desc&language=en-US&page=1`,
      );

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setError(`No movies found in ${category.name}.`);

        return;
      }

      // --------------------------------
      // GET TMDB MOVIES
      // --------------------------------

      const tmdbMovies = data.results.slice(0, 12);

      // --------------------------------
      // GET IMDb IDs
      // --------------------------------

      const imdbMovies = await Promise.all(
        tmdbMovies.map(async (movie) => {
          const imdbID = await getIMDbIdFromTMDB(movie.id);

          if (!imdbID) {
            return null;
          }

          return {
            imdbID,
          };
        }),
      );

      const validIMDbMovies = imdbMovies.filter(Boolean);

      // --------------------------------
      // GET FULL OMDB INFORMATION
      // --------------------------------

      const detailedMovies = await getMovieDetails(validIMDbMovies);

      setMovies(detailedMovies);

      if (detailedMovies.length === 0) {
        setError(
          `We couldn't find OMDb information for the ${category.name} movies.`,
        );
      }
    } catch (err) {
      console.error("Category movies error:", err);

      setError("Could not load this category.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // NAVIGATION
  // ================================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    setError("");

    setSelectedMovie(null);

    if (newPage === "home") {
      setSelectedCategory(null);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================================
  // FAVORITES
  // ================================

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.imdbID === movie.imdbID);

      const updated = exists
        ? prev.filter((item) => item.imdbID !== movie.imdbID)
        : [...prev, movie];

      localStorage.setItem("movieFavorites", JSON.stringify(updated));

      return updated;
    });
  };

  // ================================
  // SEARCH
  // ================================

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("Please enter a movie name.");

      return;
    }

    try {
      setLoading(true);

      setError("");

      setMovies([]);

      setSelectedCategory(null);

      setPage("home");

      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
          search.trim(),
        )}&type=movie`,
      );

      const data = await response.json();

      if (data.Response === "True" && data.Search) {
        const detailedMovies = await getMovieDetails(data.Search);

        setMovies(detailedMovies);

        if (detailedMovies.length === 0) {
          setError("No detailed movie information was found.");
        }
      } else {
        setError(data.Error || "No movies found.");
      }
    } catch (err) {
      console.error(err);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // HOME PAGE
  // ================================

  const renderHome = () => {
    const isSearching = search.trim() !== "";

    return (
      <>
        {/* HERO */}

        <header className="hero">
          <div className="hero-badge">
            <span></span>
            MOVIE DISCOVERY
          </div>

          <h1>
            Find your next
            <strong> obsession.</strong>
          </h1>

          <p>Discover movies and series you'll want to watch tonight.</p>
        </header>

        {/* SEARCH */}

        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
        />

        {/* LOADING */}

        {loading && (
          <div className="loading-container">
            <div className="app-loader"></div>

            <p>
              {selectedCategory
                ? `Finding the best ${selectedCategory.name} movies...`
                : isSearching
                  ? "Searching the movie universe..."
                  : "Discovering movies for you..."}
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="error-message">
            <span>😕</span>

            <div>
              <strong>Nothing found</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* RESULTS HEADER */}

        {!loading && movies.length > 0 && (
          <div className="results-header">
            <div>
              <span>
                {selectedCategory
                  ? "GENRE COLLECTION"
                  : isSearching
                    ? "SEARCH RESULTS"
                    : "FEATURED MOVIES"}
              </span>

              <h2>
                {selectedCategory ? (
                  <>
                    {selectedCategory.name} <strong>movies.</strong>
                  </>
                ) : isSearching ? (
                  <>
                    Movies for <strong>"{search}"</strong>
                  </>
                ) : (
                  <>
                    Movies worth <strong>watching.</strong>
                  </>
                )}
              </h2>
            </div>

            <p>
              {movies.length} {movies.length === 1 ? "movie" : "movies"}
            </p>
          </div>
        )}

        {/* MOVIES */}

        {!loading && movies.length > 0 && (
          <main className="movie-grid">
            {movies.map((movie) => (
              <Card
                key={movie.imdbID}
                movie={movie}
                onInfo={setSelectedMovie}
                onFavorite={toggleFavorite}
                isFavorite={favorites.some(
                  (item) => item.imdbID === movie.imdbID,
                )}
              />
            ))}
          </main>
        )}

        {/* EMPTY STATE */}

        {!loading && !error && movies.length === 0 && (
          <section className="empty-state">
            <div className="empty-icon">🎬</div>

            <h2>Your next movie is out there.</h2>

            <p>Search for a movie, actor, or series to get started.</p>
          </section>
        )}
      </>
    );
  };

  // ================================
  // FAVORITES PAGE
  // ================================

  const renderFavorites = () => {
    return (
      <section className="favorites-page">
        <div className="page-heading">
          <span className="section-label">YOUR COLLECTION</span>

          <h1>My Favorites</h1>

          <p>
            {favorites.length === 0
              ? "Movies you love will appear here."
              : `${favorites.length} ${
                  favorites.length === 1 ? "movie" : "movies"
                } saved to your collection.`}
          </p>
        </div>

        {favorites.length === 0 && (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">♡</div>

            <h2>Your collection is empty.</h2>

            <p>Find something you love and save it here.</p>

            <button
              className="discover-btn"
              onClick={() => handlePageChange("home")}
            >
              Discover Movies
              <span>→</span>
            </button>
          </div>
        )}

        {favorites.length > 0 && (
          <main className="movie-grid favorites-grid">
            {favorites.map((movie) => (
              <Card
                key={movie.imdbID}
                movie={movie}
                onInfo={setSelectedMovie}
                onFavorite={toggleFavorite}
                isFavorite={true}
              />
            ))}
          </main>
        )}
      </section>
    );
  };

  // ================================
  // APP
  // ================================

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>

      <div className="background-glow glow-two"></div>

      <Navbar
        page={page}
        setPage={handlePageChange}
        favoritesCount={favorites.length}
      />

      {/* ==================================
          CATEGORY SIDEBAR
      ================================== */}

      {page === "home" && (
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
          loading={categoriesLoading}
        />
      )}

      {/* ==================================
          PAGES
      ================================== */}

      {page === "home" && renderHome()}

      {page === "favorites" && renderFavorites()}

      {/* ==================================
          MOVIE MODAL
      ================================== */}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* ==================================
          FOOTER
      ================================== */}

      <footer className="footer">
        <p>Built with React • Powered by OMDb + TMDB</p>
      </footer>
    </div>
  );
}

export default App;
