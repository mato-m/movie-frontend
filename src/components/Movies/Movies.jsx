import React, { useEffect, useState } from "react";
import styles from "./Movies.module.css";
import { FaFilm } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { Link } from "react-router-dom";
import apiURL from "../../config";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
const Movies = () => {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState(null);
  const [allLanguages, setAllLanguages] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [allServices, setAllServices] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const getAllMovies = async () => {
    try {
      const response = await fetch(apiURL + "/movies/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setMovies(data.data);
        setAllGenres(data.genres);
        setAllLanguages(data.languages);
        setAllServices(data.services);
      } else {
        setMessage("Couldn't get movies");
      }
    } catch (error) {
      setMessage("Couldn't get movies");
    }
  };
  useEffect(() => {
    getAllMovies();
  }, []);
  const filteredMovies = movies
    ? movies.filter((movie) => {
        const meetsGenreCriteria =
          selectedGenres.length === 0 ||
          movie.genres.some((genre) =>
            selectedGenres.some(
              (selectedGenre) => selectedGenre.value === genre.genre_id
            )
          );

        const meetsLanguageCriteria =
          selectedLanguages.length === 0 ||
          movie.languages.some((language) =>
            selectedLanguages.some(
              (selectedLanguage) => selectedLanguage.value === language.lang_id
            )
          );

        const meetsServiceCriteria =
          selectedServices.length === 0 ||
          movie.services.some((service) =>
            selectedServices.some(
              (selectedService) => selectedService.value === service.serv_id
            )
          );

        return (
          meetsGenreCriteria && meetsLanguageCriteria && meetsServiceCriteria
        );
      })
    : [];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className={styles.filterDiv}>
        {allGenres && (
          <MultiSelect
            disableSearch
            autoFocus={false}
            options={allGenres.map((genre) => ({
              value: genre.genre_id,
              label: genre.genre_name,
            }))}
            value={selectedGenres}
            onChange={setSelectedGenres}
            hasSelectAll={false}
          />
        )}
        {allLanguages && (
          <MultiSelect
            disableSearch
            autoFocus={false}
            options={allLanguages.map((language) => ({
              value: language.lang_id,
              label: language.lang_name,
            }))}
            value={selectedLanguages}
            onChange={setSelectedLanguages}
            hasSelectAll={false}
          />
        )}
        {allServices && (
          <MultiSelect
            disableSearch
            options={allServices.map((serv) => ({
              value: serv.serv_id,
              label: serv.serv_name,
            }))}
            value={selectedServices}
            onChange={setSelectedServices}
            hasSelectAll={false}
          />
        )}
      </div>
      <div className={styles.mainMoviesWrapper}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {filteredMovies.length > 0 ? (
              filteredMovies.map((v) => (
                <Link
                  to={"/movie/" + v.movie_id}
                  className={styles.itemWrapper}
                  key={v.movie_id}
                >
                  {v.movie_img === "movie.jpg" ? (
                    <FaFilm />
                  ) : (
                    <img src={apiURL + "/uploads/movies/" + v.movie_img} />
                  )}
                  <span>{v.movie_name + " (" + v.movie_year + ")"}</span>
                </Link>
              ))
            ) : (
              <span>No movies available</span>
            )}
          </>
        )}
      </div>
      {message !== null && (
        <MessageModal message={message} setMessage={setMessage} />
      )}
    </div>
  );
};

export default Movies;
