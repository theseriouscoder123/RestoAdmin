import InfoStrip from "../components/InfoStrip";
import MyNav from "../components/MyNav";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useState } from "react";
import {
  addDoc,
  collection,
  query,
  runTransaction,
  updateDoc,
  increment,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import AreaTableComponenet from "../components/AreaTableComponent";
import UserTableComponent from "../components/UserTableComponent";
const UserPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [userName, setUserName] = useState("");
  const [userID, setuserID] = useState("");
  const [userPassword, setuserPassword] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    //  var id = await generateId();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US");
    await addDoc(collection(db, "users"), {
      userID: userID,
      userPassword: userPassword,
      userName: userName,
      createdOn: formattedDate,
      active: true,
    })
      .then(() => {
        setUserName("");
        setuserID("");
        setuserPassword("");

        handleClose();
        setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Error adding record: ", error);
      });
  };

  return (
    <>
      <MyNav />
      <InfoStrip title="Users Master" addFunc={handleShow} />
      <UserTableComponent />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add a new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="custom-form" onSubmit={handleSubmit}>
            <Form.Group controlId="formField1">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Name"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formField2" style={{ marginTop: "1vw" }}>
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                as="input"
                rows={3}
                placeholder="Enter User ID"
                onChange={(e) => setuserID(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formField3" style={{ marginTop: "1vw" }}>
              <Form.Label>User Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User Password"
                onChange={(e) => setuserPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            onClick={handleSubmit}
            disabled={isProcessing}
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
          >
            Save
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
            disabled={isProcessing}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserPage;
