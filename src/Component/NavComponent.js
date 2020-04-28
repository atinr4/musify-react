import React, { Component } from "react";
import logo from "../logo.png";
import { Navbar } from 'react-bootstrap';

class NavComponent extends Component {
    render() {
        return (
            <Navbar expand="lg"  sticky="top">
                <Navbar.Brand href="#"><img src={logo} style={{ height: 80 }} /> <span>Musify</span></Navbar.Brand>
            </Navbar>
        )
    };
}

export default NavComponent;