import React, { useEffect, useState } from "react";
import styles from "./People.module.css";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import apiURL from "../../config";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
const People = () => {
  const [people, setPeople] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const getAllPeople = async () => {
    try {
      const response = await fetch(apiURL + "/person/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setPeople(data.people);
      } else {
        setMessage("Couldn't get people");
      }
    } catch (error) {
      setMessage("Couldn't get people");
    }
  };
  useEffect(() => {
    getAllPeople();
  }, []);
  return (
    <div className={styles.mainMoviesWrapper}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {people && people.length > 0 ? (
            people.map((v) => (
              <Link
                to={"/people/" + v.pers_id}
                className={styles.itemWrapper}
                key={v.pers_id}
              >
                {v.pers_img === "actor.jpg" ? (
                  <FaStar />
                ) : (
                  <img src={apiURL + "/uploads/person/" + v.pers_img} />
                )}
                <span>{v.pers_fn + " " + v.pers_ln}</span>
              </Link>
            ))
          ) : (
            <span>No people available</span>
          )}
        </>
      )}
      {message !== null && (
        <MessageModal message={message} setMessage={setMessage} />
      )}
    </div>
  );
};

export default People;
