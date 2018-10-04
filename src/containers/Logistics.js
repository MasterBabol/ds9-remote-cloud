import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { LogisticsDetail } from 'components';

class Logistics extends React.Component {
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
                            <Panel.Heading>Logistics Inventory</Panel.Heading>
                            <Panel.Body><LogisticsDetail /></Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Logistics;
