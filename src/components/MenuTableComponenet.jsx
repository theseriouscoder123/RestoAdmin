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
const MenuTableComponenet = () => {
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const [itemId, setitemId] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (itemId) => {
    setitemId(itemId);
    setShow(true);
  };
  const [value, loading, error] = useCollection(query(collection(db, "menu")), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
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
    return <center>No Menu Items Availabe</center>;
  }
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "menu", itemId)).then(() => {
      handleClose();
      setitemId("");
    });
  };
  const navToMangae = (areaId) => {
    //nav(`${areaId}`);
  };
  return (
    <>
      <Container
        className="table-container"
        style={{ width: "90%", marginTop: "2vw" }}
        fluid
      >
        <Row className="table-header">
          <Col xs={1} className="th-cell">
            Item Id
          </Col>
          <Col xs={1} className="th-cell">
            Item Name
          </Col>
          <Col xs={3} className="th-cell">
            Item Description
          </Col>
          <Col xs={1} className="th-cell">
            Category
          </Col>
          <Col xs={1} className="th-cell">
            Cuisine
          </Col>
          <Col xs={2} className="th-cell">
            Base Price
          </Col>
          <Col xs={1} className="th-cell">
            Tax Rate
          </Col>
          <Col xs={1} className="th-cell">
            Short Code
          </Col>
          <Col xs={1} className="th-cell">
            Actions
          </Col>
        </Row>
        {value.docs.map((item) => (
          <Row key={item.id} className="table-row">
            <Col xs={1} className="table-cell">
            {item.data().itemId}
            </Col>
            <Col xs={1} className="table-cell" style={{overflow:"clip"}}>
              {item.data().itemName}
            </Col>
            <Col xs={3} className="table-cell">
              {item.data().description}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().category}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().cuisine}
            </Col>
            <Col xs={2} className="table-cell">
              {item.data().basePrice}
            </Col>
            <Col xs={1} className="table-cell" >
              {item.data().taxRate}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().shortCode}
            </Col>
            <Col xs={1} className="table-cell">
              <button
                className="icon-button"
                onClick={() => handleShow(item.id)}
              >
                <BsTrash />
              </button>
              <button
                className="icon-button"
                style={{ marginLeft: "0.5vw", textDecoration: "underline" }}
                onClick={() => navToMangae(item.data().areaId)}
              >
               <BiSolidEdit />
              </button>
            </Col>
          </Row>
        ))}
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          Are you sure you want to delete this menu item?
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

export default MenuTableComponenet;
