import React from 'react';
import { Alert, Grid, Col, Row, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';
import validator from 'validator';

class LocalEstatesAdder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            accessToken: '',
            type: 'factorio',
            nameError: false,
            emptyError: false,
            result: ''
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAccessTokenChange = this.handleAccessTokenChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSendForm = this.handleSendForm.bind(this);
        this.handleFormHide = this.handleFormHide.bind(this);
    }

    componentDidMount() {
    }

    handleNameChange(e) {
        if (validator.isWhitelisted(e.target.value, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'))
            this.setState({ name: e.target.value, nameError: false });
        else
            this.setState({ nameError: true });
        this.setState({ emptyError: false, result: '' });
    }

    handleAccessTokenChange(e) {
        this.setState({ accessToken: e.target.value });
        this.setState({ emptyError: false });
    }

    handleTypeChange(e) {
        this.setState({ type: e.target.value });
        this.setState({ emptyError: false });
    }

    handleFail(reason) {
        this.setState({ result: reason });
    }

    handleSendForm(e) {
        if (validator.isEmpty(this.state.name) || validator.isEmpty(this.state.accessToken)) {
            this.setState({ emptyError: true });
        } else {
            this.setState({ emptyError: false });
            var target = e.target;
            target.disabled = true;
            axios.post('/api/local-estate/' + this.state.name, {
                'accessToken': this.state.accessToken,
                'type': this.state.type
            }).then((res) => {
                    this.handleFormHide();
            }).catch((res) => {
                target.disabled = false;
                if (res.response) {
                    if (res.response.status == 409)
                        this.handleFail('There is already a local estate named: ' +
                                this.state.name);
                } else
                    this.handleFail('Unexpected error occured.' + res);
            });
        }
    }

    handleFormHide(e) {
        this.props.onClose();
    }

    render() {
        const submitBtnMargin = { 'marginRight': '1em' };
        const alertStyle = { 'marginTop': '1em', 'padding': '0.8em' };

        return (
            <form>
                <FormGroup controlId="frmLEName">
                    <ControlLabel>Local estate name</ControlLabel>
                    <FormControl type="text" value={this.state.name}
                                onChange={this.handleNameChange} placeholder ="Enter name" />
                    {
                        this.state.nameError && 
                        <Alert bsStyle="danger" style={alertStyle}>
                            A name can contain only alphabets, numbers, and hyphens.
                        </Alert>
                    }
                </FormGroup>
                <FormGroup controlId="frmLEAccessToken">
                    <ControlLabel>Access token</ControlLabel>
                    <FormControl type="text" value={this.state.accessToken} 
                                onChange={this.handleAccessTokenChange} placeholder="Enter access token" />
                </FormGroup>
                <FormGroup controlId="frmTypeSelect">
                    <ControlLabel>Type</ControlLabel>
                    <FormControl componentClass="select" defaultValue={this.state.type}
                                onChange={this.handleTypeChange}>
                        <option value="factorio">factorio</option>
                    </FormControl>
                </FormGroup>
                {
                    this.state.emptyError && 
                    <Alert bsStyle="danger" style={alertStyle}>
                        Name and access token must not be empty.
                    </Alert>
                }
                {
                    this.state.result != '' && 
                    <Alert bsStyle="danger" style={alertStyle}>
                        {this.state.result}
                    </Alert>
                }
                <Button bsStyle="primary" style={submitBtnMargin} onClick={this.handleSendForm}>Submit</Button>
                <Button onClick={this.handleFormHide}>Cancel</Button>
            </form>
        );
    }
};

export default LocalEstatesAdder;
