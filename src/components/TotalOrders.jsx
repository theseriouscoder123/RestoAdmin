import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Spinner,Alert } from "react-bootstrap";
const TotalOrders = () => {
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
    return <center>No Orders Yet!</center>;
  }
  return <>
  <h2>{value.size}</h2>
  </>;
};
export default TotalOrders;
