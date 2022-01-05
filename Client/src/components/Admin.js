import React, { useEffect, useState } from 'react'
import Header from './Header';
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginDetails, selectUserName } from '../features/user/userSlice';
import axios from 'axios';
import AdminTaskBox from './AdminTaskBox';
import AddTask from './AddTask';
import AddPin from './AddPin';
import UserPinBox from "./UserPinBox"
import { showError } from './Toast_Functions';

function Admin() {
    const dispatch = useDispatch();
    const name = useSelector(selectUserName);

    async function prof() {
        // event.preventDefault();

        await axios.get("/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            dispatch(
                setUserLoginDetails({
                    name: response.data.name,
                    phone: response.data.phone.number,
                    email: response.data.email.address,
                })
            )
        }).catch(error => {
            showError(error);
            console.log(error);
        });
    }
    setTimeout(() => prof(), 1000); //? What is this suppose to do?

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
    //         .then(response => {
    //             console.log(response);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         })
    // }
    return (

        <div dir="rtl">
            {/* <button onClick={event => prof(event)}>322</button> */}
            <div className="content">
                <Header />


                <div className="right alonebox">
                    
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

                    <AddTask />

                    <AddPin />

                </div>

                <div style={{ clear: 'both' }} ></div>

                <UserPinBox />


            </div>


        </div>
    )
}

export default Admin;

