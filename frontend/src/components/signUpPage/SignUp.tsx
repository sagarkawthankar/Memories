import './SignUp.css';
import React from "react";
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect} from "react-router";

export default class SignUp extends React.Component {

    state = {
        firstName: "",
        lastName: "",
        userID: "",
        password: "",
        confirmPassword: "",
        register: false,
        response: false,
        redirect: false
    };

    constructor(props: Readonly<{}>) {
        super(props);
        this.updateFirstName = this.updateFirstName.bind(this);
        this.updateLastName = this.updateLastName.bind(this);
        this.updateUserName = this.updateUserName.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateConfirmPassword = this.updateConfirmPassword.bind(this);
    }

    activate = () => {
        this.setState({register: true})
    }

    updateFirstName(event: any) {
        this.setState({firstName: event.target.value})
    }

    updateLastName(event: any) {
        this.setState({lastName: event.target.value})
    }

    updateUserName(event: any) {
        this.setState({userID: event.target.value})
    }

    updatePassword(event: any) {
        this.setState({password: event.target.value})
    }

    updateConfirmPassword(event: any) {
        this.setState({confirmPassword: event.target.value})
    }

    checkValues() {
        if (this.state.register) {
            this.setState({register: false})
            if ((this.state.password!==this.state.confirmPassword) || this.state.firstName==="" ||
                this.state.lastName==="" || this.state.userID==="" || this.state.password===""
                || this.state.confirmPassword==="") {
                let message = "Error! \n";
                if (this.state.firstName==="") {
                    message += "Enter first name \n";
                }
                if (this.state.lastName==="") {
                    message += "Enter last name \n";
                }
                if (this.state.userID==="") {
                    message += "Enter user name \n";
                }
                if (this.state.password==="") {
                    message += "Enter a password \n";
                }
                if (this.state.confirmPassword==="") {
                    message += "Re-enter password \n";
                }
                if ((this.state.password!==this.state.confirmPassword)) {
                    message += "Passwords do not match \n";
                }
                alert(message);
            }
            else {
                this.call().then(
                    () => {
                        if (this.state.response) {
                            alert("User ID already exists. Please try with a different ID!");
                        }
                        else {
                            alert("Successful registration!");
                            this.setState({redirect: true});
                        }
                    }
                );
            }
        }
    }

    async call() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                userID: this.state.userID,
                password: this.state.password})
        };
        return fetch('http://localhost:8080/register', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({response: data}));
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }
        return (
            <div className="App">
                <header className="App-header">
                    <input type="text" placeholder="First Name" className="firstName" required onChange={this.updateFirstName}/>
                    <input type="text" placeholder="Last Name" className="lastName" required onChange={this.updateLastName}/>
                    <input type="text" placeholder="Username" className="userName" required onChange={this.updateUserName}/>
                    <input type="password" placeholder="Create Password" className="password" required onChange={this.updatePassword}/>
                    <input type="password" placeholder="Confirm Password" className="confirmPassword" required onChange={this.updateConfirmPassword}/>
                    <Button variant="primary" className="mr2" onClick={this.activate}>Submit</Button>
                    {this.checkValues()}
                </header>
            </div>
        );
    }
}

