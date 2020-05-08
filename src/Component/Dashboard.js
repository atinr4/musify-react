import React, { Component } from "react";
import { Image, ListGroup, Col, Row, Container, ProgressBar, Card, Modal, Button } from 'react-bootstrap';
import { FaHeart } from "react-icons/fa";
import Slider from "react-slick";
import hash from "../hash";
import { apiBaseUrl } from "../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { css } from "@emotion/core";
import { PropagateLoader, ScaleLoader } from "react-spinners";
import logo from "../logo.png";

import HomeLeaderBoard from "./HomeLeaderBoard";
import NavComponent from "./NavComponent";
import MenuComponent from "./MenuComponent";
import FirstLoginModal from "./FirstLoginModal";
import ProgressionComponent from "./ProgressionComponent";
import QuizModal from "./QuizModal";
import Swal from 'sweetalert2'
import { Redirect } from "react-router-dom";


const override = css`
  display: block;
  margin: 0 auto;
`;


class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      navigate: false,
      user_data: [],
      progression: 10,
      categories: [],
      loading: true,
      viewPopup: true,
      player: null,
      category_loading: true,
      show_modal: false,
      category: '',
      category_name: '',
      profile_image: logo
    };
  }



  componentDidMount() {
    let _token = hash.access_token;

    if (_token != undefined)
      localStorage.setItem('_token', _token);

    this.getCurrentUser(localStorage.getItem('_token'));
    this.getCategories(localStorage.getItem('_token'));
    let visited = localStorage["alreadyVisited"];

    if (visited) {
      this.setState({ viewPopup: false })
      //do not view Popup
    } else {
      //this is the first time
      localStorage["alreadyVisited"] = true;
      this.setState({ viewPopup: true });
    }
  }

  getCurrentUser(token) {
    fetch(apiBaseUrl + '/spotify-user-details?access_token=' + token)
      .then(res => res.json())
      .then((data) => {
        if (data.status != 401) {
          this.setState({ user_data: data })

          if (this.state.user_data.profile_image) {
            this.setState({ profile_image: this.state.user_data.profile_image })
          }

          let level = this.state.user_data.level;
          let progess = ((this.state.user_data.total_xp - ((level * 1000) - 1000)) * 100) / ((level * 1000) - this.state.user_data.total_xp);

          this.setState({ progression: progess })
          this.setState({ loading: false })
        } else {
          localStorage.removeItem('_token')
          localStorage.setItem('_token', undefined);
          this.setState({ navigate: true });
        }

      })
      .catch(console.log)
  }

  getCategories(token) {

    fetch(apiBaseUrl + '/spotify-categories?access_token=' + token)
      .then(res => res.json())
      .then((data) => {
        this.setState({ categories: data })
        this.setState({ category_loading: false })

      })
      .catch(console.log)
  }

  updateUser(data) {
    this.setState({
      user_data: data.user_data,
      profile_image: data.user_data.profile_image
    })
  }

  handleClose(user_data) {
    this.setState({
      loading: true,
      show_modal: false,
      user_data: user_data,
    })

    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 100)
  }

  startQuiz(evt) {
    let timerInterval;
    Swal.fire({
      title: '<h4>Are you want to play the Quiz?</h4>',
      html: "<span style='font-size: 16px;'>Your selected quiz category is: " + evt[1] + "</span>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Lets get started!'
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          title: 'Be Ready!',
          html: 'Quiz will start in <b></b>',
          timer: 6000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
              if (content) {
                const b = content.querySelector('b')
                if (b) {
                  b.textContent = Math.ceil(Swal.getTimerLeft() / 1000)
                }
              }
            }, 1000)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            setTimeout(() => {
              this.setState({
                show_modal: true,
                category: evt[0],
                category_name: evt[1]
              });
            }, 500)
          }
        })
      }
    })
  }

  openProfile() {
    this.setState({ viewPopup: true });
  }

  toggleModal() {
    this.setState({ viewPopup: false });
  }

  render() {
    if (this.state.navigate) {
      return <Redirect to="/" push={true} />
    }
    return (

      <Container fluid style={{ padding: 0 }}>
        <NavComponent />
        {!this.state.loading && this.state.viewPopup && (
          <FirstLoginModal toggleModal={this.toggleModal.bind(this)} user={this.state.user_data} updateUser={this.updateUser.bind(this)} />
        )}

        <Container fluid>
          <Row className="justify-content-md-center">
            <Col lg="2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col xs="4" md="6"><Image src={this.state.profile_image} roundedCircle style={{ height: 110 }} /></Col>

                    <Col xs="8" md="6">
                      {!this.state.loading && (
                        <p className="no-margin">{this.state.user_data.name}</p>
                      )}
                      {!this.state.loading && (
                        <p className="no-margin">{this.state.user_data.streak}</p>
                      )}
                      {!this.state.loading && (
                        <p className="no-margin" style={{ fontSize: 11 }}><b>{this.state.user_data.total_xp} XP          <span style={{ float: "right" }}>Rank: {this.state.user_data.level}</span></b></p>
                      )}
                      {!this.state.loading && (
                        <ProgressBar animated striped variant="success" now={this.state.progression} />
                      )}
                      {!this.state.loading && (
                        <p className="no-margin" style={{ color: '#ca1111', letterSpacing: 2 }}>
                          {Array.from(Array(this.state.user_data.lives), (e, i) => {
                            return <FaHeart key={i} />
                          })}
                        </p>
                      )}

                      <ScaleLoader
                        height={35}
                        width={4}
                        radius={2}
                        margin={2}
                        color={"#F5A623"}
                        loading={this.state.loading}
                      />

                    </Col>
                  </Row>
                </ListGroup.Item>
                {!this.state.category_loading && !this.state.loading && (
                  <MenuComponent openProfile={this.openProfile.bind(this)} startQuiz={this.startQuiz.bind(this)} data={this.state.categories} user_data={this.state.user_data} />
                )}

                {this.state.show_modal && (
                  <QuizModal handleClose={this.handleClose.bind(this)} category={this.state.category} category_name={this.state.category_name} user_data={this.state.user_data} />
                )}
                <ListGroup.Item><span style={{ color: '#bbb', fontSize: 12 }}>Musify your Brain</span></ListGroup.Item>
              </ListGroup>
            </Col>
            <Col lg="6">

              <Category data={this.state.categories} startQuiz={this.startQuiz.bind(this)} />

              <Row style={{ padding: 10 }}>
                <Col lg="5">
                  {!this.state.loading && (
                    <ProgressionComponent data={this.state.user_data} />
                  )}
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
                </Col>
                <Col lg="7">
                  {!this.state.loading && (
                    <HomeLeaderBoard />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>

      </Container >

    )
  };
}

export default Dashboard;

class CategoryDetails extends Component {
  constructor(prop) {
    super(prop)
  }

  startQuiz(id) {
    this.props.startQuiz(id);
  }

  render() {
    var title = this.props.data.name,
      id = this.props.data.id;
    return (
      <Card style={{ width: '18rem', height: 170 }} className="category-card">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Link onClick={this.startQuiz.bind(this, [id, title])} className="category-button">Play Quiz</Card.Link>
        </Card.Body>
      </Card>
    )
  }
}
class Category extends Component {

  constructor(prop) {
    super(prop)
  }

  startQuiz(id) {
    this.props.startQuiz(id);
    console.log(id);
  }


  render() {
    var data = this.props.data;
    var newsTemplate;
    var settings = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
    }
    if (data.length > 0) {
      newsTemplate = data.map((item, index) => {
        return (
          <div key={index}>
            <CategoryDetails data={item} startQuiz={this.startQuiz.bind(this)} />
          </div>
        )
      })
    } else {
      newsTemplate = <PropagateLoader
        size={15}
        color={"#F5A623"}
      />
    }
    return (
      <div className='news'>
        <Slider {...settings}>{newsTemplate}</Slider>
        <strong className={'news__count ' + (data.length > 0 ? '' : 'none')}>
          Total Categories: {data.length}
        </strong>
      </div>
    );
  }
}