import React, { Component } from "react";
import { FaList, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { GiJoystick, GiDuality } from "react-icons/gi";
import { Nav, ListGroup, Button } from 'react-bootstrap';
import { Redirect } from "react-router-dom";

class MenuComponent extends Component {

    constructor() {
        super();
        this.state = {
            navigate: false
        };
        this.logOut = this.logOut.bind(this);
    }


    logOut() {
        localStorage.removeItem("_token");
        this.setState({ navigate: true });
    };

    render() {

        if (this.state.navigate) {
            return <Redirect to="/" push={true} />
        }

        return (
            <ListGroup.Item>
                <Nav defaultActiveKey="/home" className="flex-column">
                    <Nav.Link href="/home"><GiJoystick /> Qucik Play</Nav.Link>
                    <Nav.Link eventKey="link-1"><GiDuality /> Dual Play</Nav.Link>
                    <Nav.Link eventKey="link-2"><FaList /> Leaderboard</Nav.Link>
                    <Nav.Link eventKey="link-2"><FaUserCog /> Pofile</Nav.Link>
                    <Button onClick={this.logOut} ><FaSignOutAlt /> Logout</Button>
                </Nav>
            </ListGroup.Item>
        );
    }
}

export default MenuComponent;