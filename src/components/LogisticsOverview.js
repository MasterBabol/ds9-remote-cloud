import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

class LogisticsOverview extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
    }

    componentDidMount() {
        this.refreshCallback = setInterval(() => this.update(), 2000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    update() {
    }

    render() {
        let chartData = {
            date: new Date(),
            '# of TX Rockets': Math.random(),
            '# of RX Rockets': Math.random()
        };

        return (
            <div>Not implemented</div>
        );
    }
};

export default LogisticsOverview;
