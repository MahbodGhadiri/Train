import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { showError, showInfo } from './Toast_Functions';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';

function ForgotPassword() {







    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: `لطفا بیشتر از 5 و کمتر از 30 کاراکتر وارد کنید`,
                email: "ایمیل نوشته شده صحیح نمی باشد",

            },
            element: message => <div style={{ color: "red", textAlign: "center", fontSize: "2vh" }}>{message}</div>
        })
    );
    //user validation with "SimpleReactValidator" end



    const [email, setEmail] = useState("");

    async function forgotPassword(e) {
        e.preventDefault();

        axios.post("/auth//forgot-password",
           { email},
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then((response) => {
                console.log(response);
                showInfo(response);

            }).catch((error) => {
                showError(error)
            });
    }
    return (
        <>
            <div className="login">

                <div className="logo sl-logo">
                    <img src="./images/logo-min.png" alt="Train" title="Train" />
                </div>

                <div className="links">

                    <Link to="/">  بازگشت </Link>
                </div>


                <form action="#" method="post" onSubmit={e => forgotPassword(e)}>
                    <p style={{ textAlign: "center", color: '#6e85b2', cursor: "pointer" }}>لطفا ایمیل خود را وارد نمایید</p>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="ایمیل"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            validator.current.showMessageFor("email");
                        }}
                    />
                    {validator.current.message(
                        "email",
                        email,
                        "required|email"
                    )}



                    <input type="submit" value="ارسال" className="send" />

                </form>

            </div>
        </>
    )
}

export default ForgotPassword;
