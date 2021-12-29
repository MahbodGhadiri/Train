import React from 'react';
import {

    Switch,
    Route,

} from "react-router-dom";
import Admin from './Admin';
import Login from './Login';
import SignUp from './SignUp';
import { useSelector } from 'react-redux';
import { selectUserName } from '../features/user/userSlice';

function Train() {
    const name = useSelector(selectUserName);
    return (
        <Switch>
            <Route path="/signup" exact> <SignUp /> </Route>
            <Route path="/login" exact> <Login /> </Route> 
            <Route path="/admin" exact> <Admin /> </Route>
        </Switch>
    )
}

export default Train;
