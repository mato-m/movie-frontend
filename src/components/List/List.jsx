import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import { FaFilm, FaTimes } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
Modal.setAppElement("#root");
const List = () => {
  const params = useParams();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [message, setMessage] = useState(null);
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const getMoviesList = async () => {
    try {
      const response = await fetch(apiURL + "/lists/movies/" + params.list_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setMovies(data.movies);
      } else {
        setMessage("Couldn't get movies");
      }
    } catch (error) {
      setMessage("Couldn't get movies");
    }
  };
  const removeFromList = async (movie_id) => {
    try {
      const response = await fetch(apiURL + "/lists/remove", {
        method: "DELETE",
        body: JSON.stringify({
          lst_id: params.list_id,
          mov_id: movie_id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        getMoviesList();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove from list");
    } finally {
      setSelectedMovie(null);
      setDeleteModalOpen(false);
      enableBodyScroll("body");
    }
  };
  useEffect(() => {
    getMoviesList();
  }, []);

  return (
    <div className={styles.mainMoviesWrapper}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {movies && movies.length > 0 ? (
            movies.map((v) => (
              <Link
                to={"/movie/" + v.movie_id}
                className={styles.itemWrapper}
                key={v.movie_id}
              >
                <div
                  style={{ position: "absolute", top: 5, right: 5 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedMovie(v.movie_id);
                    setDeleteModalOpen(true);
                    disableBodyScroll("body");
                  }}
                >
                  <FaTimes size={16} />
                </div>
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

      {selectedMovie && (
        <Modal
          className={styles.deleteModal}
          isOpen={deleteModalOpen}
          onRequestClose={() => {
            setDeleteModalOpen(false);
            setSelectedMovie(null);
            enableBodyScroll("body");
          }}
        >
          <span>Are you sure you want to remove movie from list?</span>
          <button
            autoFocus
            onClick={() => {
              removeFromList(selectedMovie);
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedMovie(null);
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

export default List;
