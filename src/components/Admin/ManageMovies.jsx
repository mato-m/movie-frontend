import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import { FaPen, FaFilm, FaTrashAlt, FaTimes, FaImage } from "react-icons/fa";
import Modal from "react-modal";
import { MultiSelect } from "react-multi-select-component";
import Toggle from "react-toggle";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";

Modal.setAppElement("#root");
const ManageMovies = () => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const addMovie = async () => {
    const genresArr = selectedGenres.map((option) => option.value);
    const languagesArr = selectedLanguages.map((option) => option.value);
    const servicesArr = selectedServices.map((option) => option.value);
    const actorsArr = selectedActors.map((option) => option.value);
    const directorsArr = selectedDirectors.map((option) => option.value);
    const producersArr = selectedProducers.map((option) => option.value);
    try {
      const formData = new FormData();
      formData.append("movie_name", addNameRef.current.value);
      formData.append("movie_year", addYearRef.current.value);
      formData.append("movie_imdb", addIMDBRef.current.value);
      formData.append("movie_trailer", addTrailerRef.current.value);
      formData.append("movie_img", selectedImage);
      formData.append("genres", genresArr);
      formData.append("languages", languagesArr);
      formData.append("services", servicesArr);
      formData.append("actors", actorsArr);
      formData.append("producers", producersArr);
      formData.append("directors", directorsArr);
      const response = await fetch(apiURL + "/movies/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllMovies();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add movie");
    } finally {
      setSelectedImage(null);
      setSelectedGenres([]);
      setSelectedServices([]);
      setSelectedLanguages([]);
      setSelectedActors([]);
      setSelectedDirectors([]);
      setSelectedProducers([]);
      setAddMovieModal(false);
      enableBodyScroll("body");
    }
  };
  const editMovie = async () => {
    const genresArr = selectedMovieGenres.map((option) => option.value);
    const languagesArr = selectedMovieLanguages.map((option) => option.value);
    const servicesArr = selectedMovieServices.map((option) => option.value);
    const actorsArr = selectedMovieActors.map((option) => option.value);
    const directorsArr = selectedMovieDirectors.map((option) => option.value);
    const producersArr = selectedMovieProducers.map((option) => option.value);
    try {
      const formData = new FormData();
      formData.append("movie_name", editNameRef.current.value);
      formData.append("movie_year", editYearRef.current.value);
      formData.append("movie_imdb", editIMDBRef.current.value);
      formData.append("movie_trailer", editTrailerRef.current.value);
      formData.append("genres", genresArr);
      formData.append("languages", languagesArr);
      formData.append("services", servicesArr);
      formData.append("actors", actorsArr);
      formData.append("producers", producersArr);
      formData.append("directors", directorsArr);
      formData.append("movie_img", selectedImage);
      formData.append("remove_photo", JSON.stringify({ removePhoto }));
      const response = await fetch(
        apiURL + "/movies/" + selectedMovie.movie_id,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllMovies();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit movie");
    } finally {
      setSelectedMovie(null);
      setSelectedImage(null);
      setSelectedMovieGenres([]);
      setSelectedMovieLanguages([]);
      setSelectedMovieServices([]);
      setSelectedMovieActors([]);
      setSelectedMovieProducers([]);
      setSelectedMovieDirectors([]);
      setEditMovieModal(false);
      enableBodyScroll("body");
    }
  };
  const fileInputRefAdd = useRef(null);
  const fileInputRefEdit = useRef(null);
  const addNameRef = useRef(null);
  const addYearRef = useRef(null);
  const addIMDBRef = useRef(null);
  const editTrailerRef = useRef(null);
  const editNameRef = useRef(null);
  const editYearRef = useRef(null);
  const editIMDBRef = useRef(null);
  const addTrailerRef = useRef(null);
  const [movies, setMovies] = useState(null);
  const [selectedImage, setSelectedImage] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [removeMovieModal, setRemoveMovieModal] = useState(false);
  const [addMovieModal, setAddMovieModal] = useState(false);
  const [editMovieModal, setEditMovieModal] = useState(false);
  const [removePhoto, setRemovePhoto] = useState(true);

  const [allGenres, setAllGenres] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const [allLanguages, setAllLanguages] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [allServices, setAllServices] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const [allPeople, setAllPeople] = useState(null);
  const [selectedActors, setSelectedActors] = useState([]);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [selectedDirectors, setSelectedDirectors] = useState([]);

  const [selectedMovieGenres, setSelectedMovieGenres] = useState(null);
  const [selectedMovieLanguages, setSelectedMovieLanguages] = useState(null);
  const [selectedMovieServices, setSelectedMovieServices] = useState(null);
  const [selectedMovieActors, setSelectedMovieActors] = useState(null);
  const [selectedMovieProducers, setSelectedMovieProducers] = useState(null);
  const [selectedMovieDirectors, setSelectedMovieDirectors] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };
  const getAllMovies = async () => {
    try {
      const response = await fetch(apiURL + "/movies/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setMovies(data.data);
        setAllPeople(data.people);
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
  const removeMovie = async () => {
    try {
      const response = await fetch(
        apiURL + "/movies/" + selectedMovie.movie_id,
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
        getAllMovies();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove movie");
    } finally {
      setSelectedMovie(null);
      setRemoveMovieModal(false);
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
            {movies && movies.length > 0 ? (
              <div className={styles.listWrapper}>
                {movies.map((v) => (
                  <div className={styles.listItemWrapper} key={v.movie_id}>
                    <div>
                      {v.movie_img == "movie.jpg" ? (
                        <FaFilm />
                      ) : (
                        <img src={apiURL + "/uploads/movies/" + v.movie_img} />
                      )}
                      <span>
                        {v.movie_name} ({v.movie_year})
                      </span>
                    </div>
                    <div>
                      <FaPen
                        onClick={() => {
                          setSelectedMovie(v);

                          setSelectedMovieGenres(
                            v.genres.map((genre) => ({
                              value: genre.genre_id,
                              label: genre.genre_name,
                            }))
                          );
                          setSelectedMovieLanguages(
                            v.languages.map((language) => ({
                              value: language.lang_id,
                              label: language.lang_name,
                            }))
                          );
                          setSelectedMovieServices(
                            v.services.map((service) => ({
                              value: service.serv_id,
                              label: service.serv_name,
                            }))
                          );
                          setSelectedMovieActors(
                            v.persons
                              .filter((v) => v.role == 0)
                              .map((person) => ({
                                value: person.pers_id,
                                label: person.pers_fn + " " + person.pers_ln,
                              }))
                          );
                          setSelectedMovieProducers(
                            v.persons
                              .filter((v) => v.role == 1)
                              .map((person) => ({
                                value: person.pers_id,
                                label: person.pers_fn + " " + person.pers_ln,
                              }))
                          );
                          setSelectedMovieDirectors(
                            v.persons
                              .filter((v) => v.role == 2)
                              .map((person) => ({
                                value: person.pers_id,
                                label: person.pers_fn + " " + person.pers_ln,
                              }))
                          );
                          setEditMovieModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => {
                          setSelectedMovie(v);
                          setRemoveMovieModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No movies</div>
            )}
          </>
        )}
        <button
          onClick={() => {
            setAddMovieModal(true);
            disableBodyScroll("body");
          }}
        >
          Add movie
        </button>
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addMovieModal}
        onRequestClose={() => {
          setSelectedImage(null);
          setSelectedGenres([]);
          setSelectedServices([]);
          setSelectedLanguages([]);
          setSelectedActors([]);
          setSelectedDirectors([]);
          setSelectedProducers([]);
          setAddMovieModal(false);
          enableBodyScroll("body");
        }}
      >
        <div
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            width: "90%",
            height: "100%",
            padding: "10px 0",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            onClick={() => {
              if (!selectedImage) {
                fileInputRefAdd.current.click();
              }
            }}
          >
            {selectedImage ? (
              <>
                <FaTimes
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#212427",
                    color: "#fff",
                  }}
                  onClick={(e) => {
                    fileInputRefAdd.current.value = "";
                    setSelectedImage(null);
                  }}
                />
                <div
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    border: "solid #212427 1px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className={styles.selectedImage}
                    src={URL.createObjectURL(selectedImage)}
                  />
                </div>
              </>
            ) : (
              <FaFilm size={40} />
            )}
          </div>
          <input
            style={{ display: "none" }}
            ref={fileInputRefAdd}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <input
            autoFocus
            type="text"
            ref={addNameRef}
            placeholder="Name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addMovie();
              }
            }}
          />
          <input
            type="number"
            ref={addYearRef}
            defaultValue={new Date().getFullYear()}
            placeholder="Year"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addMovie();
              }
            }}
          />
          <input
            type="text"
            ref={addIMDBRef}
            placeholder="IMDB"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addMovie();
              }
            }}
          />
          <input
            type="text"
            ref={addTrailerRef}
            placeholder="Trailer"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addMovie();
              }
            }}
          />
          {allGenres && (
            <MultiSelect
              disableSearch
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
          {allPeople && (
            <>
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedActors}
                onChange={setSelectedActors}
                hasSelectAll={false}
              />{" "}
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedProducers}
                onChange={setSelectedProducers}
                hasSelectAll={false}
              />{" "}
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedDirectors}
                onChange={setSelectedDirectors}
                hasSelectAll={false}
              />
            </>
          )}
          <button onClick={addMovie}>Add movie</button>
          <button
            onClick={() => {
              setSelectedImage(null);
              setSelectedGenres([]);
              setSelectedServices([]);
              setSelectedLanguages([]);
              setSelectedActors([]);
              setSelectedDirectors([]);
              setSelectedProducers([]);
              setAddMovieModal(false);
              enableBodyScroll("body");
            }}
          >
            Close
          </button>
        </div>
      </Modal>
      {selectedMovie && (
        <>
          <Modal
            className={styles.deleteModal}
            isOpen={editMovieModal}
            onRequestClose={() => {
              setSelectedMovie(null);
              setSelectedImage(null);
              setEditMovieModal(false);
              enableBodyScroll("body");
            }}
          >
            {removePhoto && (
              <div
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                onClick={() => {
                  if (!selectedImage) {
                    fileInputRefEdit.current.click();
                  }
                }}
              >
                {selectedImage ? (
                  <>
                    <FaTimes
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                      onClick={(e) => {
                        fileInputRefEdit.current.value = "";
                        setSelectedImage(null);
                      }}
                    />
                    <div
                      style={{
                        borderRadius: "50%",
                        overflow: "hidden",
                        width: "100%",
                        height: "100%",
                        border: "solid #212427 1px",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        className={styles.selectedImage}
                        src={URL.createObjectURL(selectedImage)}
                      />
                    </div>
                  </>
                ) : selectedMovie.movie_img == "movie.jpg" ? (
                  <FaFilm size={40} />
                ) : (
                  <div
                    style={{
                      borderRadius: "50%",
                      overflow: "hidden",
                      width: "100%",
                      height: "100%",
                      border: "solid #212427 1px",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={
                        apiURL + "/uploads/movies/" + selectedMovie.movie_img
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <Toggle
              color="#121212"
              icons={{
                checked: <FaImage size={12} color="#fff" />,
                unchecked: <FaTimes size={12} color="#fff" />,
              }}
              defaultChecked={removePhoto}
              onChange={() => {
                setRemovePhoto(!removePhoto);
              }}
            />
            <input
              style={{ display: "none" }}
              ref={fileInputRefEdit}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <input
              autoFocus
              type="text"
              ref={editNameRef}
              defaultValue={selectedMovie.movie_name}
              placeholder="First name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMovie();
                }
              }}
            />
            <input
              type="numeric"
              ref={editYearRef}
              placeholder="Year"
              defaultValue={selectedMovie.movie_year}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMovie();
                }
              }}
            />
            <input
              type="text"
              ref={editIMDBRef}
              defaultValue={selectedMovie.movie_imdb}
              placeholder="IMDB"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMovie();
                }
              }}
            />
            <input
              type="text"
              ref={editTrailerRef}
              defaultValue={selectedMovie.movie_trailer}
              placeholder="Trailer"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editMovie();
                }
              }}
            />
            {allGenres && (
              <MultiSelect
                options={allGenres.map((genre) => ({
                  value: genre.genre_id,
                  label: genre.genre_name,
                }))}
                value={selectedMovieGenres}
                onChange={setSelectedMovieGenres}
                hasSelectAll={false}
              />
            )}
            {allLanguages && (
              <MultiSelect
                options={allLanguages.map((lang) => ({
                  value: lang.lang_id,
                  label: lang.lang_name,
                }))}
                value={selectedMovieLanguages}
                onChange={setSelectedMovieLanguages}
                hasSelectAll={false}
              />
            )}
            {allServices && (
              <MultiSelect
                options={allServices.map((serv) => ({
                  value: serv.serv_id,
                  label: serv.serv_name,
                }))}
                value={selectedMovieServices}
                onChange={setSelectedMovieServices}
                hasSelectAll={false}
              />
            )}
            {allPeople && (
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedMovieActors}
                onChange={setSelectedMovieActors}
                hasSelectAll={false}
              />
            )}
            {allPeople && (
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedMovieProducers}
                onChange={setSelectedMovieProducers}
                hasSelectAll={false}
              />
            )}
            {allPeople && (
              <MultiSelect
                options={allPeople.map((pers) => ({
                  value: pers.pers_id,
                  label: pers.pers_fn + " " + pers.pers_ln,
                }))}
                value={selectedMovieDirectors}
                onChange={setSelectedMovieDirectors}
                hasSelectAll={false}
              />
            )}
            <button onClick={editMovie}>Edit movie</button>
            <button
              onClick={() => {
                setSelectedMovie(null);
                setSelectedImage(null);
                setEditMovieModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>

          <Modal
            className={styles.deleteModal}
            isOpen={removeMovieModal}
            onRequestClose={() => {
              setSelectedMovie(null);
              setRemoveMovieModal(false);
              enableBodyScroll("body");
            }}
          >
            Are you sure you want to remove movie{" "}
            {selectedMovie.movie_name + " (" + selectedMovie.movie_year + ")"}?
            <button autoFocus onClick={removeMovie}>
              Yes
            </button>
            <button
              onClick={() => {
                setSelectedMovie(null);
                setRemoveMovieModal(false);
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

export default ManageMovies;
