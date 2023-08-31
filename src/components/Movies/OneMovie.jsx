import React, { useEffect, useRef, useState } from "react";
import { FaFilm, FaImdb, FaStar, FaTimes, FaYoutube } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import styles from "./Movies.module.css";
import Rating from "react-rating";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";

Modal.setAppElement("#root");

const OneMovie = () => {
  const getDefaultListId = (liste) => {
    const defaultList = liste.find((v) => !v.contains_movie);
    return defaultList ? defaultList.lst_id : liste[0].lst_id;
  };
  const [addToListModal, setAddToListModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { movie_id } = useParams();
  const [message, setMessage] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [myRating, setMyRating] = useState(null);
  const [watched, setWatched] = useState(null);
  const [liste, setListe] = useState(null);
  const selectedListRef = useRef(null);
  const usr_id = jwtDecode(localStorage.getItem("token")).usr_id;
  const getMovie = async () => {
    try {
      const response = await fetch(apiURL + "/movies/" + movie_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setWatched(data.data.is_watched);
        setMyRating(data.data.user_rating);
        setMovieData(data.data);
      } else {
        setMessage("Couldn't get movie");
      }
    } catch (error) {
      setMessage("Couldn't get movie");
    }
  };
  const addToList = async () => {
    try {
      const response = await fetch(apiURL + "/lists/add", {
        method: "POST",
        body: JSON.stringify({
          lst_id: selectedListRef.current.value,
          mov_id: movie_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllLists();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add to list");
    } finally {
      setAddToListModalOpen(false);
      enableBodyScroll("body");
    }
  };
  const addRating = async (rating) => {
    try {
      const response = await fetch(apiURL + "/ratings/", {
        method: "POST",
        body: JSON.stringify({
          rating_user_id: usr_id,
          rating_movie_id: movie_id,
          rating,
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        getMovie();
        setMyRating(rating);
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't rate movie");
    }
  };

  const addToWatched = async () => {
    try {
      const response = await fetch(
        apiURL + "/watched/" + usr_id + "/" + movie_id,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        setWatched(true);
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add to watched");
    }
  };
  const removeRating = async (rating) => {
    try {
      const response = await fetch(apiURL + "/ratings/", {
        method: "DELETE",
        body: JSON.stringify({
          rating_user_id: usr_id,
          rating_movie_id: movie_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        getMovie();
        setMyRating(null);
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove rating");
    }
  };

  const removeWatched = async () => {
    try {
      const response = await fetch(
        apiURL + "/watched/" + usr_id + "/" + movie_id,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        setWatched(false);
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove from watched");
    }
  };
  const getAllLists = async () => {
    try {
      const response = await fetch(
        apiURL + "/lists/" + usr_id + "/" + movie_id,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        setListe(data.lists);
      } else {
        setMessage("Couldn't get lists");
      }
    } catch (error) {
      setMessage("Couldn't get lists");
    }
  };
  useEffect(() => {
    getMovie();
    getAllLists();
  }, []);
  return (
    <div className={styles.onePersonWrapper}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {movieData ? (
            <>
              {movieData.movie_img == "movie.jpg" ? (
                <FaFilm size={50} />
              ) : (
                <img src={apiURL + "/uploads/movies/" + movieData.movie_img} />
              )}
              <span className={styles.personSpan}>
                {movieData.movie_name + " (" + movieData.movie_year + ")"}
              </span>
              <button
                className={styles.watchedBtn}
                onClick={() => {
                  watched ? removeWatched() : addToWatched();
                }}
              >
                {watched ? "Unm" : "M"}ark as watched
              </button>
              {liste && liste.some((v) => !v.contains_movie) && (
                <button
                  className={styles.watchedBtn}
                  onClick={() => {
                    setAddToListModalOpen(true);
                    disableBodyScroll("body");
                  }}
                >
                  Add to list
                </button>
              )}
              {movieData.average_rating && (
                <span className={styles.personSpan}>
                  {"Average rating: " +
                    parseFloat(movieData.average_rating).toFixed(2)}
                </span>
              )}
              <span>My rating: {myRating}</span>
              <div className={styles.ratingDiv}>
                <Rating
                  fractions={2}
                  initialRating={myRating ? myRating : 0}
                  onChange={(e) => {
                    addRating(e);
                  }}
                  style={{ maxWidth: 180 }}
                  emptySymbol={<FaStar />}
                  fullSymbol={<FaStar color="gold" />}
                />
                {myRating && <FaTimes onClick={removeRating} />}
              </div>
              <div className={styles.linksWrapper}>
                {movieData.movie_imdb && (
                  <a href={movieData.movie_imdb} target="_blank">
                    <FaImdb />
                  </a>
                )}
                {movieData.movie_trailer && (
                  <a href={movieData.movie_trailer} target="_blank">
                    <FaYoutube />
                  </a>
                )}
              </div>
              {movieData.genres && movieData.genres.length > 0 && (
                <>
                  <span>Genres</span>
                  <div className={styles.actorMovies}>
                    {movieData.genres.map((v, i) => (
                      <div className={styles.movieLink} key={i}>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {movieData.languages && movieData.languages.length > 0 && (
                <>
                  <span>Languages</span>
                  <div className={styles.actorMovies}>
                    {movieData.languages.map((v, i) => (
                      <div className={styles.movieLink} key={i}>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {movieData.services && movieData.services.length > 0 && (
                <>
                  <span>Services</span>
                  <div className={styles.actorMovies}>
                    {movieData.services.map((v, i) => (
                      <div className={styles.movieLink} key={i}>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {movieData.persons && movieData.persons.length > 0 && (
                <>
                  <span>People</span>
                  <div className={styles.actorMovies}>
                    {movieData.persons.map((v, i) => (
                      <Link to={"/people/" + v.pers_id} key={i}>
                        {v.pers_img === "actor.jpg" ? (
                          <FaStar />
                        ) : (
                          <img src={apiURL + "/uploads/person/" + v.pers_img} />
                        )}
                        <div style={{ textAlign: "center" }}>
                          <span>{v.pers_fn + " " + v.pers_ln}</span>
                          <br />
                          <span>
                            {v.role == 0
                              ? "Actor"
                              : v.role == 1
                              ? "Producer"
                              : "Director"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span>No data</span>
          )}
        </>
      )}

      {liste && (
        <Modal
          className={styles.deleteModal}
          isOpen={addToListModal}
          onRequestClose={() => {
            setAddToListModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          {liste && liste.some((v) => !v.contains_movie) ? (
            <>
              <select
                defaultValue={getDefaultListId(liste)}
                ref={selectedListRef}
              >
                {liste.map((v) => (
                  <option
                    key={v.lst_id}
                    value={v.lst_id}
                    disabled={v.contains_movie}
                  >
                    {v.lst_name}
                  </option>
                ))}
              </select>
              <button autoFocus onClick={addToList}>
                Add
              </button>
            </>
          ) : (
            <span>No available lists</span>
          )}
          <button
            onClick={() => {
              setAddToListModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
      )}
      {message !== null && (
        <MessageModal message={message} setMessage={setMessage} />
      )}
    </div>
  );
};

export default OneMovie;
