import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { TechnologiesDetail } from 'components';

class Technology extends React.Component {
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
                        <TechnologiesDetail />
                    </Col>
                </Row>
            </Grid>
        );
    }
};

export default Technology;
