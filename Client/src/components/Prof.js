import axios from 'axios';
import { useDispatch } from "react-redux";
import setUserLoginDetails from "../features/user/userSlice";

async function Prof() {
    
const dispatch = useDispatch();
    await axios.get("/user/profile",
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(responce => {
        // console.log(responce);
        dispatch(
            setUserLoginDetails({
                name: responce.data.name,
                phone: responce.data.phone.number,
                email: responce.data.email.address,
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
