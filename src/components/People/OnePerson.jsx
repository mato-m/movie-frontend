import React, { useEffect, useState } from "react";
import { FaFilm, FaImdb, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import styles from "./People.module.css";
import apiURL from "../../config";
import MessageModal from "../MessageModal";
import Loading from "../Loading";

const OnePerson = () => {
  const { person_id } = useParams();
  const [personData, setPersonData] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const getPerson = async () => {
    try {
      const response = await fetch(apiURL + "/person/" + person_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setPersonData(data.person);
        setMovieData(data.movies);
      } else {
        setMessage("Couldn't get person");
      }
    } catch (error) {
      setMessage("Couldn't get person");
    }
  };
  useEffect(() => {
    getPerson();
  }, []);
  return (
    <div className={styles.onePersonWrapper}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {personData ? (
            <>
              {personData.pers_img == "actor.jpg" ? (
                <FaStar size={50} />
              ) : (
                <img src={apiURL + "/uploads/person/" + personData.pers_img} />
              )}
              <span>{personData.pers_fn + " " + personData.pers_ln}</span>

              {personData.pers_imdb && (
                <a
                  className={styles.linksWrapper}
                  target="_blank"
                  href={personData.pers_imdb}
                >
                  <FaImdb />
                </a>
              )}
              {movieData && movieData.length > 0 ? (
                <>
                  <span>Movies</span>
                  <div className={styles.actorMovies}>
                    {movieData.map((v, i) => (
                      <Link
                        className={styles.movieLink}
                        key={i}
                        to={"/movie/" + v.movie_id}
                      >
                        {v.movie_img == "movie.jpg" ? (
                          <FaFilm size={50} />
                        ) : (
                          <img
                            src={apiURL + "/uploads/movies/" + v.movie_img}
                          />
                        )}
                        {v.movie_name + " (" + v.movie_year + ")"}
                        <span>
                          {v.role === 0
                            ? "Actor"
                            : v.role === 1
                            ? "Producer"
                            : "Director"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <span>No movies</span>
              )}
            </>
          ) : (
            <span>No data</span>
          )}
        </>
      )}
      {message !== null && (
        <MessageModal message={message} setMessage={setMessage} />
      )}
    </div>
  );
};

export default OnePerson;
