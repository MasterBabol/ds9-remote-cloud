import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import RTChart from 'react-rt-chart';

import axios from 'axios';

class ServerOverview extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
    }

    componentDidMount() {
        this.refreshCallback = setInterval(() => this.forceUpdate(), 2000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    render() {
        let chartData = {
            date: new Date(),
            'CPU Usage': Math.random(),
            'Memory Usage': Math.random()
        };

        return (
            <RTChart fields={['CPU Usage', 'Memory Usage']} data={chartData} />
        );
    }
};

export default ServerOverview;
