import React, { useEffect, useState, useRef } from 'react'
import { showError, showSuccess } from '../Toast_Functions';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserEmail, selectUserName, selectUserPhone, setUsersList, selectUserList, setUserLoginDetails, selectUserRole, selectUserAbility } from '../../features/user/userSlice';
import SimpleReactValidator from "simple-react-validator";
import { checklogin } from '../CheckLogin';
import { emptySessionStrage, getUserId, setUserId } from "../SessionStorage"
import { selectReload, setReload } from '../../features/task/adminTasksSlice';
import { Link } from 'react-router-dom';
import { store } from '../../app/store';
import { findLastActivity } from "../date_functions"


function Profile() {
    const dispatch = useDispatch();

    //----------------------------------------------
    const perName = useSelector(selectUserName);
    const perEmail = useSelector(selectUserEmail);
    const perPhoneNumber = useSelector(selectUserPhone);
    const perTalents = useSelector(selectUserAbility);
    const perRole = useSelector(selectUserRole);
    //-------------------------------------------
    let [perUserName, setPerUserName] = useState(perName);
    let [perUserEmail, setPerUserEmail] = useState(useSelector(selectUserEmail));
    let [perUserPhoneNumber, setPerUserPhoneNumber] = useState(useSelector(selectUserPhone));
    let [perUserRole, setPerUserRole] = useState("");
    let [perUserId, setPerUserId] = useState(perRole);
    //-------------------------------------------
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [talents, setTalents] = useState([]);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    //-------------------------------------------
    const reload = useSelector(selectReload);
    const [activated, setActivated] = useState(false);
    //-------------------------------------------
    const userList = useSelector(selectUserList);
    let users = [];
    const [showDeleteAccountBox, setShowDeleteAccountBox] = useState(false);
    const [showChangePasswordBox, setShowChangePasswordBox] = useState(false);
    //user validation with "SimpleReactValidator" start
    const validator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "پر کردن این فیلد الزامی میباشد",
                min: `لطفا حداقل 8 کاراکتر وارد کنید`,
                max: `لطفا کمتر از 30 کاراکتر وارد کنید`,
                email: "ایمیل نوشته شده صحیح نمی باشد",
                phone: "لطفا شماره را صحیح وارد کنید",
                in: "رمزها تطابق ندارند"
            },
            element: message => <div style={{ color: "red", textAlign: "center", fontSize: "2vh" }}>{message}</div>
        })
    );
    //user validation with "SimpleReactValidator" end

    // edit user
    async function editUser(event) {
        event.preventDefault();

        const editTalents = perTalents.concat(talents);

        const user = {
            name: name ? name : perName,
            phoneNumber: phoneNumber ? phoneNumber : perPhoneNumber,
            ability: talents !== [] ? editTalents : ["دیگر"],
        }

        await axios.put("/user/change-info",user)
        .then(response => {
            showSuccess(response)
        }).catch(error => {
            showError(error);
            checklogin(error)
        });

        if (newPassword) {
            await axios.post("/user/change-password",
                { newPassword: newPassword, oldPassword: password },
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            ).then(response => {
                showSuccess(response)
            }).catch(error => {
                showError(error);
                checklogin(error)
            });
        }

    }
    // log out
    async function logOut(event) {
        event.preventDefault();
        
        await axios.get(`/user/logout`)
        .then((response) => {
            emptySessionStrage();
            window.location.reload();
        }).catch((error) => {
            showError(error)
            checklogin(error)
        });
    }
    // profile
    useEffect(async () => {

        prof();
        await axios.get(`/admin/users`,)
        .then(response => {
            users = response.data
        }).catch(error => {
            console.log(error);
            showError(error);
            checklogin(error)
        });

        dispatch(setUsersList({ userList: users }));
    }, [store.getState().adminTasks.reload]);
    async function prof() {
        // event.preventDefault();

        await axios.get("/user/profile")
        .then(response => {
            setUserId(response.data._id)
            dispatch(
                setUserLoginDetails({

                    name: response.data.name,
                    phone: response.data.phone.number,
                    email: response.data.email.address,
                    ability: response.data.ability,
                    role: response.data.role,

                })
            )
        }).catch(error => {
            showError(error);
            checklogin(error);
        });
    }
    function AddTalents(e, talent) {
        e.preventDefault();
        if (talents.find(e => e === talent) === undefined) {
            talents.push(talent);
        } else {
            showError({ response: { data: { message: "مهارت قبلا وجود داشت" } } })
        }

    }
    function showInfo(e, name, email, phone, role, id) {
        e.preventDefault();
        setPerUserEmail(email);
        setPerUserName(name);
        setPerUserPhoneNumber(phone);
        setPerUserRole(role);
        setPerUserId(id);
    }
    async function activeUser(e, userId) {
        e.preventDefault();
        await axios.put(`admin/users/activate?user=${userId}`)
        .then(response => {
            showSuccess(response);
            setActivated(true);
        }).catch(error => {
            showError(error);
            checklogin(error);
        })
        ///////////////
        if (reload === false) {
            dispatch(setReload({
                reload: true
            }))

        } else {
            dispatch(setReload({
                reload: false
            }))
        }
        //////////////
    }
    async function deActiveUser(e, userId) {
        e.preventDefault();
        await axios.put(`admin/users/deactivate?user=${userId}`)
        .then(response => {
            showSuccess(response);
            setActivated(false);
        }).catch(error => {
            showError(error);
            checklogin(error);
        })
        ///////////////
        if (reload === false) {
            dispatch(setReload({
                reload: true
            }))

        } else {
            dispatch(setReload({
                reload: false
            }))
        }
        //////////////
    }
    async function promoteUser(e, userId) {
        e.preventDefault();
        await axios.put(`admin/users/promote?user=${userId}`)
        .then(response => {
            showSuccess(response);
            setPerUserRole("admin");

        }).catch(error => {
            showError(error);
            checklogin(error);
        })

    }
    async function demoteUser(e, userId) {
        e.preventDefault();
        await axios.put(`admin/users/demote?user=${userId}`,
            {}, { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            showSuccess(response);
            setPerUserRole("user");
        }).catch(error => {
            showError(error);
            checklogin(error);
        })
    }
    async function deleteUser(e, userId) {
        e.preventDefault();
        await axios.post(`user/delete-account?user=${userId}`,
            { password: password },
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true },

        ).then(response => {
            showSuccess(response);
            emptySessionStrage();
            window.location.reload();
        }).catch(error => {
            showError(error);
            checklogin(error);
        })
    }

    return (
        <div>
            <body dir="rtl">
                <div className="pro-content">

                    <div className="right">
                        <div className="edit-box">
                            <div className="edit-imgbox">
                                <Link to={`/home`}>
                                    <img src="../images/logo-min.png" alt="Train-logo" />
                                </Link>
                            </div>

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
                                    `max: 30|min: 5 `
                                )}


                                <input type="text"
                                    placeholder={perEmail}
                                    value={email}
                                    onChange={e => {
                                        setEmail(e.target.value);
                                        validator.current.showMessageFor("email");
                                    }} readOnly />



                                <input type="text" pattern="09(0[0-9]|1[0-9]|3[0-9]|2[0-9])-?[0-9]{3}-?[0-9]{4}" maxlength="11" placeholder={perPhoneNumber} autocomplete="new-password" value={phoneNumber}
                                    onChange={e => {
                                        setPhoneNumber(e.target.value);


                                        validator.current.showMessageFor(
                                            "phoneNumber"
                                        );
                                    }} />

                                {validator.current.message(
                                    "phoneNumber",
                                    phoneNumber,
                                    `phone`
                                )}

                                <div className="skillsbox">{!perTalents || perTalents?.length === 0 ? "مهارتی نیست" : perTalents.toString()}
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
                                <input type="submit" value="ویرایش" id="edit-btn" style={{ marginTop: "10px" }} />

                                <div>
                                    <h4 style={{ cursor:"pointer",color: "black", marginBottom: "-20px", width: "80%", textAlign: "center", marginLeft: "auto", marginRight: "auto" }} onClick={() => { setShowDeleteAccountBox(!showDeleteAccountBox); setShowChangePasswordBox(false) }}> پاک کردن اکانت {showDeleteAccountBox === false ? <span> &#8595; </span> : <span> &#8593; </span>}</h4>
                                    {showDeleteAccountBox === true ?
                                        <div>
                                            <br />
                                            <div>

                                                <hr style={{ marginTop: "20px", margin: "20px" }} />
                                                <input
                                                    style={{ textAlign: "right" }}
                                                    type="password"
                                                    name="password"
                                                    autocomplete="new-password"
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
                                                    `min: 8`
                                                )}
                                                
                                                
                                                <input type="submit" value="پاک کردن اکانت" onClick={e => deleteUser(e, perUserId)} style={{ color: "white", backgroundColor: "#ff2442", marginBottom: "-20px", width: "80%" }} id="edit-btn" />
                                                <br />
                                                <hr style={{ marginTop: "20px", margin: "20px" }} />
                                            </div>
                                        </div> : <></>}
                                </div>

                                <div style={{ marginTop: "20px" }}>
                                    <h4 style={{ cursor:"pointer",color: "black", marginBottom: "-20px", width: "80%", textAlign: "center", marginLeft: "auto", marginRight: "auto" }} onClick={() => { setShowDeleteAccountBox(false); setShowChangePasswordBox(!showChangePasswordBox) }}>تغییر رمز {showChangePasswordBox === false ? <span> &#8595; </span> : <span> &#8593; </span>}</h4>
                                    {showChangePasswordBox === true ? <div>
                                        <br />
                                        <div>

                                            <hr style={{ marginTop: "20px", margin: "20px" }} />
                                            <input
                                                style={{ textAlign: "right" }}
                                                type="password"
                                                name="password"
                                                autocomplete="off"
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
                                                `min: 8`
                                            )}
                                            <input
                                                style={{ textAlign: "right" }}
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="رمز جدید"
                                                value={newPassword}
                                                onChange={e => {
                                                    setNewPassword(e.target.value);
                                                    validator.current.showMessageFor(
                                                        "password"
                                                    );
                                                }} />
                                            {validator.current.message(
                                                "password",
                                                newPassword,
                                                `min: 8`
                                            )}
                                            <input
                                                style={{ textAlign: "right" }}
                                                type="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="تکرار رمز جدید"
                                                value={newPassword}
                                                onChange={e => {
                                                    setNewPassword(e.target.value);
                                                    validator.current.showMessageFor(
                                                        "password"
                                                    );
                                                }} />
                                            {validator.current.message(
                                                "password",
                                                newPassword,
                                                `min: 8`
                                            )}
                                            <input type="submit" value="تغییر رمز" onClick={e => deleteUser(e, perUserId)} style={{ color: "white", backgroundColor: "#3E2C41", marginBottom: "-20px", width: "80%" }} id="edit-btn" />
                                            <br />
                                            <hr style={{ marginTop: "20px", margin: "20px" }} />
                                        </div>
                                    </div> : <></>}
                                </div>

                            </form>
                        </div>
                    </div>

                    <div className="left">
                        <div className="show-box">

                            <h2>پروفایل</h2>
                            <div className="show-item">
                                <i className="fa fa-circle" style={{ color: "#00af91" }} aria-hidden="true"></i>
                                <input type="text" value={perUserName ? perUserName : perName} readonly />
                            </div>
                            <div className="show-item">
                                <i className="fa fa-circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                                <input type="email" value={perUserEmail ? perUserEmail : perEmail} readonly />
                            </div>

                            <input type="text" value={perUserPhoneNumber ? perUserPhoneNumber : perPhoneNumber} readonly />

                            <input type="text" value={perUserRole ? perUserRole : perRole} readonly />
                            {/* {
                                perRole === perUserRole || perUserRole === "" ?
                                    <input type="submit" value="پاک کردن اکانت" onClick={e => demoteUser(e, perUserId)} style={{ color: "red", width: "45%", backgroundColor: "white" }} />
                                    :
                                    <></>
                            } */}
                            {perUserRole === "admin" || perUserRole === "user" ? <div>
                                <input type="submit" value="ترفیع" onClick={e => promoteUser(e, perUserId)} style={{ color: "green", width: "45%", backgroundColor: "white" }} />
                                <input type="submit" value="نه ترفیع" onClick={e => demoteUser(e, perUserId)} style={{ color: "red", width: "45%", backgroundColor: "white" }} />
                            </div> : <></>
                            }
                            <h2>مشاهده کاربران</h2>

                            {userList &&
                                userList.map(
                                    (user) => {
                                        if (user._id != getUserId()) {
                                            return (<div className="user" style={user.activeAccount === true ? { opacity: "100%" } : { opacity: "50%" }} >

                                                <i className="fa fa-times"
                                                    style={{ background: "#ff2442" }}
                                                    aria-hidden="true"
                                                    onClick={e => deActiveUser(e, user._id)}></i>



                                                <i
                                                    className="fa fa-arrow-down active"
                                                    style={{ transform: 'rotate(180deg)' }}
                                                    aria-hidden="true"
                                                    onClick={e => showInfo(e, user.name, user.email.address, user.phone.number, user.role, user._id)}></i>

                                                <i
                                                    className="fa fa-circle circle-topbtn"
                                                    style={{ color: "#00af91" }}
                                                    aria-hidden="true"
                                                    onClick={e => activeUser(e, user._id)}
                                                ></i>

                                                <i
                                                    className="fa fa-circle"
                                                    style={{ color: "#707070" }}
                                                    aria-hidden="true"
                                                ></i> {user.name}({user.role}{user.activeAccount})

                                                {user.lastActivity && user.lastActivity ? <span> <span > ( </span>
                                                    <span> {findLastActivity(user.lastActivity) ? `${findLastActivity(user.lastActivity)[1]} ${findLastActivity(user.lastActivity)[0]} پیش` : " "} </span>
                                                    <span >) </span></span> : <></>}

                                            </div>

                                            )
                                        }
                                    }
                                )
                            }


                            <h2>
                                <a style={{ cursor: "pointer" }} onClick={event => logOut(event)} >خروج</a>
                            </h2>
                        </div >
                    </div >

                    <div style={{ clear: "both" }} ></div>
                </div >
            </body>
        </div >
    )
}

export default Profile;
