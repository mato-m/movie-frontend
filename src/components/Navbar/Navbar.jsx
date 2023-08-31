import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
const Navbar = ({ setHasToken, userData }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    menuOpen
      ? disableBodyScroll(document.body)
      : enableBodyScroll(document.body);
  }, [menuOpen]);
  return (
    <div className={styles.navbarMain}>
      <NavLink
        to=""
        className={styles.title}
        onClick={() => {
          setMenuOpen(false);
        }}
      >
        Moviez
      </NavLink>
      <div
        className={`${styles.menuEntries} ${
          !menuOpen ? styles.menuOpened : ""
        }`}
      >
        <NavLink
          to="people"
          onClick={() => {
            setMenuOpen(false);
          }}
        >
          People
        </NavLink>
        <NavLink
          onClick={() => {
            setMenuOpen(false);
          }}
          to={"user/" + userData.usr_id}
        >
          My profile
        </NavLink>
        {userData.usr_role == 1 && (
          <NavLink
            to={"admin"}
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            Admin panel
          </NavLink>
        )}
        <Link
          to=""
          onClick={() => {
            setMenuOpen(false);
            localStorage.removeItem("token");
            setHasToken(false);
          }}
        >
          Logout
        </Link>
      </div>
      {menuOpen ? (
        <FaTimes
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          className={styles.menuIcon}
        />
      ) : (
        <FaBars
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          className={styles.menuIcon}
        />
      )}
    </div>
  );
};

export default Navbar;
