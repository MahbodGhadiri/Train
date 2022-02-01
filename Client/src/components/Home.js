import React from 'react';
import {getUserAuthorization} from "./SessionStorage"
import Admin from "./AdminComponents/Admin"
import User from "./UserComponents/User"

function Home()
{
    const role = getUserAuthorization()
    if (role==="user")
    {
        return (
            <User/>
        )
    }
    else if (role==="admin"|role==="super admin")
    {
        return (
            <Admin/>
        )
    }
} 

export default Home;