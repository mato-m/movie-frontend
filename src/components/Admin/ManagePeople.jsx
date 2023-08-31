import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import { FaImage, FaPen, FaStar, FaTimes, FaTrashAlt } from "react-icons/fa";
import Toggle from "react-toggle";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
Modal.setAppElement("#root");

const ManagePeople = () => {
  const [loading, setLoading] = useState(true);
  const fileInputRefAdd = useRef(null);
  const fileInputRefEdit = useRef(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.includes("image")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
    }
  };
  const addFNameRef = useRef(null);
  const addLNameRef = useRef(null);
  const addIMDBRef = useRef(null);
  const editFNameRef = useRef(null);
  const editLNameRef = useRef(null);
  const editIMDBRef = useRef(null);

  const [removePhoto, setRemovePhoto] = useState(true);
  const [message, setMessage] = useState(null);
  const [people, setPeople] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editPersonModal, setEditPersonModal] = useState(false);
  const [removePersonModal, setRemovePersonModal] = useState(false);
  const [addPersonModal, setAddPersonModal] = useState(false);
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

  const addPerson = async () => {
    try {
      const formData = new FormData();
      formData.append("pers_fn", addFNameRef.current.value);
      formData.append("pers_ln", addLNameRef.current.value);
      formData.append("pers_imdb", addIMDBRef.current.value);
      formData.append("pers_img", selectedImage);
      const response = await fetch(apiURL + "/person/", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllPeople();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add person");
    } finally {
      setSelectedImage(null);
      setAddPersonModal(false);
      enableBodyScroll("body");
    }
  };
  const editPerson = async () => {
    try {
      const formData = new FormData();
      formData.append("pers_fn", editFNameRef.current.value);
      formData.append("pers_ln", editLNameRef.current.value);
      formData.append("pers_imdb", editIMDBRef.current.value);
      formData.append("pers_img", selectedImage);
      formData.append("remove_photo", JSON.stringify({ removePhoto }));
      const response = await fetch(
        apiURL + "/person/" + selectedPerson.pers_id,
        {
          method: "PUT",
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllPeople();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit person");
    } finally {
      setSelectedPerson(null);
      setSelectedImage(null);
      setAddPersonModal(false);
      enableBodyScroll("body");
    }
  };
  const removePerson = async () => {
    try {
      const response = await fetch(
        apiURL + "/person/" + selectedPerson.pers_id,
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
        getAllPeople();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove person");
    } finally {
      setSelectedPerson(null);
      setRemovePersonModal(false);
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
            {people && people.length > 0 ? (
              <div className={styles.listWrapper}>
                {people.map((v) => (
                  <div className={styles.listItemWrapper} key={v.pers_id}>
                    <div>
                      {v.pers_img == "actor.jpg" ? (
                        <FaStar />
                      ) : (
                        <img src={apiURL + "/uploads/person/" + v.pers_img} />
                      )}
                      <span>
                        {v.pers_fn} {v.pers_ln}
                      </span>
                    </div>
                    <div>
                      <FaPen
                        onClick={() => {
                          setSelectedPerson(v);
                          setEditPersonModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => {
                          setSelectedPerson(v);
                          setRemovePersonModal(true);
                          disableBodyScroll("body");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No people</div>
            )}
            <button
              onClick={() => {
                setAddPersonModal(true);
                disableBodyScroll("body");
              }}
            >
              Add person
            </button>
          </>
        )}
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addPersonModal}
        onRequestClose={() => {
          setSelectedImage(null);
          setAddPersonModal(false);
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
              fileInputRefAdd.current.click();
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
                  fileInputRefAdd.current.value = "";
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
                />
              </div>
            </>
          ) : (
            <FaStar size={40} />
          )}
        </div>
        <input
          style={{ display: "none" }}
          ref={fileInputRefAdd}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          autoFocus
          type="text"
          ref={addFNameRef}
          placeholder="First name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addPerson();
            }
          }}
        />
        <input
          type="text"
          ref={addLNameRef}
          placeholder="Last name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addPerson();
            }
          }}
        />
        <input
          type="text"
          ref={addIMDBRef}
          placeholder="IMDB"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addPerson();
            }
          }}
        />
        <button onClick={addPerson}>Add person</button>
        <button
          onClick={() => {
            setAddPersonModal(false);
            enableBodyScroll("body");
          }}
        >
          Close
        </button>
      </Modal>
      {selectedPerson && (
        <>
          <Modal
            className={styles.deleteModal}
            isOpen={editPersonModal}
            onRequestClose={() => {
              setSelectedPerson(null);
              setSelectedImage(null);
              setEditPersonModal(false);
              enableBodyScroll("body");
            }}
          >
            {removePhoto && (
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
                    fileInputRefEdit.current.click();
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
                        fileInputRefEdit.current.value = "";
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
                      />
                    </div>
                  </>
                ) : selectedPerson.pers_img == "actor.jpg" ? (
                  <FaStar size={40} />
                ) : (
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
                      src={
                        apiURL + "/uploads/person/" + selectedPerson.pers_img
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <Toggle
              color="#121212"
              icons={{
                checked: <FaImage size={12} color="#fff" />,
                unchecked: <FaTimes size={12} color="#fff" />,
              }}
              defaultChecked={removePhoto}
              onChange={() => {
                setRemovePhoto(!removePhoto);
              }}
            />
            <input
              style={{ display: "none" }}
              ref={fileInputRefEdit}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <input
              autoFocus
              type="text"
              ref={editFNameRef}
              defaultValue={selectedPerson.pers_fn}
              placeholder="First name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editPerson();
                }
              }}
            />
            <input
              type="text"
              ref={editLNameRef}
              placeholder="Last name"
              defaultValue={selectedPerson.pers_ln}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editPerson();
                }
              }}
            />
            <input
              type="text"
              ref={editIMDBRef}
              defaultValue={selectedPerson.pers_imdb}
              placeholder="IMDB"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editPerson();
                }
              }}
            />
            <button onClick={editPerson}>Edit person</button>
            <button
              onClick={() => {
                setSelectedPerson(null);
                setSelectedImage(null);
                setEditPersonModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>
          <Modal
            className={styles.deleteModal}
            isOpen={removePersonModal}
            onRequestClose={() => {
              setSelectedPerson(null);
              setSelectedImage(null);
              setRemovePersonModal(false);
              enableBodyScroll("body");
            }}
          >
            Are you sure you want to remove person?
            <button autoFocus onClick={removePerson}>
              Yes
            </button>
            <button
              onClick={() => {
                setSelectedPerson(null);
                setRemovePersonModal(false);
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

export default ManagePeople;
