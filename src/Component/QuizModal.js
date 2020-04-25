import React, { Component } from "react";
import { Modal, Button, Badge, Col, Alert } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import { ScaleLoader } from "react-spinners";
import CircleAudioPlayer from "../Player/CircleAudioPlayer";
import { FaHeart, FaConnectdevelop } from "react-icons/fa";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

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
            buttonstate: true,
            showWrong: false,
            showWrongNext: false,
            finishQuiz: false,
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
                .catch( err => {
                    err.text().then( errorMessage => {
                        this.setState({ showError: true })
                    })
                })
        }
    }

    handleToggle() {

        if(this.cap) {
             this.cap.pause();
        }
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
                    
        this.props.handleClose(this.state.user_data)
        
    }

    loadQuestion() {

        this.setState({
            showBody: true,
            showNext: false,
            buttonstate: true,
            showWrong: false,
            showWrongNext: false,
            finishQuiz:false,
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
                this.cap.appendTo(document.getElementById("playerContainer"));
                setTimeout(() => {
                    this.cap.play();
                }, 100)
            }

            this.questionData = this.state.playlist_tracks[index].options_title;
            this.quiz = this.state.playlist_tracks[index].options;
            this.playListId = this.state.playlist_tracks[index].id;
        } else {
            document.getElementById("playerContainer").innerHTML = "";
            this.setState ({
                finishQuiz: true,
                showBody: false,
                showNext: false,
            })
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

        this.answer = option;
        fetch(apiBaseUrl + '/submit-answer', requestOptions)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                if (data.result == "correct") {
                    this.setState({
                        showNext: true,
                        user_data: data.user_profile
                    })
                } else {
                    if(data.user_profile.lives > 0) {
                        this.setState({
                            showWrongNext: true,
                            user_data: data.user_profile
                        })
                    } else {
                        this.setState({
                            showWrong: true,
                            user_data: data.user_profile
                        })
                    }
                    
                }
            }).catch(console.log)

    }

    render() {
        return (

            <Modal onHide={this.handleToggle} show={this.state.isModalOpen} backdrop="static" className="modal-dialog modal-lg">
                <Modal.Body style={{ width: "100%" }}>                    
                    <Col xs sm="12">
                        <Badge variant="primary" style={{marginRight: 10}}><FaConnectdevelop/> {this.state.user_data.streak}</Badge> 
                        <span className="no-margin" style={{ color: '#ca1111', letterSpacing: 2 }}>
                            
                            {Array.from(Array(this.state.user_data.lives), (e, i) => {
                                return <FaHeart key={i} />
                            })}
                            
                        </span>
                        <Badge variant="warning" style={{marginRight: 10, float: "right"}}>{this.state.user_data.total_xp} XP</Badge> 
                        <Badge variant="success" style={{marginRight: 10, float: "right"}}>Level {this.state.user_data.level}</Badge> 
                        
                    </Col>    
                    <Col xs sm="12">
                        {(this.props.user_data.lives > 0) && (
                            <Col xs sm="12" style={{ textAlign: "center", fontSize: 18 }}><p>{this.props.category_name}</p></Col>
                        )}
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

                        {(this.props.user_data.lives > 0) && (
                            <hr></hr>
                        )}
                        {this.state.finishQuiz || (!this.state.showBody && (this.props.user_data.lives > 0)) && (
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

                        {this.state.showNext && (
                            <Alert variant="success" style={{textAlign: "center"}}>
                                Your answer "{this.answer}" is correct. Lets go to the next one
                            </Alert>
                        )}

                        {(this.state.showWrong || this.state.showWrongNext) && (
                            <Alert variant="danger" style={{textAlign: "center"}}>
                                Your answer "{this.answer}" is wrong. Can't continue more..
                            </Alert>
                        )}

                        { this.state.finishQuiz && (
                            <Alert variant="warning" style={{textAlign: "center"}}>
                                Your quiz hasbeen ended
                            </Alert>
                        )}

                        {!this.state.showWrong && !this.state.showWrongNext && !this.state.showNext && this.state.showBody && (this.props.user_data.lives > 0) && this.quiz.map((item, key) =>
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
                    <Col xs sm="12">
                        {this.state.showBody && (this.state.showNext || this.state.showWrongNext) && (
                            <Button variant="secondary" onClick={this.loadQuestion} style={{ float: "right" }} >
                                Next
                            </Button>
                        )}
                        {this.state.showWrong && (
                            <Alert variant="warning">
                                No life left
                            </Alert>
                        )}
                        {(this.state.showWrong || this.state.finishQuiz) && (
                            <Button variant="secondary" onClick={this.handleToggle} style={{ float: "right" }} >
                                Finish Quiz
                            </Button>
                        )}
                    </Col>
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