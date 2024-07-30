import MyNav from "../components/MyNav";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
} from "react-bootstrap";
import InfoStrip from "../components/InfoStrip";
import BillsTableComponent from "../components/BillsTableComponent";
const BillsPage = () => {

  return (
    <div className="vh-100 vw-100" style={{  }}>
      <MyNav />
      <div className="title-strip">
        <div>Bills</div>
      </div>
    <BillsTableComponent />
    </div>
  );
};
export default BillsPage;
