import { React, useState, useEffect } from "react";
import "./component_styles/TableComponent.css";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, deleteDoc, doc, getDocs, } from "firebase/firestore";
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
const AreaTableComponenet = () => {
  const [show, setShow] = useState(false);
  const nav = useNavigate();
  const [itemId, setitemId] = useState("");
  const [data, setData] = useState([]);
  const handleClose = () => setShow(false);

  const handleShow = (itemId) => {
    setitemId(itemId);
    setShow(true);
  };
  // const [value, loading, error] = useCollection(
  //   query(collection(db, "areas")),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  // if (loading) {
  //   return (
  //     <>
  //       <center>
  //         <Spinner animation="border" />
  //       </center>
  //     </>
  //   );
  // }

  // if (error) {
  //   <>
  //     <center>
  //       <Alert variant="danger">Error: {error.message}</Alert>
  //     </center>
  //   </>;
  // }

  // if (value.size === 0) {
  //   return <center>No Areas Availabe</center>;
  // }
  useEffect(() => {
    fetchData();
  }, []);
  const deleteItem = async (itemId) => {
    await deleteDoc(doc(db, "areas", itemId)).then(() => {
      handleClose();
      setitemId("");
    });
  };
  const navToMangae = (areaId) => {
    nav(`${areaId}`);
  };
  const getTables = (tableData, areaId) => {
    var tables = 0;
  
    tableData.forEach((doc) => {
      
      var data = doc.data();
      if (data["area"] == areaId) {
        console.log("bolo")
        tables++;
      }
    });
    return tables;
  };
  const getCapacity = (tableData, areaId) => {
    var capactiy = 0;
    tableData.forEach((doc) => {
      var data = doc.data();
      if (data["area"] == areaId) {
        capactiy += Number(data["tableCapactiy"]);
      }
    });
    return capactiy;
  };
  const fetchData = async () => {
    var tableData = await getDocs(query(collection(db, "tables")));
    var area = await getDocs(query(collection(db, "areas")));
    var list=[];
    area.forEach((areaItem) => {
      var obj = {
        docId: areaItem.id,
        areaId: areaItem.data()["areaId"],
        areaName: areaItem.data()["areaName"],
        areaDesc: areaItem.data()["areaDesc"],
        areaPrice: areaItem.data()["areaPrice"],
        totalTables: getTables(tableData, areaItem.data()["areaId"]),
        totalCapacity: getCapacity(tableData, areaItem.data()["areaId"]),
      };
     list.push(obj);
    });
    console.log(list.length);
    setData(list)
  };
  if (data.length === 0) {
    return <Spinner />;
  } else {
    return (
      <>
        <Container
          className="table-container"
          style={{ width: "90%", marginTop: "2vw" }}
          fluid
        >
          <Row className="table-header">
            <Col xs={1} className="th-cell">
              Area Id
            </Col>
            <Col xs={2} className="th-cell">
              Area Name
            </Col>
            <Col xs={3} className="th-cell">
              Area Description
            </Col>
            <Col xs={1} className="th-cell">
              Total Capacity
            </Col>
            <Col xs={1} className="th-cell">
              Total Tables
            </Col>
            <Col xs={2} className="th-cell">
              Menu Pricing
            </Col>
            <Col xs={2} className="th-cell">
              Actions
            </Col>
          </Row>
          {data.map((item) => (
            <Row key={item.docId} className="table-row">
              <Col xs={1} className="table-cell">
                {item.areaId}
              </Col>
              <Col xs={2} className="table-cell">
                {item.areaName}
              </Col>
              <Col xs={3} className="table-cell">
                {item.areaDesc}
              </Col>
              <Col xs={1} className="table-cell">
              {item.totalCapacity}
              </Col>
              <Col xs={1} className="table-cell">
              {item.totalTables}
              </Col>
              <Col xs={2} className="table-cell">
                {item.areaPrice}
              </Col>
              <Col xs={2} className="table-cell">
                <button
                  className="icon-button"
                  onClick={() => handleShow(item.docId)}
                >
                  <BsTrash />
                </button>
                <button
                  className="icon-button"
                  style={{ marginLeft: "0.5vw", textDecoration: "underline" }}
                  onClick={() => navToMangae(item.areaId)}
                >
                  Add/Edit Tables
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
            Are you sure you want to delete this area? This will also delete all
            tables associated with this area!
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
  }
};

export default AreaTableComponenet;
