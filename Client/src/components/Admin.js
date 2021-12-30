import React, { useEffect, useState } from 'react'
import Header from './Header';
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginDetails, selectUserName } from '../features/user/userSlice';
import axios from 'axios';
import AdminTaskBox from './AdminTaskBox';
import AddTask from './AddTask';
import AddPin from './AddPin';
import UserPinBox from "./UserPinBox"
function Admin() {
    const dispatch = useDispatch();
    const name = useSelector(selectUserName);

    async function prof() {
        // event.preventDefault();
        await axios.get("http://localhost:8080/api/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(responce => {
            // console.log(responce);
            dispatch(
                setUserLoginDetails({
                    name: responce.data.name,
                    phone: responce.data.phone.number,
                    email: responce.data.email.address,
                }))

        }).catch(error => {
            console.log(error);
        });
        console.log("12345")
    }
    setTimeout(()=> prof(),1000);

    // const addTask = async (event) => {
    //     event.preventDefault();
    //     console.log("i");

    //     const Task = {
    //         title: title,
    //         task: task,
    //         startDate: moment().format('YYYY-MM-D '),
    //         finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
    //         executors: [executors],
    //         subjectTag: subjectTag
    //     };
    //     console.log(Task);

    //     await axios.post("http://localhost:8080/api/admin/tasks",
    //         Task,
    //         { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
    //         .then(responce => {
    //             console.log(responce);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }

    return (

        <div dir="rtl">
            <button onClick={event => prof(event)}>322</button>
            <div className="content">
                <Header />


                <div className="right alonebox">
                    <h2>فعالیت های کاربران</h2>

                    <form action="#" method="post">
                        <img src="./images/formicn.png" alt="formicn" />
                        <input type="text" name="titr" placeholder="موضوع" required />
                        <input type="text" name="username" placeholder="کاربر" required />
                        <input type="text" name="time" placeholder="زمان" required />
                        <input type="submit" value="ثبت" />
                    </form>
                    <div>
                    
                    </div>

                    <AdminTaskBox />

                </div>


                <div className="right shapebox">
                    <div className="imgsbox">
                        <div className="borderc">
                            <img src="./images/t-logo.png" alt="Train" />
                        </div>
                        <div className="borderc" style={{ width: '90%', margin: '0 auto' }}>
                            <img src="./images/shape-2-min.png" className="admin-img" alt="" />
                            <h2>{name}</h2>
                            <div className="img-sortby">
                                <span style={{ color: "#ff2442" }}>کدفرانت</span>
                                <span style={{ color: "#ffb830" }}>Ui/Ux</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right groupbox">
                   
                    <AddTask/>

                    <AddPin/>
                   
                </div>

                <div style={{ clear: 'both' }} ></div>

                <UserPinBox/>
               

            </div>


        </div>
    )
}

export default Admin;

