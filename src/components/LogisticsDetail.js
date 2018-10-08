import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class LogisticsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.state = {
            inventory: []
        };
    }

    componentDidMount() {
        this.update();
        this.refreshCallback = setInterval(() => this.update(), 3000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);
    }

    update() {
        axios.get('/api/inventory').then((res) => {
            let inv = res.data;
            if (inv) {
                let tableData = [];
                for (var k of Object.keys(inv)) {
                    tableData.push({
                        name: k,
                        count: inv[k]
                    });
                }
                this.setState({
                    inventory: tableData
                });
            }
        });
    }

    render() {
        return (
            <BootstrapTable data={this.state.inventory} striped hover>
                <TableHeaderColumn isKey dataField='name'>
                    Item Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='count'>
                    Item Count
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
};

export default LogisticsDetail;
