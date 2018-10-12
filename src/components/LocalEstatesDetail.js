import React from 'react';
import { Grid, Col, Row, Panel, ButtonToolbar, Button, Modal } from 'react-bootstrap';
import { BootstrapTable,
    TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import LocalEstatesAdder from './LocalEstatesAdder';

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
            showAddForm: false,
            mounted: false,
            'local-estates': [],
            showDeleteForm: false,
            deleteTarget: ''
        };

        this.handleAddFormShow = this.handleAddFormShow.bind(this);
        this.handleAddFormHide = this.handleAddFormHide.bind(this);
        this.deleteButtonFormatter = this.deleteButtonFormatter.bind(this);
        this.handleDeleteFormHide = this.handleDeleteFormHide.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
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

    handleAddFormShow() { this.setState({ showAddForm: true }); }
    handleAddFormHide() { this.setState({ showAddForm: false }); }
    handleDeleteFormHide() { this.setState({ showDeleteForm: false }); }
    handleDeleteButton(targetName) {
        this.setState({ deleteTarget: targetName, showDeleteForm: true });
    }

    handleDelete() {
        axios.delete('/api/local-estate/' + this.state.deleteTarget)
            .then((res) => {
                this.handleDeleteFormHide();
            }).catch((res) => {
                this.handleDeleteFormHide();
            });
    }

    deleteButtonFormatter(cell, row) {
        return (<span>{cell}<Button className="close"
            onClick={() => this.handleDeleteButton(cell)}>&times;</Button></span>);
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
        const buttonToolbarStyle = { 'paddingBottom': '1em' };
        const paddedButtonStyle = { 'marginRight': '0.8em' };

        return (
            <div>
            <ButtonToolbar style={buttonToolbarStyle}>
                <Button bsStyle="primary" onClick={this.handleAddFormShow}>Add new</Button>
            </ButtonToolbar>
            <Modal show={this.state.showAddForm} onHide={this.handleAddFormHide}>
                <Modal.Header closeButton><Modal.Title>Add a new local estate</Modal.Title></Modal.Header>
                <Modal.Body><LocalEstatesAdder onClose={this.handleAddFormHide} /></Modal.Body>
            </Modal>
            <Modal show={this.state.showDeleteForm} onHide={this.handleDeleteFormHide}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Are you sure to remove this local estate?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button bsStyle="primary" style={paddedButtonStyle}
                            onClick={this.handleDelete}>Confirm</Button>
                    <Button onClick={this.handleDeleteFormHide}>Close</Button>
                </Modal.Body>
            </Modal>
            <BootstrapTable data={this.state['local-estates']}
                options={ this.options } striped hover>
                <TableHeaderColumn isKey dataField='id' width='25%'
                            dataFormat={this.deleteButtonFormatter} dataSort>
                    Name
                </TableHeaderColumn>
                <TableHeaderColumn dataField='online' width='18%' dataSort>
                    Online 
                </TableHeaderColumn>
                <TableHeaderColumn dataField='discovered' >
                    Last Discovered
                </TableHeaderColumn>
            </BootstrapTable>
            </div>
        );
    }
};

export default LocalEstatesDetail;
