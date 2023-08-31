import React, { useState, useEffect, useRef } from "react";
import styles from "./Admin.module.css";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import apiURL from "../../config";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import MessageModal from "../MessageModal";
import Loading from "../Loading";
Modal.setAppElement("#root");

const Services = () => {
  const addServiceRef = useRef(null);
  const editServiceRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [services, setServices] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [editServiceModal, setEditServiceModal] = useState(false);
  const [removeServiceModal, setRemoveServiceModal] = useState(false);
  const [addServiceModal, setAddServiceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const getAllServices = async () => {
    try {
      const response = await fetch(apiURL + "/services/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setLoading(false);
      if (data.status == 0) {
        setServices(data.services);
      } else {
        setMessage("Couldn't get services");
      }
    } catch (error) {
      setMessage("Couldn't get services");
    }
  };
  useEffect(() => {
    getAllServices();
  }, []);

  const addService = async () => {
    try {
      const response = await fetch(apiURL + "/services/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          serv_name: addServiceRef.current.value,
        }),
      });
      const data = await response.json();
      if (data.status == 0) {
        getAllServices();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't add service");
    } finally {
      enableBodyScroll("body");
      setAddServiceModal(false);
    }
  };
  const editService = async () => {
    try {
      const response = await fetch(
        apiURL + "/services/" + selectedService.serv_id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            serv_name: editServiceRef.current.value,
          }),
        }
      );
      const data = await response.json();
      if (data.status == 0) {
        getAllServices();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't edit service");
    } finally {
      setSelectedService(null);
      setEditServiceModal(false);
      enableBodyScroll("body");
    }
  };
  const removeService = async () => {
    try {
      const response = await fetch(
        apiURL + "/services/" + selectedService.serv_id,
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
        getAllServices();
      }
      setMessage(data.message);
    } catch (error) {
      setMessage("Couldn't remove service");
    } finally {
      setSelectedService(null);
      setRemoveServiceModal(false);
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
            {services && services.length > 0 ? (
              <div className={styles.listWrapper}>
                {services.map((v) => (
                  <div className={styles.listItemWrapper} key={v.serv_id}>
                    <span>{v.serv_name}</span>
                    <div>
                      <FaPen
                        onClick={() => {
                          setEditServiceModal(true);
                          setSelectedService(v);
                          disableBodyScroll("body");
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => {
                          setRemoveServiceModal(true);
                          setSelectedService(v);
                          disableBodyScroll("body");
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No services</div>
            )}
          </>
        )}
        <button
          onClick={() => {
            setAddServiceModal(true);
            disableBodyScroll("body");
          }}
        >
          Add service
        </button>
      </div>
      <Modal
        className={styles.deleteModal}
        isOpen={addServiceModal}
        onRequestClose={() => {
          setAddServiceModal(false);
          enableBodyScroll("body");
        }}
      >
        <input
          type="text"
          autoFocus
          ref={addServiceRef}
          placeholder="Service name"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addService();
            }
          }}
        />
        <button onClick={addService}>Add service</button>
        <button
          onClick={() => {
            setAddServiceModal(false);
            enableBodyScroll("body");
          }}
        >
          Close
        </button>
      </Modal>
      {selectedService && (
        <>
          <Modal
            className={styles.deleteModal}
            isOpen={editServiceModal}
            onRequestClose={() => {
              setSelectedService(null);
              setEditServiceModal(false);
              enableBodyScroll("body");
            }}
          >
            <input
              autoFocus
              type="text"
              ref={editServiceRef}
              placeholder="Service name"
              defaultValue={selectedService.serv_name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editService();
                }
              }}
            />
            <button onClick={editService}>Edit service</button>
            <button
              onClick={() => {
                setSelectedService(null);
                setEditServiceModal(false);
                enableBodyScroll("body");
              }}
            >
              Close
            </button>
          </Modal>
          <Modal
            className={styles.deleteModal}
            isOpen={removeServiceModal}
            onRequestClose={() => {
              setSelectedService(null);
              setRemoveServiceModal(false);
              enableBodyScroll("body");
            }}
          >
            Are you sure you want to remove service?
            <button autoFocus onClick={removeService}>
              Yes
            </button>
            <button
              onClick={() => {
                setSelectedService(null);
                setRemoveServiceModal(false);
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

export default Services;
