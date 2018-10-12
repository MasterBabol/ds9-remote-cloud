import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class TechnologiesDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.options = {
            noDataText: 'There is no technology to display'
        };
        this.state = {
            mounted: false,
            teches: []
        };
    }

    componentDidMount() {
        this.refreshCallback = setInterval(() => this.update(), 3000);
    }

    componentWillUnmount() {
        this.state.mounted = false;
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    componentWillMount() {
        this.state.mounted = true;
        this.update();
    }

    update() {
        axios.get('/api/technology').then((res) => {
            let teches = res.data;
            if (teches) {
                let tableData = [];
                for (var k of Object.keys(teches)) {
                    tableData.push({
                        name: k,
                        level: teches[k]['level'],
                        researched: teches[k]['researched']
                    });
                }
                if (this.state.mounted)
                    this.setState({
                        teches: tableData
                    });
            }
        });
    }

    render() {
        return (
            <BootstrapTable data={this.state.teches}
                options={this.options} striped hover>
                <TableHeaderColumn isKey dataField='name' dataSort>
                    Technology Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='researched' dataSort>
                    Researched
                </TableHeaderColumn>
                <TableHeaderColumn dataField='level' dataSort>
                    Level
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
};

export default TechnologiesDetail;
