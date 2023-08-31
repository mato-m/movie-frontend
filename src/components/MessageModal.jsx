import React from "react";
import Modal from "react-modal";
import { enableBodyScroll } from "body-scroll-lock";
import styles from "./Movies/Movies.module.css";
Modal.setAppElement("#root");
const MessageModal = ({ message, setMessage }) => {
  return (
    <Modal
      className={styles.deleteModal}
      isOpen={message !== null}
      onRequestClose={() => {
        setMessage(null);
        enableBodyScroll("body");
      }}
    >
      <span>{message}</span>
      <button
        autoFocus
        onClick={() => {
          setMessage(null);
          enableBodyScroll("body");
        }}
      >
        Close
      </button>
    </Modal>
  );
};

export default MessageModal;
