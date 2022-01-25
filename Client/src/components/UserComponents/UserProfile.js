import React, { useEffect, useState, useRef } from 'react'
import { showError, showSuccess } from '../Toast_Functions';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserEmail, selectUserName, selectUserPhone, setUsersList, selectUserList, setUserLoginDetails, selectUserAbility } from '../../features/user/userSlice';
import SimpleReactValidator from "simple-react-validator";
import { checklogin } from '../CheckLogin';

function Profile() {
    const dispatch = useDispatch();

    //----------------------------------------------
    const perName = useSelector(selectUserName);
    const perEmail = useSelector(selectUserEmail);
    const perPhoneNumber = useSelector(selectUserPhone);
    const perTalents = useSelector(selectUserAbility);
    //-------------------------------------------
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [talents, setTalents] = useState([]);
    //-------------------------------------------
    const userList = useSelector(selectUserList);
    let users = [];

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
        const editTalents = perTalents.concat(talents);
        const user = {
            name: name ? name : perName,
            phoneNumber: phoneNumber ? phoneNumber : perPhoneNumber,
            ability: talents ?  editTalents : perTalents
        }
        await axios.put("/user/change-info",
            user,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            showSuccess(response)
            console.log(response)
        }).catch(error => {
            showError(error);
            console.log(error);
        });

    }

    async function logOut(event) {
        event.preventDefault();
        await axios.get(`/user/logout`,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then((response) => {
            console.log(response);
            window.sessionStorage.removeItem("isUserAuthenticated");
            window.sessionStorage.removeItem("role");
            window.location.reload();
        }).catch((error) => {
            showError(error)
        });
    }

    useEffect(async () => {

        prof();


        dispatch(setUsersList({ userList: users }));
    }, []);
    async function prof() {
        // event.preventDefault();

        await axios.get("/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response)
            dispatch(
                setUserLoginDetails({
                    name: response.data.name,
                    phone: response.data.phone.number,
                    email: response.data.email.address,
                    ability: response.data.ability,
                })
            )
        }).catch(error => {
            showError(error);

            console.log(error);
            checklogin(error);
        });
    }

    function AddTalents(e, talent) {
        e.preventDefault();
        console.log(talent);
        console.log(perTalents);
        if (perTalents.find(epr => epr === talent) === undefined) {
            talents.push(talent);

        } else {
            console.log("مهارت قبلا وجود داشت ");
        }
        
    }

    return (
        <div>
            <div>
                <body dir="rtl">
                    <div className="pro-content">


                        <div className="signup" style={{marginBottom:"5px"}}>
                            <div className="edit-box">
                                <div className="edit-imgbox"><img src="../images/logo-min.png" alt="Train-logo" /></div>

                                <form onSubmit={event => editUser(event)}  >
                                    <input type="text" placeholder={perName} value={name}
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


                                    <input type="text"
                                        placeholder={perEmail}
                                        value={email}
                                        onChange={e => {
                                            setEmail(e.target.value);
                                            validator.current.showMessageFor("email");
                                        }} readOnly/>
                                    


                                    <input type="text" pattern="09(0[0-9]|1[0-9]|3[0-9]|2[0-9])-?[0-9]{3}-?[0-9]{4}" maxlength="11" placeholder={perPhoneNumber} autoComplete="off" value={phoneNumber}
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

                                    <div className="skillsbox">{!perTalents || perTalents?.length == 0 ? "مهارتی نیست" : perTalents.toString()}
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
                                    <input type="submit" value="ویرایش" id="edit-btn" />
                                    <h2 style={{ cursor: "pointer", textAlign: "center" }}>
                                        <a style={{ cursor: "pointer", textAlign: "center" }} onClick={event => logOut(event)} >خروج</a>
                                    </h2>
                                </form>
                            </div>
                        </div>







                        <div style={{ clear: "both" }} ></div>
                    </div >
                </body>
            </div >
        </div >
    )
}

export default Profile
