import MyNav from "../components/MyNav";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import InfoStrip from "../components/InfoStrip";
import { ItemTableComponent } from "../components/ReportsTableComponent";
import { useState } from "react";
const ReportsPage = () => {
  const [show, setShow] = useState(false);
  const [reportType, setreportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (itemId) => {
    setShow(true);
  };
  const handleSubmit = () => {};
  return (
    <>
      <MyNav />

      <div className="title-strip">
        Sales Report
        <div className="">
          <Button
            variant="dark"
            style={{
              color: "white",
              backgroundColor: "#503aa4",
              borderColor: "#503aa4",
            }}
            className="rounded-pill"
            onClick={handleShow}
          >
            Change Report
          </Button>
        </div>
      </div>

      <ItemTableComponent />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Report</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.25em", fontWeight: "bold" }}>
          <Form className="custom-form" onSubmit={handleSubmit}>
            <Form.Group controlId="selectReportType">
              <Form.Label>Report Type:</Form.Label>
              <Form.Control
                as="select"
                value={reportType}
                onChange={(e) => setreportType(e.target.value)}
              >
                <option value="waiter">Waiter Wise</option>
                <option value="item">Item Wise</option>
                <option value="table">Table Wise</option>
                <option value="month">Monthly</option>
                <option value="day">Daily</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                disabled={reportType === "day" || reportType === "month"}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                disabled={reportType === "day" || reportType === "month"}
                onChange={(e) => setEndDate(e.target.value)}
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
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ReportsPage;
