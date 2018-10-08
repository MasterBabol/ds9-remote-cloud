import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { ServerOverview } from 'components';

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
                            <Panel.Heading>Cloud Server Overview</Panel.Heading>
                            <Panel.Body><ServerOverview /></Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Home;
