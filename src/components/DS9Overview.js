import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import RTChart from 'react-rt-chart';

class DS9Overview extends React.Component {
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
            '# of TX Rockets': Math.random(),
            '# of RX Rockets': Math.random()
        };

        return (
            <RTChart fields={['# of TX Rockets', '# of RX Rockets']} data={chartData} />
        );
    }
};

export default DS9Overview;
