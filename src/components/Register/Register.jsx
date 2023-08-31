import React, { useRef, useState } from "react";
import styles from "./Register.module.css";
import { FaAt, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "../Loading";
const Register = ({ setHasToken }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const userRef = useRef(null);
  const mailRef = useRef(null);
  const passRef = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  Modal.setAppElement("#root");
  const register = async () => {
    const formData = new FormData();
    formData.append("usr_name", userRef.current.value);
    formData.append("usr_mail", mailRef.current.value);
    formData.append("usr_passhash", passRef.current.value);
    formData.append("usr_img", selectedImage);
    setLoading(true);
    try {
      const response = await fetch(apiURL + "/user/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        localStorage.setItem("token", data.token);
        setHasToken(true);
        navigate("/");
      } else {
        setModalMessage(data.message);
        setIsOpen(true);
        disableBodyScroll("body");
      }
    } catch (error) {
      setModalMessage("Error while registering");
      setIsOpen(true);
    }
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div className={styles.registerPageWrapper}>
        <div className={styles.middleWrapper}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {selectedImage ? (
                <div className={styles.imageDiv}>
                  <img
                    className={styles.selectedImage}
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                  />
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedImage(null);
                    }}
                  >
                    Remove image
                  </span>
                </div>
              ) : (
                <div
                  className={styles.imageDiv}
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                >
                  <div className={styles.noImage}>
                    <FaUserPlus size={50} />
                  </div>
                  <span style={{ cursor: "pointer" }}>Upload image</span>
                </div>
              )}
              <div className={styles.inputWrapper}>
                <FaUser />
                <input
                  ref={userRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      register();
                    }
                  }}
                  type="text"
                  placeholder="Username"
                />
              </div>
              <input
                style={{ display: "none" }}
                ref={fileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className={styles.inputWrapper}>
                <FaAt />
                <input
                  ref={mailRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      register();
                    }
                  }}
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className={styles.inputWrapper}>
                <FaLock />
                <input
                  ref={passRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      register();
                    }
                  }}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <button onClick={register}>Register</button>

              <div className={styles.signUpText}>
                Already have an account? <br />
                <Link to="/">Sign in</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal className={styles.registerModal} isOpen={modalIsOpen}>
        {modalMessage}
        <button
          autoFocus
          onClick={() => {
            setIsOpen(false);
            enableBodyScroll("body");
          }}
        >
          Try again
        </button>
      </Modal>
    </>
  );
};

export default Register;
