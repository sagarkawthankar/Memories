import './App.css';
import React from "react";
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class App extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <input type="text" placeholder="Username" className="input" required/>
                    <input type="password" placeholder="Password" className="input" required/>
                    <Button variant="primary" className="mr-2">Login</Button>
                    <Button variant="primary" className="mr-2">Sign Up</Button>
                </header>
            </div>
        );
    }
}

