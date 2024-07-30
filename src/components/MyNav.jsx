import React from "react";
import { NavDropdown,Navbar, Nav, Container } from "react-bootstrap";
import {
  BsSpeedometer,
  BsPeople,
  BsTools,
  BsBarChart,
  BsGear,
  BsFolder,
  BsHouseExclamation,
  BsBell,
  BsList,
} from "react-icons/bs";
import "./component_styles/MyNav.css";

import { Link, NavLink } from "react-router-dom";

const MyNav = () => {
  return (
    <>
      <div className="info-strip">
        <div className="info-group">
          <p style={{ color: "#F55951", fontWeight: "bold" }}>
            ADMIN APPLICATION
          </p>
          <p>Swagat Family Restarunt</p>
        </div>
        <p>
          <BsBell />{" "}
        </p>
      </div>
      <Navbar
        expand="md"
        style={{ backgroundColor: "#F55951" }}
        variant="dark" // Change variant to "dark" for white text
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavLink to="/dashboard" className="nav-link">
              <BsSpeedometer className="nav-icon" />
              Dashboard
            </NavLink>
            <NavDropdown drop="down"
              title={
                <span>
                  <BsFolder className="nav-icon" /> Masters
                </span>
              }
              id="masters-dropdown"
            >
              <NavDropdown.Item href="/atmaster">
              <span>
                  <BsFolder className="nav-icon" color="#e6534c" /> Area & Table Master
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item href="/menumaster">
              <span>
                  <BsFolder className="nav-icon"   color="#e6534c"/> Menu Master
                </span>
              </NavDropdown.Item>
              <NavDropdown.Item href="/usermaster">
              <span>
                  <BsFolder className="nav-icon"  color="#e6534c"/> User Master
                </span>
              </NavDropdown.Item>
            </NavDropdown>
            <NavLink to="/bills" className="nav-link">
              <BsList className="nav-icon" />
              Bills
            </NavLink>
            <NavLink to="/reports" className="nav-link">
              <BsBarChart className="nav-icon" />
              Reports
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default MyNav;
