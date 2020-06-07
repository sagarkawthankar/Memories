import './App.css';
import React from "react";
import { Button } from 'react-bootstrap';
import {Redirect} from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends React.Component {

    state = {
        login: "",
        password: "",
        loginClick: false,
        response: false,
        isSignUp: false
    };

    constructor(props: Readonly<{}>) {
        super(props);
        this.updateUserID = this.updateUserID.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    activate = () => {
        this.setState({loginClick: true})
    }

    updateUserID(event: any) {
        this.setState({login: event.target.value})
    }

    updatePassword(event: any) {
        this.setState({password: event.target.value})
    }

    redirect() {
        this.setState({isSignUp: true})
    }

    checkValues() {
        if (this.state.loginClick) {
            this.setState({loginClick: false})
            if (this.state.login==="" ||  this.state.password==="") {
                let message = "Error! \n";
                if (this.state.login==="") {
                    message += "Enter first name \n";
                }
                if (this.state.password==="") {
                    message += "Enter a password \n";
                }
                alert(message);
            }
            else {
                this.call().then(
                    () => {
                        if (this.state.response) {
                            alert("Success!");
                        }
                        else {
                            alert("Invalid credentials. Please try again!");
                        }
                    }
                );
            }
        }
    }

    async call() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Token': "" },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            body: JSON.stringify({
                userID: this.state.login,
                password: this.state.password})
        };
        return fetch('http://localhost:8080/login', requestOptions)
            .then(response => {
                if (response.headers.get("Token")!=null) {
                    localStorage.setItem('UserID', this.state.login);
                    localStorage.setItem("Token", response.headers.get("Token") as string);
                }
                return response.json();
            })
            .then(data => this.setState({response: data}));
    }

    render() {
        if (localStorage.getItem('UserID')!=null && localStorage.getItem('Token')!=null) {
            return <Redirect to='/account'/>;
        }
        if (this.state.isSignUp) {
            return <Redirect to='/signup'/>;
        }
        return (
            <div className="App">
                <header className="App-header">
                    <input type="text" placeholder="Username" className="input" onChange={this.updateUserID} required/>
                    <input type="password" placeholder="Password" className="input" onChange={this.updatePassword} required/>
                    <Button variant="primary" className="mr2" onClick={this.activate}>Login</Button>
                    <Button variant="primary" className="mr2" onClick={this.redirect}>Sign Up</Button>
                    {this.checkValues()}
                </header>
            </div>
        );
    }
}

