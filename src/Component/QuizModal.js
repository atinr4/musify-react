import React, { Component } from "react";
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import { ScaleLoader } from "react-spinners";
import CircleAudioPlayer from "../Player/CircleAudioPlayer";

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
            questionIndex: 0,
            quizQuestion: [],
            showNext: false,
            buttonstate: true
        };

        this.handleToggle = this.handleToggle.bind(this);
        this.loadQuestion = this.loadQuestion.bind(this);
    }



    componentDidMount() {

        let token = localStorage.getItem('_token');
        if (this.props.user_data.lives > 0) {
            fetch(apiBaseUrl + '/spotify-category-playlist/' + this.state.category + '?access_token=' + token)
                .then(res => res.json())
                .then((data) => {
                    if (data.status != 200) {
                        this.setState({ showError: true })
                    } else {
                        this.setState({ playlist_tracks: data.tracklist }, () => {
                            this.loadQuestion();
                        });
                    }

                })
                .catch(console.log)
        }
    }

    handleToggle() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
        this.props.handleClose()
    }

    loadQuestion() {

        this.setState({
            showBody: true,
            showNext: false,
            buttonstate: true
        })
        if (this.state.questionIndex < this.state.playlist_tracks.length) {
            this.setState({
                quizQuestion: this.state.playlist_tracks[index]
            })

            let index = this.state.questionIndex;


            this.setState({
                questionIndex: this.state.questionIndex + 1
            })

            if (this.props.user_data.lives > 0) {
                this.cap = new CircleAudioPlayer({
                    audio: this.state.playlist_tracks[index].tracks_url,
                    size: 120,
                    borderWidth: 8
                });
                document.getElementById("playerContainer").innerHTML = "";
                this.cap.appendTo(document.getElementById("playerContainer"))
            }

            this.questionData = this.state.playlist_tracks[index].options_title;
            this.quiz = this.state.playlist_tracks[index].options;
            this.playListId = this.state.playlist_tracks[index].id;
        }
    }

    answerSelection = (option) => {
        this.setState({
            buttonstate: false
        })
        this.cap.pause();

        let formData = new FormData();
        formData.append('user_id', this.state.user_data.user_id);   //append the values with key, value pair
        formData.append('answer', option);
        formData.append('question_id', this.playListId);

        const requestOptions = {
            method: 'POST',
            body: formData,
        };
        fetch(apiBaseUrl + '/submit-answer', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                if (data.result == "correct") {
                    this.setState({
                        showNext: true
                    })
                }
            }).catch(console.log)

    }

    render() {
        return (

            <Modal onHide={this.handleToggle} show={this.state.isModalOpen} backdrop="static" className="modal-dialog modal-lg">
                <Modal.Body style={{ width: "100%" }}>
                    {this.state.showError && (
                        <Alert variant="danger">
                            Unable to create the Quiz. Serve Busy
                        </Alert>
                    )}

                    {(this.props.user_data.lives === 0) && (
                        <Alert variant="warning">
                            No life left
                        </Alert>
                    )}


                    <Col xs sm="12">
                        {(this.props.user_data.lives > 0) && (
                            <Col xs sm="12" style={{ textAlign: "center", fontSize: 18 }}><p>{this.props.category_name}</p></Col>
                        )}
                        {(this.props.user_data.lives > 0) && (
                            <hr></hr>
                        )}
                        {!this.state.showBody && (this.props.user_data.lives > 0) && (
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
                        <Col xs sm="12" id="playerContainer"></Col>
                        {this.state.showBody && (this.props.user_data.lives > 0) && (
                            <Col xs sm="12" style={{ textAlign: "center", fontSize: 18 }}><p>{this.questionData}</p></Col>
                        )}

                        {this.state.showBody && (this.props.user_data.lives > 0) && this.quiz.map((item, key) =>
                            <Col xs sm="12" key={key} style={{ textAlign: "center", fontSize: 18, padding: 5 }}>
                                <Button variant="outline-primary form-control" style={{ overflow: "hidden" }} onClick={this.answerSelection.bind(this, item)} disabled={!this.state.buttonstate}>{item}</Button>
                            </Col>
                        )}
                    </Col>

                    <Button variant="secondary" className="modal-close-button" onClick={this.handleToggle}>
                        X
                    </Button>
                    {this.state.showBody && this.state.showNext && (
                        <hr></hr>
                    )}
                    {this.state.showBody && this.state.showNext && (
                        <Button variant="secondary" onClick={this.loadQuestion} style={{ float: "right" }} >
                            Next
                        </Button>
                    )}
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