import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import SimpleReactValidator from "simple-react-validator";
import axios from "axios";
import { showError } from '../Toast_Functions';
import 'react-toastify/dist/ReactToastify.css';
import { setUserAuthenticationStatus, setUserAuthorization } from "../SessionStorage"

function Login() {


    //user validation with "SimpleReactValidator" start
    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: `لطفا بیشتر از 5 کاراکتر وارد کنید`,
                min: `لطفا کمتر از 30 کاراکتر وارد کنید`,
                email: "ایمیل نوشته شده صحیح نمی باشد",

            },
            element: message => <div style={{ color: "red", textAlign: "center", fontSize: "2vh" }}>{message}</div>
        })
    );
    //user validation with "SimpleReactValidator" end

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async (event) => {
        if (validator.current.allValid()) {
            event.preventDefault();

            const user = { email, password };
            await axios.post(`/auth/login`,user)
                .then((response) => {
                    setUserAuthorization(response.data.role);
                    setUserAuthenticationStatus("true");
                    window.location.reload();    
                })
                .catch((error) => {
                    showError(error)
                });

        }
    }

    return (

        <>
            <div className="login">

                <div className="logo sl-logo">
                    <img src="./images/logo-min.png" alt="Train" title="Train" />
                </div>

                <div className="links">

                    <Link to="/Signup"> ثبت نام </Link>
                    <Link to="/Login">  ورود </Link>
                </div>


                <form action="#" method="post" onSubmit={login}>
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
                    <Link to="/forgot-password">
                        <p style={{ textAlign: "center", color: '#6e85b2', cursor: "pointer" }}>فراموشی رمز عبور</p>
                    </Link>
                    <input type="submit" value="ورود" className="send" />

                </form>

            </div>
        </>
    )
}

export default Login;
