import axios from "axios";
import React, { useState, useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import {toast } from 'react-toastify';

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const [, forceUpdate] = useState();


    //user validation with "SimpleReactValidator" start
    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: `لطفا بیشتر از 5 و کتر از 30 کاراکتر وارد کنید`,
                max: `لطفا بیشتر از 5 و کتر از 30 کاراکتر وارد کنید`,
                email: "ایمیل نوشته شده صحیح نمی باشد",
                size: "داشم فقط 11 تا",
                phone: "لطفا شماره را صحیح وارد کنید",

            },
            element: message => <div style={{ color: "red", textAlign: "center", fontSize: "2vh" }}>{message}</div>
        })
    );
    //user validation with "SimpleReactValidator" end

    //register and reset start

    const reset = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
    };

    const register = async event => {
        event.preventDefault();
        const user = {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: password
        };
        try {
            if (validator.current.allValid()) {
                console.log("user registration info all valid");
                let status;
                // api call begin
                await axios.post("http://localhost:8080/api/auth/register", user).then(responce => {
                    console.log(responce.status);
                    status = responce.status;
                    const showInfo = () => toast.info(responce.data.message, {
                        position: "top-right",
                        autoClose: false,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    showInfo();
                }).catch(error => {
                    const showError = () => toast.error(error.response.data.message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        });
                    showError();

                })
                // api call end

                if (status === 200) {
                    history.push("/login");
                    setLoading(false);
                    reset();
                }
                else {
                    // toast.error("دوباره امتحان کن سیبیل", {
                    //     position: "top-right",
                    //     closeOnClick: true
                    // });
                    console.log("error");
                }
            }
        }
        catch (ex) {
            setLoading(false);
            console.log(ex);
        }
    };



    //register and reset start end

    return (

        <div className="signup">


            <div className="logo sl-logo">
                <img src="./images/logo-min.png" alt="Train" title="Train" />
            </div>

            <div className="links">


                <Link to="/Signup"> ثبت نام </Link>
                <Link to="/Login">  ورود </Link>



            </div>


            <form action="#" onSubmit={register}>
                <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="نام"
                    value={name}
                    onChange={e => {
                        setName(e.target.value);
                        validator.current.showMessageFor(
                            "name"
                        );

                    }} />
                {validator.current.message(
                    "name",
                    name,
                    `required|max: 30|min: 5 `
                )}

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
                    type="number"
                    name="phoneNumber"
                    required
                    pattern="09(0[0-9]|1[0-9]|3[0-9]|2[0-9])-?[0-9]{3}-?[0-9]{4}"
                    maxLength="11" placeholder="شماره همراه (***0912)"
                    value={phoneNumber}
                    onChange={e => {
                        setPhoneNumber(e.target.value);


                        validator.current.showMessageFor(
                            "phoneNumber"
                        );
                    }} />

                {validator.current.message(
                    "phoneNumber",
                    phoneNumber,
                    `required|phone`
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

                <input type="password" required placeholder="تکرار رمز ورود" />
                <input type="submit" value="ثبت نام" className="send" />
            </form>

        </div>
    );
}

export default Signup;