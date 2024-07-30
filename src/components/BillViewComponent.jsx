import { Modal, Button, Table } from "react-bootstrap";
const BillViewComponent = ({ currentBill, show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>View Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Bill ID: {currentBill.billId}</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentBill !== null &&
              currentBill.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price * item.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <p>
          <strong>Total Value:</strong> {currentBill.totalVal}
        </p>
        <p>
          <strong>Tax:</strong> {currentBill.taxableVal}
        </p>
        <p>
          <strong>Payment Type:</strong> {currentBill.paymentType}
        </p>
        <p>
          <strong>Settled By:</strong> {currentBill.settledBy}
        </p>
        <p>
          <strong>Settled On:</strong> {currentBill.settledOn}
        </p>
        <p>
          <strong>Table ID:</strong> {currentBill.tableId}
        </p>
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
      >
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
  );
};
export default BillViewComponent;
