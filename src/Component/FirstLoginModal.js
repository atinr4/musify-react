import React, { Component } from "react";
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import ImagesUploader from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';


class FirstLoginModal extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            id: this.props.user.id,
            name: '',
            email: '',
            isModalOpen: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        this.setState({
            name: this.props.user.name,
            email: this.props.user.email
        })


    }

    getInitialState() {
        return {
            isModalOpen: false
        };
    }

    handleToggle() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
        this.props.toggleModal()
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    handleSubmit(event) {
        let formData = new FormData();
        formData.append('name', this.state.name);   //append the values with key, value pair
        formData.append('user_id', this.state.id);

        const requestOptions = {
            method: 'POST',
            body: formData
        };
        fetch(apiBaseUrl + '/user-details-update', requestOptions)
            .then(response => response.json())
            .then((data) => {

                this.setState({
                    isModalOpen: !this.state.isModalOpen
                });
                this.props.updateUser(data);
                this.props.toggleModal()
            }).catch(console.log)

        event.preventDefault();
    }

    render() {
        return (

            <Modal onHide={this.handleToggle} show={this.state.isModalOpen} backdrop="static">

                <Modal.Header >
                    <Modal.Title>Is your details are okay?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={this.handleSubmit}>
                        <ImagesUploader
                            url={apiBaseUrl + '/upload'}
                            optimisticPreviews
                            multiple={false}
                            onLoadEnd={(err) => {
                                if (err) {
                                    console.error(err);
                                }
                            }}
                        />
                        <Form.Group controlId="formBasicEmail" >
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Name" value={this.state.name} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={this.state.email} readOnly={true} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleToggle}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>
        )
    }
}

export default FirstLoginModal;