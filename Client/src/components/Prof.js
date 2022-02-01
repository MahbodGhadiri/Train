import axios from 'axios';
import { useDispatch } from "react-redux";
import setUserLoginDetails from "../features/user/userSlice";

async function Prof() {
    
// const dispatch = useDispatch();
    let x;
    await axios.get("/user/profile",
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(response => {
        x = response.data;

    }).catch(error => {
        console.log(error);
    });
    return x;
    
}


export default Prof;
