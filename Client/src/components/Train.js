import React, { useEffect } from 'react';
import { Redirect, Switch, Route } from "react-router-dom";
import Login from './AuthComponents/Login';
import SignUp from './AuthComponents/SignUp';
import Home from "./Home";
import User from "./UserComponents/User"
import { PrivateRoute, LoginRoute } from "./Routes";
import Profile from './Profile';
import ForgotPassword from './AuthComponents/ForgotPassword';
import ResetPassword from './AuthComponents/ResetPassword';
import Log from './Log';

function Train() {
    //const name = useSelector(selectUserName);
    // useEffect(async () => {

    //     $('.skillsbox .fa-arrow-down').click(function (e) {
    //         $(this).toggleClass('active');
    //         if ($(this).hasClass('active')) {
    //             $('.skillsbox ul').slideDown();
    //             $(this).css('transform', 'rotate(180deg)');
    //         } else {
    //             $('.skillsbox ul').slideUp();
    //             $(this).css('transform', 'rotate(0deg)');
    //         }
    //     });

    //     $('.show-box .show-item i.fa-eye').click(function () {
    //         $(this).toggleClass('active');
    //         if ($(this).hasClass('active')) {

    //             $(this).removeClass('fa-eye').addClass('fa-eye-slash');
    //             $('#pro-pass').attr('type', 'text');
    //         } else {
    //             $(this).removeClass('fa-eye-slash').addClass('fa-eye');
    //             $('#pro-pass').attr('type', 'password');
    //         }
    //     });

    //     // Height Window
    //     var hw = ($(window).height()) - 125;
    //     $('.alonebox,.groupbox').css('height', hw + 'px');

    //     // Height Window
    //     var hw = ($(window).height()) - 130;
    //     $('.alonebox,.groupbox').css('height', hw + 'px');

    // });

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
            <Route path="*"> <Redirect to="/" /> </Route>
        </Switch>
    )
}

export default Train;
