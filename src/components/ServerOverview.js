import React from 'react';
import { Grid, Col, Row, Panel, ProgressBar } from 'react-bootstrap';

import axios from 'axios';

class ServerOverview extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.state = {
            cpuUse: 0,
            memUse: 0
        }

        const foo = async function () {}
    }

    componentDidMount() {
        this.update();
        this.refreshCallback = setInterval(() => {
            this.update();
        }, 5000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    update() {
        axios.get('/api/status').then((res) => {
            let cpuUse = res.data['cpuUse%'];
            let memUse = res.data['memUse%'];
            let memTotalMB = res.data['memTotalMB'];
            this.setState({
                'cpuUse': cpuUse,
                'memUse': memUse,
                'memTotalMB': memTotalMB
            });
        });
    }

    getBSStyleFromValue(val) {
        let useStyle;
        if (val < 25)
            useStyle = 'info';
        else if (val < 50)
            useStyle = 'success';
        else if (val < 75)
            useStyle = 'warning';
        else
            useStyle = 'danger';
        return useStyle;
    }

    render() {
        let cpuUse = this.state.cpuUse;
        let memUse = this.state.memUse;
        let memTotalMB = this.state.memTotalMB;

        let cpuUseStyle = this.getBSStyleFromValue(cpuUse);
        let memUseStyle = this.getBSStyleFromValue(memUse);

        return (
            <div>
            <Panel>
                <Panel.Heading>CPU Utilization</Panel.Heading>
                <Panel.Body><ProgressBar now={this.state.cpuUse}
                    label={`${this.state.cpuUse} %`} bsStyle={cpuUseStyle} /></Panel.Body>
            </Panel>
            <Panel>
                <Panel.Heading>Memory Utilization (Total {this.state.memTotalMB} MB)</Panel.Heading>
                <Panel.Body><ProgressBar now={this.state.memUse}
                    label={`${this.state.memUse} %`} bsStyle={memUseStyle} /></Panel.Body>
            </Panel>
            </div>
        );
    }
};

ServerOverview.defaultProps = {
    target: ''
}

export default ServerOverview;
