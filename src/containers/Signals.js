import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { SignalsDetail } from 'components';

class Signals extends React.Component {
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
                        <SignalsDetail />
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Signals;
