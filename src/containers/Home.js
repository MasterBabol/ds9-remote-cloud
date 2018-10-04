import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { ServerOverview, LogisticsOverview } from 'components';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col md={12}>
                        <Panel>
                            <Panel.Heading>Server Overview</Panel.Heading>
                            <Panel.Body><ServerOverview /></Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Panel>
                            <Panel.Heading>Logistics Overview</Panel.Heading>
                            <Panel.Body><LogisticsOverview /></Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Home;