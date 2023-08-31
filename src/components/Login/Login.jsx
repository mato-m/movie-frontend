import React, { useRef, useState } from "react";
import styles from "./Login.module.css";
import { FaAt, FaLock } from "react-icons/fa";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "../Loading";
const Login = ({ setHasToken }) => {
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const navigation = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  Modal.setAppElement("#root");

  const login = async () => {
    setLoading(true);
    try {
      const response = await fetch(apiURL + "/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usr_mail: emailRef.current.value,
          usr_pass: pwRef.current.value,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setHasToken(true);
        localStorage.setItem("token", data.token);
        navigation("/");
      } else {
        setIsOpen(true);
        setModalMessage(data.message);
        disableBodyScroll("body");
      }
    } catch (error) {
      setIsOpen(true);
      setModalMessage("Error while logging in");
      disableBodyScroll("body");
    }
  };
  return (
    <>
      <div className={styles.loginPageWrapper}>
        <div className={styles.middleWrapper}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className={styles.inputWrapper}>
                <FaAt />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                />
              </div>
              <div className={styles.inputWrapper}>
                <FaLock />
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  ref={pwRef}
                  type="password"
                  placeholder="Password"
                />
              </div>
              <button onClick={login}>Login</button>
              <div className={styles.signUpText}>
                Don't have an account? <br />
                <Link to="/register">Sign up</Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        className={styles.loginModal}
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
          enableBodyScroll("body");
        }}
      >
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

export default Login;
