import { Button } from "react-bootstrap";
import "./component_styles/InfoStrip.css";

const InfoStrip = ({ title,addFunc }) => {
  return (
    <>
      <div className="title-strip">
        <div>{title}</div>
        <Button variant="dark" style={{ backgroundColor: "#503aa4",  }} className="rounded-pill" onClick={addFunc}>
          + Add{" "}
        </Button>
      </div>
    </>
  );
};
export default InfoStrip;
