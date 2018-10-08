import React from 'react';
import { Grid, Col, Row, Panel } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class LocalEstatesDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.options = {
            noDataText: 'There is no local estate to display',
            defaultSortName: 'id',
            defaultSortOrder: 'asc'
        };
        this.state = {
            mounted: false,
            'local-estates': []
        };
    }

    componentDidMount() {
        this.refreshCallback = setInterval(() => this.update(), 3000);
    }

    componentWillUnmount() {
        this.state.mounted = false;
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);;
    }

    componentWillMount() {
        this.state.mounted = true;
        this.update();
    }

    update() {
        axios.get('/api/local-estate').then(async (res) => {
            let les = res.data;
            if (les) {
                let tableData = [];
                for (var k of Object.keys(les)) {
                    var leName = les[k];
                    var leStatusResp = await axios.get('/api/status/' + leName);
                    var leStatus = leStatusResp.data;
                    var leDiscovDate = new Date(leStatus['discovered-time']);

                    tableData.push({
                        id: leName,
                        online: leStatus['online'],
                        discovered: leDiscovDate.toLocaleString()
                    });
                }
                if (this.state.mounted)
                    this.setState({
                        'local-estates': tableData
                    });
            }
        });
    }

    render() {
        return (
            <BootstrapTable data={this.state['local-estates']}
                options={ this.options } striped hover>
                <TableHeaderColumn isKey dataField='id' width='25%' dataSort>
                    Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='online' width='18%' dataSort>
                    Online 
                </TableHeaderColumn>
                <TableHeaderColumn dataField='discovered' >
                    Last Discovered
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
};

export default LocalEstatesDetail;
