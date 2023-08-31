import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import Modal from "react-modal";
import ListsShort from "./ListsShort";
import { FaTimes, FaUser } from "react-icons/fa";
import WatchedShort from "./WatchedShort";
import RatedShort from "./RatedShort";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
const Profile = ({ userData, setHasToken }) => {
  const [message, setMessage] = useState(null);
  const newUsernameRef = useRef(null);
  const fileInputRef = useRef(null);
  const newEmailRef = useRef(null);
  const oldPwRef = useRef(null);
  const newPwRef = useRef(null);
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pfpModal, setPfpModal] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [usernameModalOpen, setUsernameModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  Modal.setAppElement("#root");
  const navigator = useNavigate();
  const { user_id } = useParams();
  const sameUser = userData.usr_id == user_id;
  const [viewedUser, setViewedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };
  const changePfp = async () => {
    const formData = new FormData();
    formData.append("usr_img", selectedImage);
    try {
      const response = await fetch(apiURL + "/user/edit/img/" + user_id, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status == 0) {
        getUserData();
        localStorage.setItem("token", data.token);
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Error while changing profile photo");
    } finally {
      setSelectedImage(null);
      setPfpModal(false);
      enableBodyScroll("body");
    }
  };
  const getUserData = async () => {
    try {
      const response = await fetch(apiURL + "/user/profile/" + user_id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setViewedUser(data.userProfile);
      } else {
        setMessage("Couldn't get user data");
      }
    } catch (error) {
      setMessage("Couldn't get user data");
    }
  };
  const deleteAccount = async () => {
    try {
      const response = await fetch(apiURL + "/user/" + user_id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.status == 0) {
        localStorage.removeItem("token");
        setHasToken(false);
        navigator("/");
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't delete user");
    }
  };
  const editUsername = async () => {
    try {
      const response = await fetch(apiURL + "/user/edit/username/" + user_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          new_username: newUsernameRef.current.value,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        localStorage.setItem("token", data.token);
        getUserData();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit username");
    } finally {
      setUsernameModalOpen(false);
      enableBodyScroll("body");
    }
  };
  const editEmail = async () => {
    try {
      const response = await fetch(apiURL + "/user/edit/email/" + user_id, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail: newEmailRef.current.value,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        localStorage.setItem("token", data.token);
        getUserData();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit email");
    } finally {
      setEmailModalOpen(false);
      enableBodyScroll("body");
    }
  };

  const editPassword = async () => {
    try {
      const response = await fetch(apiURL + "/user/edit/password/" + user_id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          oldPassword: oldPwRef.current.value,
          newPassword: newPwRef.current.value,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        getUserData();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit password");
    } finally {
      setPwModalOpen(false);
      enableBodyScroll("body");
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  {
    return (
      <>
        <div className={styles.profWrapper}>
          <div className={styles.midWrapper}>
            {loading ? (
              <Loading />
            ) : (
              viewedUser && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {viewedUser.usr_img != "user.jpg" ? (
                      <img
                        className={styles.pfp}
                        src={apiURL + "/uploads/user/" + viewedUser.usr_img}
                      />
                    ) : (
                      <FaUser className={styles.pfp} />
                    )}
                    {viewedUser.usr_name}
                  </div>
                  <ListsShort
                    user_id={user_id}
                    sameUser={sameUser}
                    message={message}
                    setMessage={setMessage}
                  />
                  <WatchedShort
                    user_id={user_id}
                    message={message}
                    setMessage={setMessage}
                  />
                  <RatedShort
                    user_id={user_id}
                    message={message}
                    setMessage={setMessage}
                  />
                  {sameUser && (
                    <div className={styles.bottomBtnWrapper}>
                      <button
                        onClick={() => {
                          setUsernameModalOpen(true);
                          disableBodyScroll("body");
                        }}
                        className={styles.deleteAccBtn}
                      >
                        Change username
                      </button>
                      <button
                        onClick={() => {
                          setPfpModal(true);
                          disableBodyScroll("body");
                        }}
                        className={styles.deleteAccBtn}
                      >
                        Change profile photo
                      </button>
                      <button
                        onClick={() => {
                          setEmailModalOpen(true);
                          disableBodyScroll("body");
                        }}
                        className={styles.deleteAccBtn}
                      >
                        Change email
                      </button>
                      <button
                        onClick={() => {
                          setPwModalOpen(true);
                          disableBodyScroll("body");
                        }}
                        className={styles.deleteAccBtn}
                      >
                        Change password
                      </button>
                      <button
                        onClick={() => {
                          setDeleteModalOpen(true);
                          disableBodyScroll("body");
                        }}
                        className={styles.deleteAccBtn}
                      >
                        Delete account
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
        <Modal
          className={styles.deleteModal}
          isOpen={usernameModalOpen}
          onRequestClose={() => {
            setUsernameModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          <input
            autoFocus
            ref={newUsernameRef}
            type="text"
            placeholder="New username"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editUsername();
              }
            }}
          />
          <button onClick={editUsername}>Confirm</button>
          <button
            onClick={() => {
              setUsernameModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
        <Modal
          className={styles.deleteModal}
          isOpen={pfpModal}
          onRequestClose={() => {
            setSelectedImage(null);
            setPfpModal(false);
            enableBodyScroll("body");
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              marginBottom: 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            onClick={() => {
              if (!selectedImage) {
                fileInputRef.current.click();
                fileInputRef.current.value = "";
              }
            }}
          >
            {selectedImage ? (
              <>
                <FaTimes
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                  }}
                  onClick={(e) => {
                    setSelectedImage(null);
                  }}
                />
                <div
                  style={{
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    border: "solid #212427 1px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className={styles.selectedImage}
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                  />
                </div>
              </>
            ) : (
              <FaUser size={40} />
            )}
          </div>
          <input
            style={{ display: "none" }}
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button onClick={changePfp}>
            {selectedImage ? "Change " : "Remove "}profile photo
          </button>
          <button
            onClick={() => {
              setSelectedImage(null);
              setPfpModal(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
        <Modal
          isOpen={emailModalOpen}
          className={styles.deleteModal}
          onRequestClose={() => {
            setEmailModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          <input
            autoFocus
            ref={newEmailRef}
            type="text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editEmail();
              }
            }}
            placeholder="New email"
          />
          <button onClick={editEmail}>Confirm</button>
          <button
            onClick={() => {
              setEmailModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
        <Modal
          className={styles.deleteModal}
          isOpen={pwModalOpen}
          onRequestClose={() => {
            setPwModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          <input
            autoFocus
            type="password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editPassword();
              }
            }}
            ref={oldPwRef}
            placeholder="Old password"
          />
          <input
            type="password"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editPassword();
              }
            }}
            ref={newPwRef}
            placeholder="New password"
          />
          <button onClick={editPassword}>Confirm</button>
          <button
            onClick={() => {
              setPwModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
        <Modal
          className={styles.deleteModal}
          isOpen={deleteModalOpen}
          onRequestClose={() => {
            setDeleteModalOpen(false);
            enableBodyScroll("body");
          }}
        >
          <span>Are you sure you want to delete account?</span>
          <button onClick={deleteAccount}>Confirm</button>
          <button
            onClick={() => {
              setDeleteModalOpen(false);
              enableBodyScroll("body");
            }}
          >
            Cancel
          </button>
        </Modal>
        {message !== null && (
          <MessageModal message={message} setMessage={setMessage} />
        )}
      </>
    );
  }
};

export default Profile;
