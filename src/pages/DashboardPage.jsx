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
import orders_purp from "../images/order_purp.png";
import orders_ora from "../images/order_ora.png";
import {
  SalesChart,
  TableStatus,
  TodayOrders,
  TopCats,
  TopItems,
  TopWaiters,
  TotalOrders,
  TotalSales,
} from "../components/dashboardComponents";
import { Link, NavLink } from "react-router-dom";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./AddMenuItems.css";
const DashboardPage = () => {

  return (
    <>
      <MyNav />

      <Container
        fluid
        style={{ justifyItems: "center", alignItems: "center" }}
        className="p-4"
      >
        <Row>
          <Col md={9}>
            <Row>
              <Col md={4}>
                <Card
                  style={{
                    border: "1px solid #F1C8C8",
                    backgroundColor: "#FFF2F2",
                    height: "20vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Row>
                        <Col md={3} className="mt-5">
                          <img src={orders_ora} alt="order" />
                        </Col>
                        <Col md={9} className="mt-4">
                          <Card.Text>
                            {" "}
                            <TodayOrders />
                          </Card.Text>
                          <h3 style={{ color: "#B16A6A" }}> Today's Orders</h3>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
              <Col md={4}>
                <Card
                  style={{
                    border: "1px solid #CCCCEE",
                    backgroundColor: "#F2F2FF",
                    height: "20vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Row>
                        <Col md={3} className="mt-5">
                          <img src={orders_purp} alt="order" />
                        </Col>
                        <Col md={9} className="mt-4">
                          <Card.Text>
                            <TotalOrders />
                          </Card.Text>
                          <h3 style={{ color: "#8181C1" }}>Total Orders</h3>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Container>
                </Card>
              </Col>{" "}
              <Col md={4}>
                <Card
                  style={{
                    border: "1px solid #E6D5E8",
                    backgroundColor: "#FEF2FF",
                    height: "20vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Row>
                        <Col md={3} className="mt-4">
                          <p style={{ color: "#A176A4", fontSize: "3em" }}>₹</p>
                        </Col>
                        <Col md={9} className="mt-4">
                          <Card.Text>
                            <TotalSales />
                          </Card.Text>
                          <h3 style={{ color: "#A176A4" }}>Total Sales</h3>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={8}>
                <Card
                  style={{
                    border: "1px solid #DFDCDB",

                    height: "40vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Card.Text>
                        <Card.Title style={{ color: "#E6534C" }}>
                          {" "}
                          <h4>Sales</h4>{" "}
                        </Card.Title>
                      </Card.Text>
             <SalesChart />
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
              <Col md={4}>
                <Card
                  style={{
                    border: "1px solid #DFDCDB",

                    height: "40vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Card.Text>
                        <Card.Title style={{ color: "#E6534C" }}>
                          {" "}
                          <h4>Top Category</h4>{" "}
                        </Card.Title>
                      </Card.Text>
                      <TopCats  />
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={5}>
                <Card
                  style={{
                    border: "1px solid #DFDCDB",

                    height: "20vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Card.Text>
                        <Card.Title style={{ color: "#E6534C" }}>
                          {" "}
                          <h4>Table Status</h4>{" "}
                        </Card.Title>
                      </Card.Text>
                      <TableStatus />
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
              <Col md={7}>
                <Card
                  style={{
                    border: "1px solid #DFDCDB",

                    height: "20vh",
                  }}
                >
                  <Container>
                    <Card.Body>
                      <Card.Text>
                        <Card.Title style={{ color: "#E6534C" }}>
                          {" "}
                          <h4>Shortcuts</h4>{" "}
                          <Row className="mt-4">
                            <Col
                              md={5}
                              style={{
                                backgroundColor: "#F5F2FF",
                                height: "6vh",
                                borderRadius: "10px",
                              }}
                            >
                              <Link to="/atmaster" className="nav-link">
                                <Row>
                                  <Col md={3}>
                                    <center>
                                      <img src={orders_purp} alt="" />
                                    </center>
                                  </Col>
                                  <Col
                                    md={9}
                                    style={{ color: "#503AA4" }}
                                    className="mt-3"
                                  >
                                    <center> Add/Edit Tables →</center>
                                  </Col>
                                </Row>
                              </Link>
                            </Col>
                            <Col md={2}></Col>
                            <Col
                              md={5}
                              style={{
                                backgroundColor: "#F5F2FF",
                                height: "6vh",
                                borderRadius: "10px",
                              }}
                            >
                              <Link to="/menumaster" className="nav-link">
                                <Row>
                                  <Col md={3}>
                                    <center>
                                      <img src={orders_purp} alt="" />
                                    </center>
                                  </Col>
                                  <Col
                                    md={9}
                                    style={{ color: "#503AA4" }}
                                    className="mt-3"
                                  >
                                    <center> Add/Edit Menu →</center>
                                  </Col>
                                </Row>
                              </Link>
                            </Col>
                          </Row>
                        </Card.Title>
                      </Card.Text>
                    </Card.Body>
                  </Container>
                </Card>
              </Col>
            </Row>
          </Col>

          <Col md={3}>
            <Col md={12}>
              <Card
                style={{
                  border: "1px solid #DFDCDB",

                  height: "40vh",
                }}
              >
                <Container>
                  <Card.Body>
                    <Card.Text>
                      <Card.Title style={{ color: "#E6534C" }}>
                        <h4>Top Items</h4> <TopItems />
                      </Card.Title>
                    </Card.Text>
                  </Card.Body>
                </Container>
              </Card>
            </Col>
            <Col md={12} className="mt-3">
              <Card
                style={{
                  border: "1px solid #DFDCDB",

                  height: "40vh",
                }}
              >
                <Container>
                  <Card.Body>
                    <Card.Text>
                      <Card.Title style={{ color: "#E6534C" }}>
                        {" "}
                        <h4>Top Waiters</h4> <TopWaiters />
                      </Card.Title>
                    </Card.Text>
                  </Card.Body>
                </Container>
              </Card>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default DashboardPage;
