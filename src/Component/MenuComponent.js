import React, { Component } from "react";
import { FaList, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import { GiJoystick, GiDuality } from "react-icons/gi";
import { Nav, ListGroup, Button, Dropdown, FormControl } from 'react-bootstrap';
import { Redirect } from "react-router-dom";


class MenuComponent extends Component {

    constructor(prop) {
        super(prop);
        this.state = {
            navigate: false,
            categories: this.props.data,
            user_data: this.props.user_data,

        };
        this.logOut = this.logOut.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
    }

    startQuiz(evt) {
        let array = evt.split(",");
        this.props.startQuiz(array);
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
            <div>
                <ListGroup.Item>
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Dropdown onSelect={this.startQuiz}>
                            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                                Quick Play
                            </Dropdown.Toggle>
                            <Dropdown.Menu as={CustomMenu} >

                                {this.state.categories.map((item, key) =>
                                    <Dropdown.Item eventKey={[item.id, item.name]} key={item.id} >{item.name}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Nav.Link eventKey="link-1"><GiDuality /> Dual Play</Nav.Link>
                        <Nav.Link eventKey="link-2"><FaList /> Leaderboard</Nav.Link>
                        <Nav.Link eventKey="link-2"><FaUserCog /> Pofile</Nav.Link>

                        <Button onClick={this.logOut} ><FaSignOutAlt /> Logout</Button>
                    </Nav>
                </ListGroup.Item>


            </div>
        );
    }
}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (

    <a href="" ref={ref} onClick={(e) => {
        e.preventDefault();
        onClick(e);
    }}
        className="nav-link"
    >
        <GiJoystick />
        {children}
        <span style={{ fontSize: 12, marginLeft: 3 }}>&#x25bc;</span>
    </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
        const [value, setValue] = React.useState('');

        return (
            <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
            >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                />
                <ul>
                    {React.Children.toArray(children).filter(
                        (child) =>
                            !value || child.props.children.toLowerCase().startsWith(value),
                    )}
                </ul>
            </div>
        );
    },
);

export default MenuComponent;