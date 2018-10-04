import React from 'react';
import { Grid, Col, Row, Table } from 'react-bootstrap';

class LogisticsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
    }

    componentDidMount() {
        this.refreshCallback = setInterval(() => this.update(), 3000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    update() {
    }

    render() {
        return (
            <Table striped bordered condensed hover>
                <tbody>
                </tbody>
            </Table>
        );
    }
};

export default LogisticsDetail;
