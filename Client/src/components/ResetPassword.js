import React, { useState, useRef } from 'react'
import SimpleReactValidator from 'simple-react-validator';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showError, showInfo } from './Toast_Functions';

function ResetPassword() {

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("")



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
    async function resetPassword(e) {
        e.preventDefault();
        const Url= window.location.href
        let parameter= Url.split("?")
        parameter=parameter[1]
        console.log(window.location.href);
        axios.put(`/auth/reset-password/?${parameter}`,
            {  },
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

                    <Link to="/forgot-password">  تغییر ایمیل </Link>
                </div>


                <form action="#" method="post" onSubmit={e => resetPassword(e)}>
                    <p style={{ textAlign: "center", color: '#6e85b2', cursor: "pointer" }}>لطفا ایمیل خود را وارد نمایید</p>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="رمز ورود"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            validator.current.showMessageFor(
                                "password"
                            );
                        }} />
                    {validator.current.message(
                        "password",
                        password,
                        `required|min: 5`
                    )}

                    <input
                        type="password"
                        name="rePassword"
                        required placeholder="تکرار رمز ورود"
                        value={rePassword}
                        onChange={e => {
                            setRePassword(e.target.value);
                            validator.current.showMessageFor(
                                "rePassword"
                            );
                        }} />
                    {validator.current.message(
                        "rePassword",
                        rePassword,
                        `required|min: 5|in:${password}`
                    )}



                    <input type="submit" value="تغییر رمز " className="send" />

                </form>

            </div>
        </>
    )
}

export default ResetPassword
