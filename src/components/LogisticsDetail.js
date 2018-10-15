import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class LogisticsDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.options = {
            noDataText: 'There is no item to display'
        };
        this.state = {
            mounted: false,
            inventory: []
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

    revertSort(a, b, order) {
        if (order == 'desc') {
            return a.count - b.count;
        }
        else {
            return b.count - a.count;
        }
    }

    update() {
        axios.get('/api/inventory').then((res) => {
            let inv = res.data;
            if (inv) {
                let tableData = [];
                for (var k of Object.keys(inv)) {
                    tableData.push({
                        name: k,
                        count: Number(inv[k]).toLocaleString()
                    });
                }
                if (this.state.mounted)
                    this.setState({
                        inventory: tableData
                    });
            }
        });
    }

    render() {
        return (
            <BootstrapTable data={this.state.inventory}
                options={this.options} striped hover>
                <TableHeaderColumn isKey dataField='name' dataSort>
                    Item Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='count' dataSort sortFunc={this.revertSort}>
                    Item Count
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
};

export default LogisticsDetail;
