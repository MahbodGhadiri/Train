import {getUserAuthorization} from "./SessionStorage"
import AdminProfile from "./AdminProfile"
import UserProfile from "./UserProfile"

function Profile()
{
    const role = getUserAuthorization()
    if (role==="user")
    {
        return (
            <UserProfile/>
        )
    }
    else if (role==="admin"|role==="super admin")
    {
        return (
            <AdminProfile/>
        )
    }
} 

export default Profile;