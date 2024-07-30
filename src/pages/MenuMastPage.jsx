import MyNav from "../components/MyNav";
import InfoStrip from "../components/InfoStrip";
import { Table } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import MenuTableComponenet from "../components/MenuTableComponenet";

const MenuMastPage = () => {
  const history = useNavigate();
  const handleSubmit = () => {
    history("add");
  };
  return (
    <>
      <MyNav />
      <InfoStrip title="Menu Master" addFunc={handleSubmit} />
    <MenuTableComponenet />
    </>
  );
};
export default MenuMastPage;
