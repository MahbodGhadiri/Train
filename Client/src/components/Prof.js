import axios from 'axios';
import { useDispatch } from "react-redux";
import setUserLoginDetails from "../features/user/userSlice";

async function Prof() {
    
const dispatch = useDispatch();
    await axios.get("/user/profile",
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(response => {
        // console.log(response);
        dispatch(
            setUserLoginDetails({
                name: response.data.name,
                phone: response.data.phone.number,
                email: response.data.email.address,
            }))

    }).catch(error => {
        console.log(error);
    });
    
    return(
        <div>

        </div>
    )
}


export default Prof;
