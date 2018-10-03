import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import ServerOverview from './components/ServerOverview';
import DS9Overview from './components/DS9Overview';

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
                            <Panel.Body><DS9Overview /></Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Home;
