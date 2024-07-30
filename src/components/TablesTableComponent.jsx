import { React, useState } from "react";
import "./component_styles/TableComponent.css";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";

import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { BsDoorOpen, BsRadioactive, BsTrash } from "react-icons/bs";
import {
  collection,
  query,
  doc,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
const TablesTableComponent = ({ areaId }) => {
  const [value, loading, error] = useCollection(
    query(collection(db, "tables"), where("area", "==", areaId)),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [show, setShow] = useState(false);
  const [servicShow, setservicShow] = useState(false);
  const [inservicShow, setinservicShow] = useState(false);

  const [itemId, setitemId] = useState("");
  const deleteItem = async (tableId) => {
    await deleteDoc(doc(db, "tables", tableId)).then(() => {
      handleClose();
      setitemId("");
    });
  };
  const outOfService = async (tableId) => {
    await updateDoc(doc(db, "tables", tableId), {
      status: "out_of_service",
    }).then(() => {
      handleServiceClose();
      setitemId("");
    });
  };
  const inService = async (tableId) => {
    await updateDoc(doc(db, "tables", tableId), {
      status: "available",
    }).then(() => {
      handleServiceClose();
      setitemId("");
    });
  };
  const handleClose = () => setShow(false);
  const handleShow = (itemId) => {
    setitemId(itemId);
    setShow(true);
  };
  const handleServiceClose = () => setservicShow(false);
  const handleServiceShow = (itemId) => {
    setitemId(itemId);
    setservicShow(true);
  };
  const handleInServiceClose = () => setinservicShow(false);
  const handleInServiceShow = (itemId) => {
    setitemId(itemId);
    setinservicShow(true);
  };
  if (loading) {
    return (
      <>
        <center>
          <Spinner animation="border" />
        </center>
      </>
    );
  }

  if (error) {
    return (
      <>
        <center>
          <Alert variant="danger">Error: {error.message}</Alert>
        </center>
      </>
    );
  }

  if (value.size === 0) {
    return (
      <>
        <center>No Tables Availabe</center>;
      </>
    );
  }
  return (
    <>
      <table class="table table-custom table-bordered mt-5 ">
        <thead>
          <tr>
            <th scope="col">Table ID</th>
            <th scope="col">Table Name</th>
            <th scope="col">Capacity</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {value.docs.map((item) => (
            <tr>
              <th
                scope="row"
                className="chq"
                style={{ backgroundColor: "#f3f3f3" }}
              >
                {item.data().tableId}
              </th>
              <td style={{ backgroundColor: "#f3f3f3" }}>
                {" "}
                {item.data().tableName}
              </td>
              <td style={{ backgroundColor: "#f3f3f3" }}>
                {" "}
                {item.data().tableCapactiy}
              </td>
              <td style={{ backgroundColor: "#f3f3f3" }}>
                {" "}
                <button
                  className="icon-button"
                  onClick={() => handleShow(item.id)}
                >
                  <BsTrash />
                </button>
                {item.data().status!== "out_of_service" && (
                  <button
                    className="icon-button"
                    onClick={() => handleServiceShow(item.id)}
                  >
                    <BsRadioactive />
                  </button>
                )}
                {item.data().status === "out_of_service" && (
                  <button
                    className="icon-button"
                    onClick={() => handleInServiceShow(item.id)}
                  >
                    <BsDoorOpen />
                  </button>
                )}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          Are you sure you want to delete this table?
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            onClick={() => deleteItem(itemId)}
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
          >
            Delete
          </Button>

          <Button
            variant="dark"
            onClick={handleClose}
            style={{
              color: "#503aa4",
              backgroundColor: "white",
              borderColor: "#503aa4",
            }}
            className="rounded-pill"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={servicShow} onHide={handleServiceClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          Are you sure you want to mark this table out of service?
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            onClick={() => outOfService(itemId)}
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
          >
            Confirm
          </Button>

          <Button
            variant="dark"
            onClick={handleClose}
            style={{
              color: "#503aa4",
              backgroundColor: "white",
              borderColor: "#503aa4",
            }}
            className="rounded-pill"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={inservicShow} onHide={handleInServiceClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          Are you sure you want to mark this table available?
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            onClick={() => inService(itemId)}
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
          >
            Confirm
          </Button>

          <Button
            variant="dark"
            onClick={handleClose}
            style={{
              color: "#503aa4",
              backgroundColor: "white",
              borderColor: "#503aa4",
            }}
            className="rounded-pill"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TablesTableComponent;
