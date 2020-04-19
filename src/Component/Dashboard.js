import React, { Component } from "react";
import { Image, ListGroup, Col, Row, Container, ProgressBar, Card, Modal, Button } from 'react-bootstrap';
import { FaHeart, } from "react-icons/fa";
import Slider from "react-slick";
import hash from "../hash";
import { apiBaseUrl } from "../config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { css } from "@emotion/core";
import { PropagateLoader, ScaleLoader } from "react-spinners";

import HomeLeaderBoard from "./HomeLeaderBoard";
import NavComponent from "./NavComponent";
import MenuComponent from "./MenuComponent";
import FirstLoginModal from "./FirstLoginModal";

const override = css`
  display: block;
  margin: 0 auto;
`;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      user_data: [],
      progression: 10,
      categories: [],
      loading: true,
      viewPopup: true
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

          let level = Math.ceil(this.state.user_data.total_xp / 1000)
          let progess = (this.state.user_data.total_xp * 100) / (level * 1000);
          this.setState({ progression: progess })
          this.setState({ loading: false })
        } else {
          localStorage.removeItem('_token')
          localStorage.setItem('_token', undefined);
        }

      })
      .catch(console.log)
  }

  getCategories(token) {
    fetch(apiBaseUrl + '/spotify-categories?access_token=' + token)
      .then(res => res.json())
      .then((data) => {
        this.setState({ categories: data })
      })
      .catch(console.log)
  }

  updateUser(data) {
    this.setState({
      user_data: data.user_data
    })
  }

  render() {
    return (

      <Container fluid style={{ padding: 0 }}>
        <NavComponent />

        {!this.state.loading && this.state.viewPopup && (
          <FirstLoginModal user={this.state.user_data} updateUser={this.updateUser.bind(this)} />
        )}

        <Container fluid>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col><Image src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1133104406718030&height=300&width=300&ext=1589611514&hash=AeRDghJAQ9QGHDHP" roundedCircle style={{ height: 100 }} /></Col>

                    <Col>
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
                <MenuComponent />
                <ListGroup.Item><span style={{ color: '#bbb', fontSize: 12 }}>Musify your Brain</span></ListGroup.Item>
              </ListGroup>
            </Col>
            <Col xs lg="6">

              <Category data={this.state.categories} />

              <Row style={{ padding: 10 }}>
                <Col xs lg="5"></Col>
                <Col xs lg="7">
                  <HomeLeaderBoard />
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

class CategoryDetails extends React.Component {
  render() {
    var title = this.props.data.name,
      id = this.props.data.id;
    return (
      <Card style={{ width: '18rem', height: 170 }} className="category-card">
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Link href={id} className="category-button">Play Quiz</Card.Link>
        </Card.Body>
      </Card>
    )
  }
}
class Category extends React.Component {
  render() {
    var data = this.props.data;
    var newsTemplate;
    var settings = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
    }
    if (data.length > 0) {
      newsTemplate = data.map(function (item, index) {
        return (
          <div key={index}>
            <CategoryDetails data={item} />
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