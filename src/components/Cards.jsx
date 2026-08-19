import "./Card.css";
function MovieCard({ movie, onInfo, onFavorite, isFavorite }) {
  const poster = movie.Poster !== "N/A" ? movie.Poster : "/placeholder.jpg";

  const watchTrailer = () => {
    const query = encodeURIComponent(`${movie.Title} trailer`);
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank",
    );
  };

  return (
    <article className="movie-card">
      {/* Poster */}
      <div className="movie-poster-wrapper">
        <img src={poster} alt={movie.Title} className="movie-poster" />

        <div className="poster-gradient"></div>

        <span className="movie-type">{movie.Type}</span>

        <button
          className={`favorite-btn ${isFavorite ? "favorite-active" : ""}`}
          onClick={() => onFavorite(movie)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <div className="poster-bottom">
          <span className="rating">⭐ {movie.imdbRating || "N/A"}</span>

          <span className="year">{movie.Year}</span>
        </div>
      </div>

      {/* Information */}
      <div className="movie-content">
        <h2 className="movie-title">{movie.Title}</h2>

        <div className="movie-details">
          <span>{movie.Runtime || "N/A"}</span>
          <span>•</span>
          <span>{movie.Genre || "Unknown Genre"}</span>
        </div>

        <p className="movie-plot">
          {movie.Plot && movie.Plot !== "N/A"
            ? movie.Plot
            : "No description available for this movie."}
        </p>

        {/* Buttons */}
        <div className="movie-footer">
          <button className="watch-btn" onClick={watchTrailer}>
            ▶ Watch Trailer
          </button>

          <button className="info-btn" onClick={() => onInfo(movie)}>
            + Info
          </button>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
