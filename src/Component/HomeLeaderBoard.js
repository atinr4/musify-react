import React, { Component } from "react";
import { Image, Table, Card, Badge } from 'react-bootstrap';
import { apiBaseUrl } from "../config";
import logo from "../logo.png";
import { ScaleLoader } from "react-spinners";

class HomeLeaderBoard extends Component {

  constructor() {
    super();
    this.state = {
      board_data: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getLeaderBoard()
  }

  getLeaderBoard() {
    fetch(apiBaseUrl + '/leader-board')
      .then(res => res.json())
      .then((data) => {
        this.setState({
          board_data: data.leader_board,
        })
        this.items = this.state.board_data.map((item, key) =>
          <tr key={item.id}>
            <td>{key + 1}</td>
            <td><Image src={logo} roundedCircle style={{ height: 30 }} /></td>
            <td>{item.name}</td>
            <td><Badge variant="primary">{item.login_using}</Badge></td>
            <td>Level {item.level}</td>
            <td>{item.total_xp} XP </td>
          </tr>
        );
        this.setState({
          loading: false
        })
      })
  }

  render() {
    return (
      <Card style={{ width: '100%' }}>
        <Card.Body>
          <Card.Title>Leader Board</Card.Title>
          <Table responsive>
            <tbody>
              {this.items}
            </tbody>
          </Table>
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

        </Card.Body>
      </Card>
    )
  }
}

export default HomeLeaderBoard;
