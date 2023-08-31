import React, { useEffect, useRef, useState } from "react";
import styles from "./Profile.module.css";
import {
  FaList,
  FaLock,
  FaPen,
  FaPlus,
  FaTrashAlt,
  FaUnlock,
} from "react-icons/fa";
import Modal from "react-modal";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import { Link } from "react-router-dom";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Loading from "../Loading";
const ListsShort = ({ sameUser, user_id, setMessage }) => {
  const [liste, setListe] = useState(null);
  const [addListModalOpen, setAddListModalOpen] = useState(false);
  const [editListModalOpen, setEditListModalOpen] = useState(false);
  const [deleteListModalOpen, setDeleteListModalOpen] = useState(false);
  const [newListPublic, setNewListPublic] = useState(false);
  const [editListPublic, setEditListPublic] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const lnRef = useRef(null);
  const editLnRef = useRef(null);
  Modal.setAppElement("#root");
  const deleteList = async () => {
    try {
      const response = await fetch(apiURL + "/lists/" + editingList.lst_id, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllLists();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't delete list");
    } finally {
      setEditingList(null);
      setDeleteListModalOpen(false);
      enableBodyScroll("body");
    }
  };
  const postList = async () => {
    try {
      const response = await fetch(apiURL + "/lists/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lst_usr_id: user_id,
          lst_name: lnRef.current.value,
          lst_private: newListPublic ? 0 : 1,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllLists();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add list");
    } finally {
      setAddListModalOpen(false);
      setEditingList(null);
      enableBodyScroll("body");
    }
  };
  const editList = async () => {
    try {
      const response = await fetch(apiURL + "/lists/" + editingList.lst_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lst_name: editLnRef.current.value,
          lst_private: editListPublic ? 0 : 1,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllLists();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit list");
    } finally {
      setEditingList(null);
      setEditListModalOpen(false);
      enableBodyScroll("body");
    }
  };
  const getPublicLists = async () => {
    try {
      const response = await fetch(apiURL + "/lists/" + user_id + "/public", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setListe(data.lists);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Couldn't get lists");
    }
  };
  const getAllLists = async () => {
    try {
      const response = await fetch(apiURL + "/lists/" + user_id + "/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setListe(data.lists);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Couldn't get lists");
    }
  };
  useEffect(() => {
    sameUser ? getAllLists() : getPublicLists();
  }, []);
  return (
    <>
      <div style={{ width: "90%", margin: "10px 0" }}>
        <span>Lists</span>
        {loading ? (
          <Loading />
        ) : (
          <>
            {sameUser && (
              <button
                onClick={() => {
                  setAddListModalOpen(true);
                  disableBodyScroll("body");
                }}
                className={styles.deleteAccBtn}
                style={{
                  marginLeft: 10,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaPlus />
                <span style={{ marginLeft: 5 }}>Add new list</span>
              </button>
            )}
            {liste && liste.length > 0 ? (
              <div className={styles.listWrapper}>
                {liste.map((v) => (
                  <Link
                    to={"/list/" + v.lst_id}
                    className={styles.oneListPreview}
                    key={v.lst_id}
                  >
                    <FaList size={40} />
                    {v.lst_private ? <FaLock /> : <FaUnlock />}
                    <span>{v.lst_name}</span>
                    {sameUser && (
                      <div className={styles.editListBtn}>
                        <FaPen
                          size={25}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditListModalOpen(true);
                            setEditingList(v);
                            setEditListPublic(!v.lst_private);
                            disableBodyScroll("body");
                          }}
                        />
                        <FaTrashAlt
                          size={25}
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteListModalOpen(true);
                            setEditingList(v);
                            disableBodyScroll("body");
                          }}
                        />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                No lists available
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addListModalOpen}
        onRequestClose={() => {
          setAddListModalOpen(false);
          enableBodyScroll("body");
        }}
      >
        <input
          autoFocus
          type="text"
          placeholder="New list name"
          ref={lnRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              postList();
            }
          }}
        />
        <div className={styles.toggleWrapper}>
          <Toggle
            icons={{
              checked: <FaUnlock size={12} color="#fff" />,
              unchecked: <FaLock size={12} color="#fff" />,
            }}
            defaultChecked={newListPublic}
            onChange={() => {
              setNewListPublic(!newListPublic);
            }}
          />
          <span>{newListPublic ? "Public" : "Private"} list</span>
        </div>
        <button onClick={postList}>Add</button>
        <button
          onClick={() => {
            setAddListModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          Cancel
        </button>
      </Modal>
      {editingList && (
        <Modal
          className={styles.deleteModal}
          isOpen={editListModalOpen}
          onRequestClose={() => {
            setEditingList(null);
            setEditListModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          <input
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editList();
              }
            }}
            type="text"
            placeholder="List name"
            defaultValue={editingList.lst_name}
            ref={editLnRef}
          />
          <div className={styles.toggleWrapper}>
            <Toggle
              icons={{
                checked: <FaUnlock size={12} color="#fff" />,
                unchecked: <FaLock size={12} color="#fff" />,
              }}
              defaultChecked={editListPublic}
              onChange={() => {
                setEditListPublic(!editListPublic);
              }}
            />
            <span>{editListPublic ? "Public" : "Private"} list</span>
          </div>
          <button onClick={editList}>Edit</button>
          <button
            onClick={() => {
              setEditListModalOpen(false);
              setEditingList(null);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
      )}
      {editingList && (
        <Modal
          className={styles.deleteModal}
          isOpen={deleteListModalOpen}
          onRequestClose={() => {
            setDeleteListModalOpen(false);
            setEditingList(null);
            enableBodyScroll("body");
          }}
        >
          <span>Delete list '{editingList.lst_name}'?</span>
          <button autoFocus onClick={deleteList}>
            Yes
          </button>
          <button
            onClick={() => {
              setEditingList(null);
              setDeleteListModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
      )}
    </>
  );
};

export default ListsShort;
