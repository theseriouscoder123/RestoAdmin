import { React, useState } from "react";
import "./component_styles/TableComponent.css";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, deleteDoc, doc } from "firebase/firestore";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { BsRadar, BsTable, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
const UserTableComponent = () => {
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const [itemId, setitemId] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (itemId) => {
    setitemId(itemId);
    setShow(true);
  };
  const [value, loading, error] = useCollection(
    query(collection(db, "users")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
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
    <>
      <center>
        <Alert variant="danger">Error: {error.message}</Alert>
      </center>
    </>;
  }

  if (value.size === 0) {
    return <center>No Users Availabe</center>;
  }
  const deleteItem = async (userId) => {
    await deleteDoc(doc(db, "users", userId)).then(() => {
      handleClose();
      setitemId("");
    });
  };
  const navToMangae = (areaId) => {
    //nav(`${areaId}`);
  };
  return (
    <>
      <center>
        {" "}
        <table class="table table-custom table-bordered mt-5 ">
          <thead>
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">User Name</th>
              <th scope="col">User Password</th>
              <th scope="col">Created On</th>

              <th scope="col">Action</th>
            </tr>{" "}
          </thead>
          <tbody>
            {value.docs.map((item) => (
              <tr>
                <th
                  scope="row"
                  className="chq"
                  style={{ backgroundColor: "#f3f3f3" }}
                >
                  {item.data().userID}
                </th>
                <td style={{ backgroundColor: "#f3f3f3" }}>
                  {" "}
                  {item.data().userName}
                </td>
                <td style={{ backgroundColor: "#f3f3f3" }}>
                  {" "}
                  {item.data().userPassword}
                </td>
                <td style={{ backgroundColor: "#f3f3f3" }}>
                  {" "}
                  {item.data().createdOn}
                </td>

                <td style={{ backgroundColor: "#f3f3f3" }}>
                  {" "}
                  <button
                    className="icon-button"
                    onClick={() => handleShow(item.id)}
                  >
                    <BsTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          Are you sure you want to delete this user?
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
    </>
  );
};

export default UserTableComponent;
