import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class LocalEstatesDetail extends React.Component {
    constructor(props) {
        super(props);
        this.refreshCallback = null;
        this.options = {
            defaultSortName: 'id',
            defaultSortOrder: 'asc'
        };
        this.state = {
            'local-estates': []
        };
    }

    componentDidMount() {
        this.update();;
        this.refreshCallback = setInterval(() => this.update(), 3000);
    }

    componentWillUnmount() {
        if (this.refreshCallback)
            clearInterval(this.refreshCallback);;
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
                    var cpuUse = leStatus['cpuUse%'];
                    var memUse = leStatus['memUse%'];

                    if (cpuUse < 0)
                        cpuUse = null;
                    else
                        cpuUse = cpuUse + ' %';
                    if (memUse < 0)
                        memUse = null;
                    else
                        memUse = memUse + ' %';

                    tableData.push({
                        id: leName,
                        online: leStatus['online'],
                        discovered: leDiscovDate,
                        'cpuUse%': cpuUse,
                        'memUse%': memUse
                    });
                }
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
                <TableHeaderColumn isKey dataField='id' width='20em' dataSort>
                    Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='online' width='8em' dataSort>
                    Online 
                </TableHeaderColumn>
                <TableHeaderColumn dataField='cpuUse%' width='8em'>
                    Cpu Use %
                </TableHeaderColumn>
                <TableHeaderColumn dataField='memUse%' width='8em'>
                    Mem Use %
                </TableHeaderColumn>
                <TableHeaderColumn dataField='discovered'>
                    Last Discovered
                </TableHeaderColumn>
            </BootstrapTable>
        );
    }
};

export default LocalEstatesDetail;
