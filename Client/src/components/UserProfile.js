import React, { useEffect, useState, useRef } from 'react'
import { showError } from './Toast_Functions';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUserEmail, selectUserName, selectUserPhone } from '../features/user/userSlice';
import SimpleReactValidator from "simple-react-validator";


function Profile() {
    const perName = useSelector(selectUserName);
    const perEmail = useSelector(selectUserEmail);
    const perPhoneNumber = useSelector(selectUserPhone);
    //-------------------------------------------
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    //-------------------------------------------


      
    //user validation with "SimpleReactValidator" start
    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: `لطفا بیشتر از 5 کاراکتر وارد کنید`,
                max: `لطفا کمتر از 30 کاراکتر وارد کنید`,
                email: "ایمیل نوشته شده صحیح نمی باشد",
                phone: "لطفا شماره را صحیح وارد کنید",
                in: "رمزها تطابق ندارند"
            },
            element: message => <div style={{ color: "red", textAlign: "center", fontSize: "2vh" }}>{message}</div>
        })
    );
    //user validation with "SimpleReactValidator" end
    async function editUser(event) {
        event.preventDefault();
        await axios.put("/user/change-info",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {

        }).catch(error => {
            showError(error);
            console.log(error);
        });

    }
    async function logOut(event) {
        event.preventDefault();
        await axios.get(`/user/logout`,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then((response) => {
                console.log(response);
                window.sessionStorage.removeItem("isUserAuthenticated");
                window.sessionStorage.removeItem("role");
                window.location.reload();
            }).catch((error) => {
                showError(error)
            });
    }

    return (
        <div>
        </div >
    )
}

export default Profile
