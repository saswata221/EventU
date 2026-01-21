const axios = require("axios");
const { Pool } = require("pg");
// require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "MoviesDB",
  password: "postgre123",
  port: 5432,
});

const API_KEY = "33b21b362765226d66343068ce3b7107";

//Fetching movie data from api
async function getMovieDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
  const res = await axios.get(url);
  return res.data;
}
//Fetching cast data  from api
async function getCast(movieId) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    return res.data.cast.slice(0, 5).map((actor) => actor.name);
  } catch (err) {
    console.error("Cast fetch error:", err.message);
    return [];
  }
}

//insertinig datas into postgres
async function fetchAndInsertMovies() {
  try {
    await pool.query("DELETE FROM current_movies");

    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&region=IN`
    );

    const movies = res.data.results;

    for (const movie of movies) {
      const details = await getMovieDetails(movie.id);
      const castNames = await getCast(movie.id);

      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      const backdropUrl = `https://image.tmdb.org/t/p/original${details.backdrop_path}`;
      const genres = details.genres.map((g) => g.name);
      await pool.query(
        `INSERT INTO current_movies (
          tmdb_id, title, overview, release_date, poster_url, backdrop_url,
          rating, vote_count, duration, genres, is_adult, likes, casts
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (tmdb_id) DO NOTHING`,
        [
          movie.id,
          movie.title,
          movie.overview,
          movie.release_date,
          posterUrl,
          backdropUrl,
          movie.vote_average,
          details.vote_count,
          details.runtime,
          genres,
          details.adult,
          Math.floor(movie.popularity),
          castNames,
        ]
      );
    }

    console.log("Movies inserted successfully!");
    pool.end();
  } catch (err) {
    console.error("Error fetching/inserting movies:", err.message);
  }
}

fetchAndInsertMovies();
