import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import AreaTableMastPage from "./pages/AreaTableMastPage";
import MenuMastPage from "./pages/MenuMastPage";
import AddMenuItems from "./pages/AddMenuItems";
import ManageTablesPage from "./pages/ManageTablesPage";
import { auth } from "./firebaseConfig"; // Make sure the path to your firebase.js file is correct
import UserPage from "./pages/UserPage";
import { Spinner } from "react-bootstrap";
import BillsPage from "./pages/BillsPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div>
        <center>
          <Spinner />
        </center>
      </div>
    ); // Optionally render a loading indicator
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <DashboardPage /> : <Navigate to="/" />}
        />
        <Route
          path="/atmaster"
          element={user ? <AreaTableMastPage /> : <Navigate to="/" />}
        />
        <Route
          path="/atmaster/:areaId"
          element={user ? <ManageTablesPage /> : <Navigate to="/" />}
        />
        <Route
          path="/menumaster"
          element={user ? <MenuMastPage /> : <Navigate to="/" />}
        />
        <Route
          path="/usermaster"
          element={user ? <UserPage /> : <Navigate to="/" />}
        />
        <Route
          path="/bills"
          element={user ? <BillsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/menumaster/add"
          element={user ? <AddMenuItems /> : <Navigate to="/" />}
        />
        <Route
          path="/reports"
          element={user ? <ReportsPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
