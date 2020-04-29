import React, { Component } from "react";
import { Modal, Button, Form, Image, Col, Row, Alert } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import ImageUploader from 'react-images-upload';
import logo from "../logo.png";
import { BounceLoader } from "react-spinners";

class FirstLoginModal extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            id: this.props.user.id,
            name: '',
            email: '',
            isModalOpen: true,
            pictures: [],
            profile_image: logo,
            imageUploadSuccess: false,
            uploadProcess: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggle = this.handleToggle.bind(this);

        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        this.setState({
            name: this.props.user.name,
            email: this.props.user.email,
        })

        if (this.props.user.profile_image) {
            this.setState({
                profile_image: this.props.user.profile_image
            })
        }
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

    onDrop(picture) {
        const formData = new FormData();
        formData.append('files', picture[0]);
        formData.append('user_id', this.state.id);

        const requestOptions = {
            method: 'POST',
            body: formData
        };

        this.setState({
            uploadProcess: true,
        })

        fetch(apiBaseUrl + '/upload', requestOptions)
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    profile_image: data.user_data.profile_image,
                    imageUploadSuccess: true,
                    uploadProcess: false
                })
                this.props.updateUser(data);
            }).catch(console.log)
    }

    render() {
        return (

            <Modal onHide={this.handleToggle} show={this.state.isModalOpen} backdrop="static">

                <Modal.Header >
                    <Modal.Title>Is your details are okay?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.imageUploadSuccess && (
                        <Alert variant={'success'}>
                            Profile Image Successfully Updated
                        </Alert>
                    )}
                    <div className="custom-loader" style={{paddingLeft: '42%'}}>
                        <BounceLoader
                            size={60}
                            color={"#F5A623"}
                            loading={this.state.uploadProcess}
                        />
                    </div>
                    {!this.state.uploadProcess && (
                        <Row>
                            <Col xs="4" lg="3" style={{ paddingTop: 38 }}>
                                <Image src={this.state.profile_image} roundedCircle style={{ height: 110 }} />
                            </Col>
                            <Col xs="8" lg="9">
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                />
                            </Col>
                        </Row>
                    )}

                    <Form onSubmit={this.handleSubmit}>

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