import React, { Component } from "react";
import logo from "../logo.png";
import { Navbar } from 'react-bootstrap';

class NavComponent extends Component {
    render() {
        return (
            <Navbar expand="lg">
                <Navbar.Brand href="#"><img src={logo} style={{ height: 80 }} /> <span>Musify</span></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>
        )
    };
}

export default NavComponent;