import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { FaFilm } from "react-icons/fa";
import "react-toggle/style.css";
import { Link } from "react-router-dom";
import apiURL from "../../config";
import Loading from "../Loading";
const RatedShort = ({ user_id, setMessage }) => {
  const [rated, setRated] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAllWatched = async () => {
    try {
      const response = await fetch(apiURL + "/ratings/" + user_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setRated(data.data);
      } else {
        setMessage("Couldn't get rated movies");
      }
    } catch (error) {
      setMessage("Couldn't get rated movies");
    }
  };
  useEffect(() => {
    getAllWatched();
  }, []);
  return (
    <>
      <div style={{ width: "90%", margin: "10px 0" }}>
        <span>Rated</span>
        {loading ? (
          <Loading />
        ) : (
          <>
            {rated && rated.length > 0 ? (
              <div className={styles.listWrapper}>
                {rated.map((v, i) => (
                  <Link
                    to={"/movie/" + v.movie_id}
                    className={styles.oneListPreview}
                    style={{ justifyContent: "center" }}
                    key={i}
                  >
                    {v.movie_img == "movie.jpg" ? (
                      <FaFilm size={60} />
                    ) : (
                      <img
                        src={apiURL + "/uploads/movies/" + v.movie_img}
                        style={{
                          width: 200,
                          height: 200,
                          objectFit: "contain",
                        }}
                      />
                    )}
                    <span>
                      {v.movie_name + " "}({v.movie_year})<br />
                      {"Rating: " + v.rating}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                No rated movies
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RatedShort;
