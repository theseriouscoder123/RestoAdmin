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
const AreaTableMastPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [areaName, setAreaName] = useState("");
  const [areaDesc, setAreaDesc] = useState("");
  const [areaPrice, setAreaPrice] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  async function generateId() {
    const counterRef = doc(db, "id", "area_ids");

    try {
      const newId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists) {
          throw new Error("Counter document does not exist!");
        }

        const newCount = counterDoc.data().count + 1;
        transaction.update(counterRef, { count: newCount });
        return newCount;
      });

      return `Area${newId}`;
    } catch (error) {
      console.error("Error generating ID: ", error);
      throw error;
    }
  }
  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    var id = await generateId();
    await addDoc(collection(db, "areas"), {
      areaId: id,
      areaDesc: areaDesc,
      areaPrice: areaPrice,
      areaName: areaName,
    })
      .then(() => {
        setAreaDesc("");
        setAreaPrice(0);
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
      <InfoStrip title="Area & Table Master" addFunc={handleShow} />
      <AreaTableComponenet />
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add a new area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="custom-form" onSubmit={handleSubmit}>
            <Form.Group controlId="formField1">
              <Form.Label>Area Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Area Name"
                onChange={(e) => setAreaName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formField2" style={{ marginTop: "1vw" }}>
              <Form.Label>Area Description</Form.Label>
              <Form.Control
                type="text"
                as="input"
                rows={3}
                placeholder="Enter Area Description"
                onChange={(e) => setAreaDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formField3" style={{ marginTop: "1vw" }}>
              <Form.Label>Area Pricing(%)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Area Pricing"
                onChange={(e) => setAreaPrice(e.target.value)}
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

export default AreaTableMastPage;
