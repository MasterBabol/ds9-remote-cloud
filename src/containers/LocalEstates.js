import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { LocalEstatesDetail } from 'components';

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
                        <LocalEstatesDetail />
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Logistics;
