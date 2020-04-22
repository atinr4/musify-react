import React, { Component } from "react";
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import CircleAudioPlayer from "../Player/CircleAudioPlayer";
import Countdown from "react-countdown";
import { ScaleLoader } from "react-spinners";

class QuizModal extends Component {

    constructor(prop) {
        super(prop);
        this.state = {
            isModalOpen: true,
            category: this.props.category,
            categoryname: this.props.category_name,
            user_data: this.props.user_data,
            playlist_tracks: [],
            showBody: false,
            showError: false,
        };

        this.handleToggle = this.handleToggle.bind(this);
    }



    componentDidMount() {

        let token = localStorage.getItem('_token');
        fetch(apiBaseUrl + '/spotify-category-playlist/' + this.state.category + '?access_token=' + token)
            .then(res => res.json())
            .then((data) => {
                if (data.status != 200) {
                    this.setState({ showError: true })
                } else {
                    this.setState({ playlist_tracks: data.tracklist, showBody: true })
                    let cap = new CircleAudioPlayer({
                        audio: this.state.playlist_tracks[0].tracks_url,
                        size: 120,
                        borderWidth: 8
                    });
                    console.log(this.state.playlist_tracks);
                    cap.appendTo(document.getElementById("playerContainer"))
                }

            })
            .catch(console.log)
    }

    handleToggle() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
        this.props.handleClose()
    }

    render() {
        return (

            <Modal onHide={this.handleToggle} show={this.state.isModalOpen} backdrop="static" className="modal-dialog modal-lg">


                <Modal.Body style={{ width: "100%" }}>
                    {/* <Countdown date={Date.now() + 5000} renderer={renderer} /> */}
                    {this.state.showError && (
                        <Alert variant="danger">
                            Unable to create the Quiz. Serve Busy
                        </Alert>
                    )}

                    {!this.state.showBody && (
                        <div className="custom-loader">
                            <ScaleLoader
                                height={35}
                                width={4}
                                radius={2}
                                margin={2}
                                color={"#F5A623"}
                                loading={this.state.loading}
                            />
                        </div>
                    )}
                    {this.state.showBody && (
                        <div>
                            <Row>
                                <Col xs sm="12" style={{ textAlign: "center", fontSize: 24, padding: 20 }}>{this.state.categoryname}</Col>
                                <Col xs sm="12" id="playerContainer"></Col>
                                <Col xs sm="12" style={{ textAlign: "center", fontSize: 18 }}><p>Who sang this song?</p></Col>
                                <Col xs sm="12" style={{ textAlign: "center", fontSize: 18 }}>
                                    <Button variant="outline-primary form-control">Primary</Button>
                                </Col>
                            </Row>

                        </div>
                    )}
                    <Button variant="secondary" className="modal-close-button" onClick={this.handleToggle}>
                        X
                    </Button>
                </Modal.Body>
            </Modal>
        )
    }
}

export default QuizModal;

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ seconds, completed }) => {
    if (completed) {
        // Render a complete state
        return <Completionist />;
    } else {
        // Render a countdown
        return (
            <span>
                {seconds}
            </span>
        );
    }
};