import React from 'react';
import {
    
    Redirect,
    Switch,
    Route,

} from "react-router-dom";
import Admin from './Admin';
import Login from './Login';
import SignUp from './SignUp';
import Home from "./Home"
import { useSelector } from 'react-redux';
import { 
    selectUserName ,
    selectUserAuthenticationStatus
} from '../features/user/userSlice';
import {PrivateRoute,LoginRoute} from "./Routes"

function Train() {
    const name = useSelector(selectUserName);
    
    return (
        <Switch>
            <Route exact path="/"> <Redirect to="/home" /> </Route>
            <Route path="/signup" exact> <SignUp /> </Route>
            <LoginRoute path="/login" exact> <Login /> </LoginRoute> 
            <PrivateRoute path="/home" exact> <Home /> </PrivateRoute>
            <Route path="*"> <Redirect to="/" /> </Route>
        </Switch>
    )
}

export default Train;
