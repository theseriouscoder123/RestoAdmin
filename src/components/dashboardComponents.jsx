import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Spinner, Alert, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const data = [
  {
    label: "Ads",
    value: 32,
  },
  {
    label: "Subscriptions",
    value: 45,
  },
  {
    label: "Sponsorships",
    value: 23,
  },
];
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
        <Spinner animation="border" />
      </>
    );
  }

  if (error) {
    <>
      <Alert variant="danger">Error: {error.message}</Alert>
    </>;
  }

  if (value.size === 0) {
    return <>No Orders yet!</>;
  }
  return (
    <>
      <h2>{value.size}</h2>
    </>
  );
};
const TodayOrders = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  console.log(formattedDate);
  const isToday = (dateString) => {
    const [day, month, year] = dateString.split(" ")[0].split("/").map(Number);
    const date = new Date(year + 2000, month - 1, day); // Assuming year is in YY format

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  const filterToday = (list) => list.filter(isToday);
  const [value, loading, error] = useCollection(
    query(collection(db, "bills")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return (
      <>
        <Spinner animation="border" />
      </>
    );
  }

  if (error) {
    <>
      <Alert variant="danger">Error: {error.message}</Alert>
    </>;
  }

  if (value.size === 0) {
    return <>No Orders yet!</>;
  }

  return (
    <>
      <h2>
        {value.docs.filter((item) => isToday(item.data().settledOn)).length}
      </h2>
    </>
  );
};
const TotalSales = () => {
  const [value, loading, error] = useCollection(
    query(collection(db, "bills")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  if (loading) {
    return (
      <>
        <Spinner animation="border" />
      </>
    );
  }

  if (error) {
    <>
      <Alert variant="danger">Error: {error.message}</Alert>
    </>;
  }

  if (value.size === 0) {
    return <>No Orders yet!</>;
  }
  const getTotalSales = () => {
    var sales = 0;
    value.docs.forEach((item) => {
      sales += item.data().totalVal;
    });
    return sales;
  };
  return (
    <>
      <h2>{getTotalSales()}</h2>
    </>
  );
};
const TopItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "bills"));
      let itemSales = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.items.forEach((item) => {
          if (itemSales[item.itemId]) {
            itemSales[item.itemId].quantity += item.quantity;
            itemSales[item.itemId].totalSales += item.quantity * item.price;
          } else {
            itemSales[item.itemId] = {
              itemName: item.itemName,
              quantity: item.quantity,
              totalSales: item.quantity * item.price,
            };
          }
        });
      });
      const sortedItems = Object.values(itemSales).sort(
        (a, b) => b.totalSales - a.totalSales
      );
      setItems(sortedItems);
    };

    fetchData();
  }, []);

  return (
    <>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          height: "30vh",
          color: "black",
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* If you want to add an image, uncomment the following line */}
              {/* <img src="path_to_image" alt={item.itemName} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} /> */}
              <span>{item.itemName}</span>
            </div>
            <span style={{ fontWeight: "bold", color: "#333" }}>
              ₹{item.totalSales.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
const TopWaiters = () => {
  const [settlers, setSettlers] = useState([]);

  useEffect(() => {
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

      setSettlers(sortedSettlers);
    };

    fetchData();
  }, []);

  return (
    <>
      {settlers.length !== 0 && (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            height: "30vh",
            color: "black",
          }}
        >
          {settlers.map((settler, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{settler.settledBy}</span>
              </div>
              <span style={{ fontWeight: "bold", color: "#333" }}>
                ₹{settler.totalSales.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

const SalesChart = () => {
  const [status, setStatus] = useState("loading");
  const initialData = [
    { label: "Jan", value: 0, num: 1 },
    { label: "Feb", value: 0, num: 2 },
    { label: "Mar", value: 0, num: 3 },
    { label: "Apr", value: 0, num: 4 },
    { label: "May", value: 0, num: 5 },
    { label: "Jun", value: 0, num: 6 },
    { label: "Jul", value: 0, num: 7 },
    { label: "Aug", value: 0, num: 8 },
    { label: "Sep", value: 0, num: 9 },
    { label: "Oct", value: 0, num: 10 },
    { label: "Nov", value: 0, num: 11 },
    { label: "Dec", value: 0, num: 12 },
  ];
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      const querySnapshot = await getDocs(collection(db, "bills"));
      const newData = initialData.map((item) => ({ ...item, value: 0 })); // Reset values to 0

      querySnapshot.forEach((billItem) => {
        let date = billItem.data().settledOn;
        let [dateStr, timeStr] = date.split(" "); // Split the date and time
        let [day, month, year] = dateStr.split("/"); // Split the date into day, month, year
        let monthNum = parseInt(month, 10);
        let item = newData.find((item) => item.num === monthNum);
        if (item) {
          item.value += billItem.data().totalVal;
        }
      });

      console.log("New data:", newData);
      setData(newData);
      setStatus("loaded");
    };

    fetchData();
  }, []); // Only run once when the component mounts

  if (status === "loading") {
    return (
      <center>
        <Spinner />
      </center>
    );
  }

  return (
    <Col
      md={12}
      style={{ height: "32vh", alignItems: "center", display: "flex" }}
    >
      <Bar
        data={{
          labels: data.map((data) => data.label),
          datasets: [
            {
              label: "Sales",
              data: data.map((data) => data.value),
              backgroundColor: ["rgba(255, 138, 35, 1)"],
              borderRadius: 5,
            },
          ],
        }}
        options={{
          plugins: {
            title: {},
          },
          legend: {
            display: false,
          },
          responsive: true,
        }}
      />
    </Col>
  );
};

const TableStatus = () => {
  const [value, loading, error] = useCollection(
    query(collection(db, "tables")),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const initialData = [
    { label: "Occupied", text: "occupied", value: 0, color: "#F59E0A" },
    { label: "Available", text: "available", value: 0, color: "#15B8A6" },
    {
      label: "Out of service",
      text: "out_of_service",
      value: 0,
      color: "#EB4999",
    },
  ];
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (loading) return;

    const newData = initialData.map((item) => ({ ...item })); // Reset values to 0

    value.docs.forEach((table) => {
      let item = newData.find((item) => item.text === table.data().status);
      if (item) {
        item.value += 1;
      }
    });

    setData(newData);
  }, [value, loading]); // Only run when value or loading changes

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Error: {error.message}</Alert>;
  }

  if (value.size === 0) {
    return null;
  }

  return (
    <>
      <Row>
        <Col
          md={4}
          style={{ height: "10vh", alignItems: "center", display: "flex" }}
        >
          <center
            style={{ height: "10vh", alignItems: "center", display: "flex" }}
          >
            <Pie
              data={{
                labels: data.map((data) => data.label),
                datasets: [
                  {
                    data: data.map((data) => data.value),
                    backgroundColor: [
                      "rgba(245, 158, 10, 1)",
                      "rgba(21, 184, 166, 1)",
                      "rgba(235, 73, 153, 1)",
                    ],
                    borderColor: [
                      "rgba(245, 158, 10, 1)",
                      "rgba(21, 184, 166, 1)",
                      "rgba(235, 73, 153, 1)",
                    ],
                  },
                ],
              }}
              options={{
                radius: "100%",
                plugins: {
                  title: {
                    display: false, // Hides the title
                  },
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </center>
        </Col>
        <Col md={8}>
          {data.map((item) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <h5 style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: item.color, // Change this to any color you like
                        marginRight: "10px",
                      }}
                    ></div>
                    {item.label}
                  </h5>
                </div>
                <div>
                  <h5>{item.value}</h5>
                </div>
              </div>
            );
          })}
        </Col>
      </Row>
    </>
  );
};

const TopCats = () => {
  const [data, setData] = useState([]);
  var colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A6"];
  var [counter, setCounter] = useState(0);

  const hashStringToNumber = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  const hashNumberToColor = (hash) => {
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };
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
    data.forEach((item) => {
      const colVal = colors[counter];
      setData(data =>
        data.map(w =>
          w.category === item.category ? { ...item, colVal: colVal } : item
        )
      );
 
      var c = counter;
      c++;
      setCounter(c);
    });
  };
  return (
    <>
      <Col md={12} style={{ height: "20vh" }}>
        <center style={{ height: "20vh" }}>
          <Pie
            data={{
              labels: data.map((data) => data.category),
              datasets: [
                {
                  data: data.map((data) => data.totalSales),
                  backgroundColor: colors,
                  borderColor: colors,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Revenue Sources",
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </center>
      </Col>
      {data.map((item) => {
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h5 style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                    // Change this to any color you like
                      marginRight: "10px",
                    }}
                  ></div>
                  {item.category}
                </h5>
              </div>
              <div>
                <h5>{item.totalSales}</h5>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};
export {
  TotalOrders,
  TodayOrders,
  TotalSales,
  TopItems,
  TopWaiters,
  SalesChart,
  TopCats,
  TableStatus,
};
