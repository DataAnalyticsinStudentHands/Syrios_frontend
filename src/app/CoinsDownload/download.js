import React from "react";
import axios from "axios";
import { FormErrors } from './FormErrors';
import FileSaver from 'file-saver';
import downloadImage from '../data/images/download.png';

class Download extends React.Component{

    constructor (props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            formErrors: {email: ''},
            emailValid: false,
            formValid: false
        }
    }

    onNameChange(event) {
        this.setState({name: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        //send data for email
        axios.post('http://localhost:3002/send', this.state)
            .then((response) => {
                console.log(response);
            }, (error) => {
                console.log(error);
            });
        //download the data (currently in public folder)
        FileSaver.saveAs(
            process.env.PUBLIC_URL + "/resources/Antioch_Dataset_08032020.zip",
            "Antioch_Dataset_08032020.zip");
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                this.setState({email: value});
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid});
    }

    errorClass(error) {
        return(error.length === 0 ? '' : 'has-error');
    }

    render() {
        return(
            <div>
                <h1 className="class-coins-pile">Download the Dataset</h1>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <p>The data made available here has been compiled from the excavation of Antioch, which was conducted by a consortium of institutions led by Princeton University from 1932-1939.
                                This dataset is not of the full catalog, but the 10,110 coin finds dated between 330 BCE and 450 CE.</p>
                            <p>
                                The dataset is in csv format encoded as <a href="https://en.wikipedia.org/wiki/UTF-8#:~:text=UTF%2D8%20(8%2Dbit,Ken%20Thompson%20and%20Rob%20Pike."> UTF-8</a> supplemented with a detailed description.
                            </p>
                            <p> Please provide your your name and email address in the form on the left side to start the download.
                            </p>
                            <img src={downloadImage} alt="Screenshot dataset" className="w-100"/>
                        </div>
                        <div className="col-3">
                            <form className="contact-form" onSubmit={this.handleSubmit.bind(this)} method="POST">

                                <div className={`form-group`}>
                                    <label htmlFor="name">Name</label>
                                    <input type="text" className="form-control"
                                           placeholder="Name"
                                           value={this.state.name}
                                           onChange={this.onNameChange.bind(this)} />
                                </div>
                                <div className={`form-group ${this.errorClass(this.state.formErrors.email)}`}>
                                    <label htmlFor="email">Email address</label>
                                    <input type="email" required className="form-control" name="email"
                                           placeholder="Email"
                                           value={this.state.email}
                                           onChange={this.handleUserInput}  />
                                </div>
                                <div className="panel panel-default">
                                    <FormErrors formErrors={this.state.formErrors} />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!this.state.formValid}
                                >Download</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Download;
