import React from 'react';
import {getUserAuthorization} from "./SessionStorage"
import Admin from "./Admin"
import User from "./User"

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

export default Home