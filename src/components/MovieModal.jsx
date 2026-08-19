import { useEffect, useState } from "react";
import "./MovieModal.css";

function MovieModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "16f4abd";

  useEffect(() => {
    if (!movie?.imdbID) return;

    const getMovieDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`,
        );

        const data = await response.json();

        if (data.Response === "True") {
          setDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovieDetails();
  }, [movie]);

  if (!movie) return null;

  const currentMovie = details || movie;

  const poster =
    currentMovie.Poster && currentMovie.Poster !== "N/A"
      ? currentMovie.Poster
      : "/placeholder.jpg";

  const watchTrailer = () => {
    const query = encodeURIComponent(
      `${currentMovie.Title} ${currentMovie.Year} official trailer`,
    );

    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank",
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="movie-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="close-modal" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Hero */}
        <div className="modal-hero">
          <img
            src={poster}
            alt={currentMovie.Title}
            className="modal-backdrop"
          />

          <div className="modal-backdrop-overlay"></div>

          <div className="modal-poster-container">
            <img
              src={poster}
              alt={currentMovie.Title}
              className="modal-poster"
            />
          </div>

          <div className="modal-hero-content">
            <span className="modal-type">{currentMovie.Type || "Movie"}</span>

            <h2>{currentMovie.Title}</h2>

            <div className="modal-meta">
              <span className="modal-rating">
                ⭐ {currentMovie.imdbRating || "N/A"}
              </span>

              <span>{currentMovie.Year || "N/A"}</span>

              <span>{currentMovie.Runtime || "N/A"}</span>

              <span>{currentMovie.Rated || "NR"}</span>
            </div>

            <div className="modal-genres">
              {currentMovie.Genre &&
                currentMovie.Genre !== "N/A" &&
                currentMovie.Genre.split(", ").map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
            </div>

            <button className="modal-watch-btn" onClick={watchTrailer}>
              ▶ Watch Trailer
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">
              <div className="loader"></div>
              <p>Loading movie details...</p>
            </div>
          ) : (
            <>
              {/* Plot */}
              <section className="modal-section">
                <h3>Overview</h3>

                <p className="modal-plot">
                  {currentMovie.Plot && currentMovie.Plot !== "N/A"
                    ? currentMovie.Plot
                    : "No plot available."}
                </p>
              </section>

              {/* People */}
              <section className="movie-people">
                <div className="person">
                  <span>Director</span>
                  <strong>
                    {currentMovie.Director && currentMovie.Director !== "N/A"
                      ? currentMovie.Director
                      : "Unknown"}
                  </strong>
                </div>

                <div className="person">
                  <span>Writer</span>
                  <strong>
                    {currentMovie.Writer && currentMovie.Writer !== "N/A"
                      ? currentMovie.Writer
                      : "Unknown"}
                  </strong>
                </div>

                <div className="person">
                  <span>Actors</span>
                  <strong>
                    {currentMovie.Actors && currentMovie.Actors !== "N/A"
                      ? currentMovie.Actors
                      : "Unknown"}
                  </strong>
                </div>
              </section>

              {/* Extra information */}
              <section className="movie-extra">
                <div>
                  <span>Released</span>
                  <strong>{currentMovie.Released || "N/A"}</strong>
                </div>

                <div>
                  <span>Language</span>
                  <strong>{currentMovie.Language || "N/A"}</strong>
                </div>

                <div>
                  <span>Country</span>
                  <strong>{currentMovie.Country || "N/A"}</strong>
                </div>

                <div>
                  <span>Awards</span>
                  <strong>{currentMovie.Awards || "N/A"}</strong>
                </div>

                <div>
                  <span>Box Office</span>
                  <strong>{currentMovie.BoxOffice || "N/A"}</strong>
                </div>

                <div>
                  <span>Metascore</span>
                  <strong>{currentMovie.Metascore || "N/A"}</strong>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
