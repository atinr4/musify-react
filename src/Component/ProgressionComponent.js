import React, { Component } from "react";
import { Card } from 'react-bootstrap';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
import ProgressProvider from "./ProgressProvider";

class ProgressionComponent extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            user_data: this.props.data,
            progess: 0
        }
    }

    componentDidMount() {
        let level = Math.ceil(this.state.user_data.total_xp / 1000)
        let progess = (this.state.user_data.total_xp * 100) / (level * 1000);
        this.setState({
            progess: progess
        });
    }

    render() {
        return (
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title>Progression</Card.Title>

                    <ProgressProvider valueStart={0} valueEnd={this.state.progess}>
                        {value => <CircularProgressbarWithChildren value={value}>
                            {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}
                            <div style={{ fontSize: 18, marginTop: -5 }}>Total XP</div>
                            <div style={{ fontSize: 18, marginTop: -5 }}>
                                <strong>{this.state.user_data.total_xp} / {Math.ceil(this.state.user_data.total_xp / 1000) * 1000}</strong>
                            </div>
                            <div style={{ fontSize: 18, marginTop: -5 }}>
                                <strong>{Math.ceil(value)}%</strong> Completed
                            </div>
                        </CircularProgressbarWithChildren>}
                    </ProgressProvider>
                </Card.Body>
            </Card>
        )
    }
}

export default ProgressionComponent;