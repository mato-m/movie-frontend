import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { FaFilm } from "react-icons/fa";
import "react-toggle/style.css";
import { Link } from "react-router-dom";
import apiURL from "../../config";
import Loading from "../Loading";
const WatchedShort = ({ user_id, setMessage }) => {
  const [watched, setWatched] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAllWatched = async () => {
    try {
      const response = await fetch(apiURL + "/watched/" + user_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setWatched(data.data);
      } else {
        setMessage("Couldn't get watched movies");
      }
    } catch (error) {
      setMessage("Couldn't get watched movies");
    }
  };
  useEffect(() => {
    getAllWatched();
  }, []);
  return (
    <>
      <div style={{ width: "90%", margin: "10px 0" }}>
        <span>Watched</span>
        {loading ? (
          <Loading />
        ) : (
          <>
            {watched && watched.length > 0 ? (
              <div className={styles.listWrapper}>
                {watched.map((v, i) => (
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
                      {new Date(v.watched_time).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                No watched movies available
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default WatchedShort;
