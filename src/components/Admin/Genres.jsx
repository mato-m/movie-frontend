import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
Modal.setAppElement("#root");

const Genres = () => {
  const addGenreRef = useRef(null);
  const editGenreRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [genres, setGenres] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [editGenreModal, setEditGenreModal] = useState(false);
  const [removeGenreModal, setRemoveGenreModal] = useState(false);
  const [addGenreModal, setAddGenreModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const getAllGenres = async () => {
    try {
      const response = await fetch(apiURL + "/genres/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setGenres(data.genres);
      } else setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't get genres");
    }
  };
  useEffect(() => {
    getAllGenres();
  }, []);

  const addGenre = async () => {
    try {
      const response = await fetch(apiURL + "/genres/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          genre_name: addGenreRef.current.value,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      if (data.status == 0) {
        getAllGenres();
      }
    } catch (error) {
      setMessage("Couldn't add genre");
    } finally {
      setAddGenreModal(false);
      enableBodyScroll("body");
    }
  };
  const editGenre = async () => {
    try {
      const response = await fetch(
        apiURL + "/genres/" + selectedGenre.genre_id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            genre_name: editGenreRef.current.value,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllGenres();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit genre");
    } finally {
      setSelectedGenre(null);
      setEditGenreModal(false);
      enableBodyScroll("body");
    }
  };
  const removeGenre = async () => {
    try {
      const response = await fetch(
        apiURL + "/genres/" + selectedGenre.genre_id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllGenres();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove genre");
    } finally {
      setSelectedGenre(null);
      setRemoveGenreModal(false);
      enableBodyScroll("body");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.adminWrapper}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {genres && genres.length > 0 ? (
              <div className={styles.listWrapper}>
                {genres.map((v) => (
                  <div className={styles.listItemWrapper} key={v.genre_id}>
                    <span>{v.genre_name}</span>
                    <div>
                      <FaPen
                        onClick={() => {
                          setSelectedGenre(v);
                          setEditGenreModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => {
                          setSelectedGenre(v);
                          setRemoveGenreModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No genres</div>
            )}
          </>
        )}
        <button
          onClick={() => {
            setAddGenreModal(true);
            disableBodyScroll("body");
          }}
        >
          Add genre
        </button>
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addGenreModal}
        onRequestClose={() => {
          setAddGenreModal(false);
          enableBodyScroll("body");
        }}
      >
        <input
          type="text"
          autoFocus
          ref={addGenreRef}
          placeholder="Genre name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addGenre();
            }
          }}
        />
        <button onClick={addGenre}>Add genre</button>
        <button
          onClick={() => {
            setSelectedGenre(null);
            setAddGenreModal(false);
            enableBodyScroll("body");
          }}
        >
          Close
        </button>
      </Modal>
      {selectedGenre && (
        <>
          <Modal
            className={styles.deleteModal}
            isOpen={editGenreModal}
            onRequestClose={() => {
              setSelectedGenre(null);
              setEditGenreModal(false);
              enableBodyScroll("body");
            }}
          >
            <input
              autoFocus
              type="text"
              ref={editGenreRef}
              placeholder="Genre name"
              defaultValue={selectedGenre.genre_name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editGenre();
                }
              }}
            />
            <button onClick={editGenre}>Edit genre</button>
            <button
              onClick={() => {
                setSelectedGenre(null);
                setEditGenreModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>
          <Modal
            className={styles.deleteModal}
            isOpen={removeGenreModal}
            onRequestClose={() => {
              setSelectedGenre(null);
              setRemoveGenreModal(false);
              enableBodyScroll("body");
            }}
          >
            Are you sure you want to remove genre?
            <button autoFocus onClick={removeGenre}>
              Yes
            </button>
            <button
              onClick={() => {
                setRemoveGenreModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>
        </>
      )}
      {message !== null && (
        <MessageModal message={message} setMessage={setMessage} />
      )}
    </div>
  );
};

export default Genres;
