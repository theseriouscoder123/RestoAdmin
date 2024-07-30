import { useParams } from "react-router-dom";
import MyNav from "../components/MyNav";
import { Table, Button, Form, Modal, Spinner, Alert } from "react-bootstrap";
import "../components/component_styles/InfoStrip.css";
import TablesTableComponent from "../components/TablesTableComponent";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  where,
  runTransaction,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MTable.css";

const ManageTablesPage = () => {
  const [showAddTable, setshowAddTable] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableCapactiy, setTableCapactiy] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleClose = () => setshowAddTable(false);
  const handleshowAddTable = () => setshowAddTable(true);
  async function generateId() {
    const counterRef = doc(db, "id", "table_ids");

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

      return `${areaId}_Table_${newId}`;
    } catch (error) {
      console.error("Error generating ID: ", error);
      throw error;
    }
  }

  const handleSubmit = async (e) => {
    setIsProcessing(true);
    e.preventDefault();
    var id = await generateId();
    addDoc(collection(db, "tables"), {
      tableId: id,
      tableCapactiy: tableCapactiy,
      status: "available",
      tableName: tableName,
      area: areaId,
    })
      .then(() => {
        handleClose();
        setIsProcessing(false);
      })
      .catch((error) => {
        console.error("Error adding record: ", error);
        setIsProcessing(false);
      });
  };

  // const [opt, setopt] = useState([]);
  // const fetchopt = async () => {
  //   const data = await getDocs(query(collection(db, "areas")));
  //   console.log(data.docs.length);
  //   data.docs.forEach((item) => {
  //     setopt([...opt, item.data().areaName]);
  //   });

  //   opt.forEach((e) => console.log(e));
  // };
  // useEffect(() => {
  //   fetchopt();
  // }, []);

  const { areaId } = useParams();

  return (
    <>
      <MyNav />
      <div className="title-strip">
        <div>Manage Tables for {areaId}</div>
        <div className="title-group">
          <Button
            variant="dark"
            style={{ backgroundColor: "#503aa4" }}
            className="rounded-pill"
            onClick={handleshowAddTable}
          >
            + Add Table
          </Button>
        </div>
      </div>
      <TablesTableComponent areaId={areaId} />
      <Modal show={showAddTable} onHide={handleClose} backdrop="static">
        <Modal.Header>
          <Modal.Title>Add a new table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formField1">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Table Name"
                onChange={(e) => setTableName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formField2" style={{ marginTop: "1vw" }}>
              <Form.Label>Table Capacity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Table Capacity"
                onChange={(e) => setTableCapactiy(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group controlId="selectAreaId">
              <Form.Label>Select area</Form.Label>
              <Form.Control as="select">
                {opt.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
            </Form.Group> */}
          </Form>{" "}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
            onClick={handleSubmit}
            disabled={isProcessing}
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
export default ManageTablesPage;
