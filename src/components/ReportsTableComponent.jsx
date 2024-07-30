import { React, useState, useEffect } from "react";
import "./component_styles/TableComponent.css";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  DocumentReference,
} from "firebase/firestore";
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
const ItemTableComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  //   const getTables = (tableData, areaId) => {
  //     var tables = 0;
  //     tableData.forEach((doc) => {
  //       var data = doc.data();
  //       if (data["area"] == areaId) {
  //         console.log("bolo")
  //         tables++;
  //       }
  //     });
  //     return tables;
  //   };
  const getCategory = (catData, itemId) => {
    var category = "";
    catData.forEach((doc) => {
      var data = doc.data();
      if (data["itemId"] == itemId) {
        category = data["category"];
      }
    });
    return category;
  };
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "bills"));

    const docSnap = await getDocs(collection(db, "menu"));

    let itemSales = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.items.forEach((item) => {
        if (itemSales[item.itemId]) {
          itemSales[item.itemId].quantity += item.quantity;
          itemSales[item.itemId].totalSales += item.quantity * item.price;
        } else {
          itemSales[item.itemId] = {
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            totalSales: item.quantity * item.price,
            category: getCategory(docSnap, item.itemId),
          };
        }
      });
    });
    const sortedItems = Object.values(itemSales).sort(
      (a, b) => b.totalSales - a.totalSales
    );
    setData(sortedItems);
  };
  const fetchTableWise = async () => {
    const querySnapshot = await getDocs(collection(db, "bills"));

    const docSnap = await getDocs(collection(db, "menu"));

    let itemSales = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.items.forEach((item) => {
        if (itemSales[item.itemId]) {
          itemSales[item.itemId].quantity += item.quantity;
          itemSales[item.itemId].totalSales += item.quantity * item.price;
        } else {
          itemSales[item.itemId] = {
            itemId: item.itemId,
            itemName: item.itemName,
            quantity: item.quantity,
            price: item.price,
            totalSales: item.quantity * item.price,
            category: getCategory(docSnap, item.itemId),
          };
        }
      });
    });
    const sortedItems = Object.values(itemSales).sort(
      (a, b) => b.totalSales - a.totalSales
    );
    setData(sortedItems);
  };
  if (data.length === 0) {
    return <Spinner />;
  } else {
    return (
      <>
         <center
            style={{  fontSize: "1.5em", fontWeight: "500" }}
          >
            Item wise Report
          </center>
        <Container
          className="table-container"
          style={{ width: "90%", marginTop: "2vw" }}
          fluid
        >
       
          <Row className="table-header">
            <Col xs={1} className="th-cell">
              Item Id
            </Col>
            <Col xs={2} className="th-cell">
              Item Name
            </Col>
            <Col xs={2} className="th-cell">
              Item Category
            </Col>
            <Col xs={2} className="th-cell">
              Item Quantity
            </Col>
            <Col xs={1} className="th-cell">
              Item Price
            </Col>
            <Col xs={1} className="th-cell">
              Total Sales
            </Col>
          </Row>
          {data.map((item) => (
            <Row key={item.docId} className="table-row">
              <Col xs={1} className="table-cell">
                {item.itemId}
              </Col>
              <Col xs={2} className="table-cell">
                {item.itemName}
              </Col>
              <Col xs={2} className="table-cell">
                {item.category}
              </Col>
              <Col xs={2} className="table-cell">
                {item.quantity}
              </Col>
              <Col xs={1} className="table-cell">
                {item.price}
              </Col>
              <Col xs={1} className="table-cell">
                {item.totalSales}
              </Col>
            </Row>
          ))}
        </Container>
      </>
    );
  }
};
const WaiterTableComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  //   const getTables = (tableData, areaId) => {
  //     var tables = 0;
  //     tableData.forEach((doc) => {
  //       var data = doc.data();
  //       if (data["area"] == areaId) {
  //         console.log("bolo")
  //         tables++;
  //       }
  //     });
  //     return tables;
  //   };
  const getCategory = (catData, itemId) => {
    var category = "";
    catData.forEach((doc) => {
      var data = doc.data();
      if (data["itemId"] == itemId) {
        category = data["category"];
      }
    });
    return category;
  };
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "bills"));
    let settlersSales = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { settledBy, items } = data;

      if (!settlersSales[settledBy]) {
        settlersSales[settledBy] = 0;
      }

      items.forEach((item) => {
        settlersSales[settledBy] += item.price * item.quantity;
      });
    });

    // Convert object to array and sort by total sales
    const sortedSettlers = Object.entries(settlersSales)
      .map(([settledBy, totalSales]) => ({ settledBy, totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales);

    setData(sortedSettlers);
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
              Item Id
            </Col>
            <Col xs={2} className="th-cell">
              Item Name
            </Col>
            <Col xs={2} className="th-cell">
              Item Category
            </Col>
            <Col xs={2} className="th-cell">
              Item Quantity
            </Col>
            <Col xs={1} className="th-cell">
              Item Price
            </Col>
            <Col xs={1} className="th-cell">
              Total Sales
            </Col>
          </Row>
          {data.map((item) => (
            <Row key={item.docId} className="table-row">
              <Col xs={1} className="table-cell">
                {item.itemId}
              </Col>
              <Col xs={2} className="table-cell">
                {item.itemName}
              </Col>
              <Col xs={2} className="table-cell">
                {item.category}
              </Col>
              <Col xs={2} className="table-cell">
                {item.quantity}
              </Col>
              <Col xs={1} className="table-cell">
                {item.price}
              </Col>
              <Col xs={1} className="table-cell">
                {item.totalSales}
              </Col>
            </Row>
          ))}
        </Container>
      </>
    );
  }
};
export { ItemTableComponent, WaiterTableComponent };
