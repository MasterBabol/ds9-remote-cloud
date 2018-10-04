import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';

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
        axios.get('/api/serverStatus').then((res) => {
            let cpuUse = res.data['cpuUse%'];
            let memUse = res.data['memUse%'];
            this.setState({'cpuUse': cpuUse, 'memUse': memUse});
        });
    }

    render() {
        let cpuUse = this.state.cpuUse;
        let memUse = this.state.memUse;;

        let chartData = {
            date: new Date(),
            'CPU Usage': cpuUse,
            'Memory Usage': memUse
        };

        return (
            <div>
            </div>
        );
    }
};

export default ServerOverview;
