import React from 'react';
import {
    
    Redirect,
    Switch,
    Route,

} from "react-router-dom";
import Admin from './Admin';
import Login from './Login';
import SignUp from './SignUp';
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
            <Route exact path="/"> <Redirect to="/admin" /> </Route>
            <Route path="/signup" exact> <SignUp /> </Route>
            <LoginRoute path="/login" exact> <Login /> </LoginRoute> 
            <PrivateRoute path="/admin" exact> <Admin /> </PrivateRoute>
            <Route path="*"> <Redirect to="/" /> </Route>
        </Switch>
    )
}

// function PrivateRoute({ children, ...rest }) {
//     const isUserAuthenticated = useSelector(selectUserAuthenticationStatus)
//     return (
//       <Route
//         {...rest}
//         render={({ location }) =>
//           isUserAuthenticated ? (
//             children
//           ) : (
//             <Redirect
//               to={{
//                 pathname: "/login",
//                 state: { from: location }
//               }}
//             />
//           )
//         }
//       />
//     );
// }
export default Train;
