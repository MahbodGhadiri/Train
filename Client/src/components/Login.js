import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import SimpleReactValidator from "simple-react-validator";
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectUserEmail,
    selectUserName,
    selectUserRole,
    selectUserAuthenticationStatus,
    setUserLoginDetails,
} from '../features/user/userSlice';
import axios from "axios";
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {setUserAuthenticationStatus,getUserAuthenticationStatus} from "./SessionStorage"
function Login() {


    //user validation with "SimpleReactValidator" start
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

    const dispatch = useDispatch();
    const history = useHistory();
    const name = useSelector(selectUserName);
    const isUserAuthenticated = getUserAuthenticationStatus()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {

        console.log("hi");
      
    }, [name]);

    const reset = () => {
        setEmail("");
        setPassword("");
    };

    const login = async (event) => {
        if (validator.current.allValid()) {
            event.preventDefault();
            console.log("all inputs valid in front auth ");

            const user = { email, password };
            let status; let role;

            if (!name) {
                await axios.post(`/auth/login`,
                    user,
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                    .then((response) => {
                        console.log(response);
                        status = response.status;
                        console.log(status);
                        role = response.data.role;
                        console.log(role);
                        if(response.status===200)
                        setUserAuthenticationStatus("true")
                    }).catch((error) => {
                        
                         toast.error(error.response.data.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            });
                        
                    });


                if (status === 200) {
                    switch (role) {
                        case "admin":
                            history.push("/admin");
                            console.log("logged in")
                            break;
                        case "user":
                            history.push("/user");
                            break;
                        case "super admin":
                            history.push("/admin");
                            break;
                        default:
                            break;
                    }

                    reset();
                }
            } else if (name) {
                history.push("/signup")
            }
        }
    }

    const setUser = user => {
        dispatch(setUserLoginDetails({
            name: user.name,
            email: user.email.address,
            role: user.role
        }))

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
                    <input type="submit" value="ورود" className="send" />

                </form>
                
            </div>
        </>
    )
}

export default Login;
