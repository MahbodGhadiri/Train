import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { showInfo, showError } from "./Toast_Functions";
import $ from 'jquery';

const Signup = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    let talents = [];
    ///////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const history = useHistory();




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

    //register and reset start

    const reset = () => {
        setName("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setRePassword("")
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
                await axios.post("/auth/register", user).then(response => {
                    console.log(response.status);
                    status = response.status;
                    showInfo(response);

                }).catch(error => {
                    showError(error);
                })

                // api call end

                if (status === 200) {
                    history.push("/login");
                    setLoading(false);
                    reset();
                }

            }
        }
        catch (ex) {
            setLoading(false);
            console.log(ex);
        }
    };

    function AddTalents(e, talent) {
        e.preventDefault();
        console.log(talent);
        talents.push(talent);
        console.log(talents)

    }

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
                    style={{ textAlign: "right" }}
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
                    style={{ textAlign: "right" }}
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
                    style={{ textAlign: "right" }}
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
                    style={{ textAlign: "right" }}
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
                    style={{ textAlign: "right" }}
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
                <div className="skillsbox" style={{ textAlign: "right" }}
                    value={talents}
                    onChange={e => {
                        setRePassword(e.target.value);
                        validator.current.showMessageFor(
                            "talents"
                        );
                    }} >مهارت های خود را وارد نمایید
                    <i className="fa fa-arrow-down" aria-hidden="true"></i>
                    <ul>
                        <li>
                            <i className="fa fa-circle" style={{ color: "#00af91", cursor: "pointer" }} aria-hidden="true" onClick={e => AddTalents(e, "گرافیک")}></i> گرافیک
                        </li>
                        <li>
                            <i className="fa fa-circle" style={{ color: "#ff2442", cursor: "pointer" }} aria-hidden="true" onClick={e => AddTalents(e, "برنامه نویسی")}></i> برنامه نویسی
                        </li>
                        <li>
                            <i className="fa fa-circle" style={{ color: "#3db2ff", cursor: "pointer" }} aria-hidden="true" onClick={e => AddTalents(e, "محتوا")}></i> محتوا
                        </li>
                    </ul>
                </div>
                {validator.current.message(
                    "talents",
                    talents,
                    `required`
                )}
                <input type="submit" value="ثبت نام" className="send" />
            </form>

        </div>
    );
}

export default Signup;