import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
Modal.setAppElement("#root");

const Languages = () => {
  const [message, setMessage] = useState(null);
  const addLanguageRef = useRef(null);
  const editLanguageRef = useRef(null);
  const [languages, setLanguages] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [editLanguageModal, setEditLanguageModal] = useState(false);
  const [removeLanguageModal, setRemoveLanguageModal] = useState(false);
  const [addLanguageModal, setAddLanguageModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const getAllLanguages = async () => {
    try {
      const response = await fetch(apiURL + "/languages/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setLanguages(data.languages);
      } else {
        setMessage("Couldn't get languages");
      }
    } catch (error) {
      setMessage("Couldn't get languages");
    }
  };
  useEffect(() => {
    getAllLanguages();
  }, []);

  const addLanguage = async () => {
    try {
      const response = await fetch(apiURL + "/languages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lang_name: addLanguageRef.current.value,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllLanguages();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add language");
    } finally {
      setAddLanguageModal(false);
      enableBodyScroll("body");
    }
  };
  const editLanguage = async () => {
    try {
      const response = await fetch(
        apiURL + "/languages/" + selectedLanguage.lang_id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            lang_name: editLanguageRef.current.value,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllLanguages();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit language");
    } finally {
      setSelectedLanguage(null);
      setEditLanguageModal(false);
      enableBodyScroll("body");
    }
  };
  const removeLanguage = async () => {
    try {
      const response = await fetch(
        apiURL + "/languages/" + selectedLanguage.lang_id,
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
        getAllLanguages();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove language");
    } finally {
      setSelectedLanguage(null);
      setRemoveLanguageModal(false);
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
            {languages && languages.length > 0 ? (
              <div className={styles.listWrapper}>
                {languages.map((v) => (
                  <div className={styles.listItemWrapper} key={v.lang_id}>
                    <span>{v.lang_name}</span>
                    <div>
                      <FaPen
                        onClick={() => {
                          setSelectedLanguage(v);
                          setEditLanguageModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => {
                          setSelectedLanguage(v);
                          setRemoveLanguageModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No languages</div>
            )}
            <button
              onClick={() => {
                setAddLanguageModal(true);
                disableBodyScroll("body");
              }}
            >
              Add language
            </button>
          </>
        )}
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addLanguageModal}
        onRequestClose={() => {
          setSelectedLanguage(null);
          setAddLanguageModal(false);
          enableBodyScroll("body");
        }}
      >
        <input
          type="text"
          autoFocus
          ref={addLanguageRef}
          placeholder="Language name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addLanguage();
            }
          }}
        />
        <button onClick={addLanguage}>Add language</button>
        <button
          onClick={() => {
            setAddLanguageModal(false);
            enableBodyScroll("body");
          }}
        >
          Close
        </button>
      </Modal>
      {selectedLanguage && (
        <>
          <Modal
            className={styles.deleteModal}
            isOpen={editLanguageModal}
            onRequestClose={() => {
              setSelectedLanguage(null);
              setEditLanguageModal(false);
              enableBodyScroll("body");
            }}
          >
            <input
              autoFocus
              type="text"
              ref={editLanguageRef}
              placeholder="Language name"
              defaultValue={selectedLanguage.lang_name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editLanguage();
                }
              }}
            />
            <button onClick={editLanguage}>Edit language</button>
            <button
              onClick={() => {
                setSelectedLanguage(null);
                setEditLanguageModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>
          <Modal
            className={styles.deleteModal}
            isOpen={removeLanguageModal}
            onRequestClose={() => {
              setSelectedLanguage(null);
              setRemoveLanguageModal(false);
              enableBodyScroll("body");
            }}
          >
            Are you sure you want to remove language?
            <button autoFocus onClick={removeLanguage}>
              Yes
            </button>
            <button
              onClick={() => {
                setSelectedLanguage(null);
                setRemoveLanguageModal(false);
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

export default Languages;
