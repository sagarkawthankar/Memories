import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from "../landingPage/App";
import SignUp from "../signUpPage/SignUp";
import UserPage from "../userPage/UserPage";
import React from "react";

export default function Routes() {
    return(
        <BrowserRouter>
            <div className="Routes">
                <Switch>
                    <Route path="/" exact component={App}/>
                    <Route path="/signin" component={App}/>
                    <Route path="/signup" component={SignUp}/>
                    <Route path="/account" component={UserPage}/>
                </Switch>
            </div>
        </BrowserRouter>
    )
}