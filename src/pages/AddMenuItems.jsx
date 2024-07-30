import MyNav from "../components/MyNav";
import { Container, Modal, Form, Row, Col, Button } from "react-bootstrap";
import "../components/component_styles/InfoStrip.css";
import "./AddMenuItems.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  getDocs,
  query,
} from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const AddMenuItems = () => {
  //Modal Hooks
  const [showVariant, setShowVariant] = useState(false);
  const variantHandleClose = () => {
    if (variants.length !== 0 && variantName === "") {
      alert("Enter Variant Name");
    } else {
      setShowVariant(false);
    }
  };
  const variantHandleShow = () => setShowVariant(true);
  const [showAddOns, setShowAddOns] = useState(false);
  const addOnsHandleClose = () => setShowAddOns(false);
  const addOnsHandleShow = () => setShowAddOns(true);
  //
  //firebase hooks
  const [catData, setcatData] = useState([]);
  const [cuisData, setcuisData] = useState([]);

  //Form hooks
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [cuisine, setCuisine] = useState("italian");
  const [category, setCategory] = useState("appetizers");
  const [basePrice, setBasePrice] = useState();
  const [taxRate, setTaxRate] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [status, setStatus] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [validated, setValidated] = useState(false);
  //Addon Hooks
  const [addOnName, setAddOnName] = useState("");
  const [extraPrice, setExtraPrice] = useState("");
  const [addOns, setAddOns] = useState([]);
  //Variant hooks
  const [variantName, setVariantName] = useState("");
  const [variantOpt, setvariantOpt] = useState("");
  const [variantsPrice, setvariantsPrice] = useState("");
  const [variants, setvariants] = useState([]);

  const nav = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const uploadFile = async () => {
    const file = selectedFile;
    if (!file) return;
    const storageRef = ref(storage, `menu_images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.then(async (snapshot) => {
      var url = await getDownloadURL(snapshot.ref);
      setImgUrl(url);
    });
    // uploadTask.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progress = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setProgresspercent(progress);
    //   },
    //   (error) => {
    //     alert(error);
    //   },
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //       setImgUrl(downloadURL);
    //       console.log(imgUrl);
    //     });
    //   }
    // );
  };

  const fetchData = async () => {
    var filters = await getDocs(query(collection(db, "filters")));
    filters.docs.forEach((filter) => {
      if (filter.id == "categories") {
        setcatData(filter.data()["categories"]);
      }
      if (filter.id == "cuisines") {
        setcuisData(filter.data()["cuisines"]);
      }
    });
  };
  async function generateId() {
    const counterRef = doc(db, "id", "menu_ids");

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

      return `Item${newId}`;
    } catch (error) {
      console.error("Error generating ID: ", error);
      throw error;
    }
  }
  const addMenuItem = async () => {
    setIsProcessing(true);
    // const file = selectedFile;
    // if (!file) {
    //   alert("Add a image");
    //   setIsProcessing(false);
    //   return;
    // }
    // setStatus("Uploading file");
    // const storageRef = ref(storage, `menu_images/${file.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, file).then(
    //   async (snapshot) => {
    //     var url = await getDownloadURL(snapshot.ref);
    //     setImgUrl(url);
    //   }
    // );

    //    alert(imgUrl);
    setStatus("Adding Item");
    var id = await generateId();
    if (variants.length !== 0) {
      await addDoc(collection(db, "menu"), {
        itemId: id,
        itemName: itemName,
        description: description,
        shortCode: shortCode,
        cuisine: cuisine,
        category: category,
        basePrice: basePrice,
        taxRate: taxRate,
        addOns: addOns,
        imgUrl: imgUrl,
        variants: {
          variantName: variantName,
          options: variants,
        },
      }).then((w) => {
        nav("/menumaster");
      });
    } else {
      await addDoc(collection(db, "menu"), {
        itemId: id,
        itemName: itemName,
        description: description,
        shortCode: shortCode,
        cuisine: cuisine,
        category: category,
        basePrice: basePrice,
        taxRate: taxRate,
        addOns: addOns,
        imgUrl: imgUrl,
        variants: {
          variantName: variantName,
          options: [],
        },
      }).then((w) => {
        nav("/menumaster");
      });
    }
  };
  const createAddOn = () => {
    const addOn = {
      addOnName: addOnName,
      extraPrice: extraPrice,
    };
    setAddOns([...addOns, addOn]);
    setAddOnName("");
    setExtraPrice(0);
    addOns.forEach((e) => console.log(e));
    console.log("w");
  };
  const removeAddOn = (value) => {
    setAddOns((items) => items.filter((i) => i["addOnName"] != value));
  };
  const createVariant = () => {
    const variant = {
      variantOpt: variantOpt,
      variantsPrice: variantsPrice,
    };
    setvariants([...variants, variant]);
    setvariantOpt("");
    setvariantsPrice(0);
  };
  const removeVariant = (value) => {
    setvariants((items) => items.filter((i) => i["variantOpt"] != value));
  };
  const formHeaderStyle = {
    color: "#e6534c",
    fontSize: "1.5em",
    fontWeight: "500",
  };
  const formLabelStyle = {
    color: "#00000",
    fontSize: "1em",
    fontWeight: "500",
  };
  const stickyStyle = {
    position: "-webkit-sticky",
    position: "sticky",
    top: 0,
    zIndex: 1020 /* Bootstrap's z-index for fixed/sticky navbars */,
  };
  const stickyBottomStyle = {
    position: "-webkit-sticky" /* For Safari */,
    position: "sticky",
    bottom: 0,
    width: "100%",
    zIndex: 1020 /* Bootstrap's z-index for fixed/sticky navbars */,
    height: "5vh" /* Set height to 10% of the viewport height */,
    /* Set width to 100% */
    backgroundColor: "#ffeeee" /* Set a background color */,
  };
  const discard = () => {
    nav("/menumaster");
  };
  return (
    <>
      <div style={stickyStyle}>
        <MyNav />
        <div className="title-strip">
          <div>Add Menu Item</div>
          <div>{status !== "" && <div>{status}</div>}</div>
          <div className="title-group">
            <Button
              variant="dark"
              style={{
                color: "#503aa4",
                backgroundColor: "white",
                borderColor: "#503aa4",
              }}
              className="rounded-pill"
              //  onClick={discard}
              onClick={discard}
              disabled={isProcessing}
            >
              Discard
            </Button>
            <Button
              variant="dark"
              style={{ backgroundColor: "#503aa4" }}
              className="rounded-pill"
              onClick={addMenuItem}
              disabled={isProcessing}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      <Form>
        <Container fluid style={{ padding: "2%", paddingTop: "1%" }}>
          <div>
            <div style={formHeaderStyle}>Basic Details</div>
            <div>
              <Row className="mb-3" style={{ marginTop: "1vw" }}>
                <Col xs={2}>
                  <Form.Group controlId="formField1">
                    <Form.Label style={formLabelStyle}>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Item Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group controlId="formField2">
                    <Form.Label style={formLabelStyle}>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={2}>
                  <Form.Group controlId="formField3">
                    <Form.Label style={formLabelStyle}>Short Code</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Short Code"
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>
          <div style={formHeaderStyle}>Categoristion</div>

          <div>
            <Row className="mb-3" style={{ marginTop: "1vw" }}>
              <Col xs={3}>
                <Form.Group controlId="selectAreaId">
                  <Form.Label style={formLabelStyle}>Cuisine</Form.Label>
                  {cuisData.length !== 0 && (
                    <Form.Control
                      as="select"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                    >
                      {cuisData.map((cuisine) => {
                        return <option value={cuisine}>{cuisine}</option>;
                      })}
                    </Form.Control>
                  )}
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="formField2">
                  <Form.Label style={formLabelStyle}>Category</Form.Label>
                  {catData.length !== 0 && (
                    <Form.Control
                      as="select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {catData.map((cat) => {
                        return <option value={cat}>{cat}</option>;
                      })}
                    </Form.Control>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div style={formHeaderStyle}>Pricing</div>
          <div>
            <Row className="mb-3" style={{ marginTop: "1vw" }}>
              <Col xs={3}>
                <Form.Group controlId="formField1">
                  <Form.Label style={formLabelStyle}>Base Price</Form.Label>
                  <Form.Control
                    placeholder="Enter Base Price"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={3}>
                <Form.Group controlId="formField2">
                  <Form.Label style={formLabelStyle}>Tax Rate</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Tax Rate"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div style={formHeaderStyle}>Product Image</div>
          <div>
            <Row className="mb-3" style={{ marginTop: "1vw" }}>
              <Col xs={3}>
                <Form.Group controlId="formFile">
                  <Form.Label style={formLabelStyle}>Upload</Form.Label>

                  <Form.Control
                    type="file"
                    style={{ backgroundColor: "#e6534c", color: "white" }}
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
              <Col></Col>
            </Row>
          </div>
          <div style={formHeaderStyle}>Add ons</div>
          <div style={{ marginTop: "0.5vw" }}>
            <Button
              variant="dark"
              style={{
                color: "#503aa4",
                backgroundColor: "white",
                borderColor: "#503aa4",
                alignSelf: "center",
                marginBottom: "0.5vw",
              }}
              className="rounded-pill"
              onClick={addOnsHandleShow}
            >
              Create Add Ons
            </Button>
          </div>
          <div style={formHeaderStyle}>Variants</div>
          <div style={{ marginTop: "0.5vw" }}>
            <Button
              variant="dark"
              style={{
                color: "#503aa4",
                backgroundColor: "white",
                borderColor: "#503aa4",
                alignSelf: "center",
              }}
              className="rounded-pill"
              onClick={variantHandleShow}
            >
              Create Variants
            </Button>
          </div>
        </Container>
      </Form>
      {/* //VARIANT MODAL */}
      <Modal
        show={showVariant}
        onHide={variantHandleClose}
        style={{ right: "0", top: "0" }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Create Variants
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="custom-form">
            <Form.Group controlId="formField1">
              <Form.Label style={formLabelStyle}>Variant Name</Form.Label>
              <Form.Control
                placeholder="Enter Name"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
              />
            </Form.Group>{" "}
            <Row className="mb-3 mt-3">
              <Col xs={5}>
                <Form.Group controlId="formField1">
                  <Form.Label style={formLabelStyle}>Option</Form.Label>
                  <Form.Control
                    placeholder="Enter Option"
                    value={variantOpt}
                    onChange={(e) => setvariantOpt(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={5}>
                <Form.Group controlId="formField2">
                  <Form.Label style={formLabelStyle}>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Price"
                    value={variantsPrice}
                    onChange={(e) => setvariantsPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Button
                  variant="light"
                  className="mb-3"
                  onClick={createVariant}
                >
                  +
                </Button>
              </Col>
            </Row>
            <hr />
            {variants.map((val) => (
              <Row className="mb-3">
                <Col xs={5}>
                  <Form.Group controlId="formField1">
                    <Form.Label style={formLabelStyle}>
                      Variant Option
                    </Form.Label>
                    <Form.Control
                      placeholder={val["variantOpt"]}
                      value={val["variantOpt"]}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col xs={5}>
                  <Form.Group controlId="formField2">
                    <Form.Label style={formLabelStyle}>
                      Variant Price
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={val["variantsPrice"]}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col xs={2}>
                  <Button
                    variant="danger"
                    className="mb-3"
                    onClick={() => removeVariant(val["variantOpt"])}
                  >
                    <FaTrashAlt />
                  </Button>
                </Col>
              </Row>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
            onClick={variantHandleClose}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //ADD ON MODAL */}
      <Modal
        show={showAddOns}
        onHide={addOnsHandleClose}
        style={{ right: "0", top: "0" }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Create Add Ons
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Row className="mb-3">
            <Col xs={5}>
              <Form.Group controlId="formField1">
                <Form.Label style={formLabelStyle}>Add On Name</Form.Label>
                <Form.Control
                  placeholder="Enter Name"
                  value={addOnName}
                  onChange={(e) => setAddOnName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={5}>
              <Form.Group controlId="formField2">
                <Form.Label style={formLabelStyle}>Extra Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Extra Price"
                  value={extraPrice}
                  onChange={(e) => setExtraPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Button variant="light" className="mb-3" onClick={createAddOn}>
                +
              </Button>
            </Col>
          </Row>
          <hr />
          {addOns.map((val) => (
            <Row className="mb-3">
              <Col xs={5}>
                <Form.Group controlId="formField1">
                  <Form.Label
                    style={formLabelStyle}
                    onChange={(e) => setAddOnName(e.target.value)}
                  >
                    Add On Name
                  </Form.Label>
                  <Form.Control
                    placeholder={val["addOnName"]}
                    value={val["addOnName"]}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={5}>
                <Form.Group controlId="formField2">
                  <Form.Label style={formLabelStyle}>Extra Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Extra Price"
                    value={val["extraPrice"]}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={2}>
                <Button
                  variant="danger"
                  className="mb-3"
                  onClick={() => removeAddOn(val["addOnName"])}
                >
                  <FaTrashAlt />
                </Button>
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#ffeeee", justifyContent: "end" }}
        >
          <Button
            variant="dark"
            className="rounded-pill"
            style={{ backgroundColor: "#503aa4", borderColor: "#503aa4" }}
            onClick={addOnsHandleClose}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddMenuItems;
