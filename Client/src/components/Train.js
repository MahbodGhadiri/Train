import React from 'react';
import { Redirect, Switch, Route } from "react-router-dom";
import Login from './AuthComponents/Login';
import SignUp from './AuthComponents/SignUp';
import Home from "./Home";
import User from "./UserComponents/User"
import { PrivateRoute, LoginRoute } from "./Routes";
import Profile from './Profile';
import TaskPage from "./TaskPage";
import CustomTaskPage from "./CustomTaskPage";
import ForgotPassword from './AuthComponents/ForgotPassword';
import ResetPassword from './AuthComponents/ResetPassword';
import Log from './Log';
import Avatars from './Avatars';

function Train() {
    
    return (
        <Switch>
            <Route exact path="/"> <Redirect to="/home" /> </Route>
            <Route path="/signup" exact> <SignUp /> </Route>
            <LoginRoute path="/login" exact> <Login /> </LoginRoute>
            <Route exact path="/forgot-password"> <ForgotPassword /> </Route>
            <Route exact path="/reset-password"> <ResetPassword /> </Route>
            <PrivateRoute path="/home" exact> <Home /> </PrivateRoute>
            <PrivateRoute path={"/home/user"} exact > <User /> </PrivateRoute>
            <PrivateRoute path="/log" exact> <Log /> </PrivateRoute>
            <PrivateRoute path={`/home/profile`} exact > <Profile /> </PrivateRoute>
            <PrivateRoute path={`/home/avatar`} exact > <Avatars /> </PrivateRoute>
            <PrivateRoute path={`/home/task/:id`} exact> <TaskPage/></PrivateRoute>
            <PrivateRoute path={`/home/custom-task/:id`} exact>CustomTaskPage</PrivateRoute>
            <Route path="*"> <Redirect to="/" /> </Route>

        </Switch>
    )
}

export default Train;
