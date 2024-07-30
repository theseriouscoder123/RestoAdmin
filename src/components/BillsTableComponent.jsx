import { React, useState } from "react";
import "./component_styles/TableComponent.css";
import { db } from "../firebaseConfig";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query } from "firebase/firestore";
import {
  Spinner,
  Alert,
  Container,
  Row,
  Col,

} from "react-bootstrap";
import { BsDownload, BsEye} from "react-icons/bs";

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import BillViewComponent from "./BillViewComponent";
import {} from "react-pdf";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 5,
  },
  tableCol: {
    width: "20%", // Adjust width as needed
    textAlign: "left",
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 10,
  },
});

// Create Document Component
const BillDocument = ({ billData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Swagat Family Resto</Text>
      <View style={styles.section}>
        <Text>Settled On: {billData.settledOn}</Text>
        <Text>Table ID: {billData.tableId}</Text>
        <Text>Settled By: {billData.settledBy}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Item ID</Text>
          <Text style={styles.tableCol}>Item Name</Text>
          <Text style={styles.tableCol}>Price</Text>
          <Text style={styles.tableCol}>Quantity</Text>
          <Text style={styles.tableCol}>Total</Text>
        </View>
        {billData.items.map((item) => (
          <View key={item.itemId} style={styles.tableRow}>
            <Text style={styles.tableCol}>{item.itemId}</Text>
            <Text style={styles.tableCol}>{item.itemName}</Text>
            <Text style={styles.tableCol}>${item.price.toFixed(2)}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        {/* <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Burger</Text>
          <Text style={styles.tableCol}>$10.00</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Fries</Text>
          <Text style={styles.tableCol}>$5.00</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>Soda</Text>
          <Text style={styles.tableCol}>$2.00</Text>
        </View> */}
      </View>
      <View style={styles.total}>
        <Text>Total Value: ₹{billData.totalVal.toFixed(2)}</Text>
        <Text>Tax: ₹{billData.taxableVal.toFixed(2)}</Text>
        <Text>Payment Type: {billData.paymentType}</Text>
      </View>
    </Page>
  </Document>
);

const BillsTableComponent = () => {
  const [show, setShow] = useState(false);
  
  const [currentBill, setcurrentBill] = useState({
    billId: "",
    items: [],
    settledBy: "",
    settledOn: "",
    paymentType: "",
    totalVal: "",
    taxableVal: "",
    tableId: "",
  });
  const handleClose = () => setShow(false);
  const handleShow = (bill) => {
    setcurrentBill(bill);
    setShow(true);
  };

  const [value, loading, error] = useCollection(
    query(collection(db, "bills")),
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
    return <center>No Menu Items Availabe</center>;
  }


  return (
    <>
      <Container
        className="table-container"
        style={{ width: "90%", marginTop: "2vw" }}
        fluid
      >
        <Row className="table-header">
          <Col xs={1} className="th-cell">
            Bill Id
          </Col>
          <Col xs={2} className="th-cell">
            Table Id
          </Col>
          <Col xs={2} className="th-cell">
            Payment Type
          </Col>
          <Col xs={1} className="th-cell">
            Settled By
          </Col>
          <Col xs={2} className="th-cell">
            Settled On
          </Col>
          <Col xs={1} className="th-cell">
            Total Value
          </Col>
          <Col xs={1} className="th-cell">
            Tax
          </Col>

          <Col xs={1} className="th-cell">
            Actions
          </Col>
        </Row>
        {value.docs.map((item) => (
          <Row key={item.id} className="table-row">
            <Col xs={1} className="table-cell">
              {item.data().billId}
            </Col>
            <Col xs={2} className="table-cell" style={{ overflow: "clip" }}>
              {item.data().tableId}
            </Col>
            <Col xs={2} className="table-cell">
              {item.data().paymentType}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().settledBy}
            </Col>
            <Col xs={2} className="table-cell">
              {item.data().settledOn}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().totalVal}
            </Col>
            <Col xs={1} className="table-cell">
              {item.data().taxableVal}
            </Col>

            <Col xs={1} className="table-cell">
              <button
                className="icon-button"
                onClick={() => handleShow(item.data())}
              >
                <BsEye />
              </button>
              <PDFDownloadLink
                document={<BillDocument billData={item.data()} />}
                fileName= {item.data().billId+"_bill.pdf"}
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    "..."
                  ) : (
                    <button
                      className="icon-button"
                      style={{
                        marginLeft: "0.5vw",
                        textDecoration: "underline",
                      }}
                      about="Download bill"
                    >
                      <BsDownload />
                    </button>
                  )
                }
              </PDFDownloadLink>
            </Col>
          </Row>
        ))}
      </Container>
      <BillViewComponent
        show={show}
        handleClose={() => handleClose()}
        currentBill={currentBill}
      />
    </>
  );
};

export default BillsTableComponent;
