import React,{useEffect} from 'react';
import { Redirect, Switch, Route } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import Home from "./Home";
import { useSelector } from 'react-redux';
import {selectUserName,selectUserAuthenticationStatus} from '../features/user/userSlice';
import { PrivateRoute, LoginRoute } from "./Routes";
import Profile from './Profile';
import $ from 'jquery';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function Train() {
    const name = useSelector(selectUserName);
    
    
    return (
        <Switch>
            <Route exact path="/"> <Redirect to="/home" /> </Route>
            <Route path="/signup" exact> <SignUp /> </Route>
            <LoginRoute path="/login" exact> <Login /> </LoginRoute>
            <Route exact path="/forgot-password"> <ForgotPassword/> </Route> 
            <Route exact path="/reset-password"> <ResetPassword/> </Route> 
            <PrivateRoute path="/home" exact> <Home /> </PrivateRoute>
            <PrivateRoute path={`/home/profile`} exact > <Profile /> </PrivateRoute>
            <Route path="*"> <Redirect to="/" /> </Route>
        </Switch>
    )
}

export default Train;
