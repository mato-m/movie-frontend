import React from "react";
import { Link } from "react-router-dom";
import styles from "./Admin.module.css";
const Admin = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.adminWrapper}>
        <Link to="/admin/movies">Movies</Link>
        <Link to="/admin/people">People</Link>
        <Link to="/admin/genres">Genres</Link>
        <Link to="/admin/languages">Languages</Link>
        <Link to="/admin/services">Services</Link>
      </div>
    </div>
  );
};

export default Admin;
