import React, { useEffect, useState } from "react";
import { useParams , useHistory } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { selectUserTasks, selectToBeEditedTask, setTasksStatus, fetchUserTasks } from '../../features/task/userTasksSlice';
import Page404 from "../404";
import { dateToJalali , find_diff } from "../date_functions"; //? is this needed?
import { checklogin } from "../CheckLogin";
import { showSuccess, showError } from "../Toast_Functions";
import axios from "axios";

function TaskPage() {
    const dispatch = useDispatch();
    const tasks = useSelector(selectUserTasks);
    const taskStatus = useSelector(state => state.userTasks.status);

    const history = useHistory();
    let { id } = useParams();
    

    useEffect(() => {
        if (taskStatus === "idle") {
            dispatch(fetchUserTasks())
        }
    }, [taskStatus, dispatch])

    async function okTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.put(`/admin/tasks/done?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setTasksStatus({ status: "idle" }));
                history.push("/home")
            }).catch(error => {
                checklogin(error);
                showError(error);
            });
    }

    async function unOkTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.put(`/admin/tasks/unDone?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setTasksStatus({ status: "idle" }));
            }).catch(error => {
                checklogin(error);
                showError(error);
            });
    }
    
    if (taskStatus === "succeed") {
        const task = tasks.find(task => task._id === id);

        if (task) {
            return (

                <div>
                    <body dir="rtl">
                        <div className="pro-content">

                        
                                <div className="signup" style={{ marginBottom: "5px", marginTop: "-20px" }}>
                                    <div className="edit-box">


                                        <form  >
                                            <div onClick={e => history.push("/home")}
                                                style={{ marginRight: "auto", marginLeft: "auto", borderRadius: "200px", textAlign: "center", cursor: "pointer", color: "black", }}>
                                                <h4 style={{ textAlign: "center", cursor: "pointer", color: "black", padding: "5px 10px" }}> بازگشت <span> &#8592; </span> </h4>

                                            </div>
                                            <h2 style={{ cursor: "pointer", textAlign: "center", marginTop: "0px", marginBottom: "0" }}>
                                                {task.title}
                                            </h2>
                                            <h3 style={{ cursor: "pointer", textAlign: "center", marginTop: "0px", marginBottom: "0" }}>
                                                {task.done === true ? <span style={{ color: "green" }}>تسک از طرف شما انجام شده است  </span> : <span style={{ color: "#ff2442" }}> تسک هنوز انجام نشده است</span>}
                                            </h3>


                                            <p type="text"
                                                style={{
                                                    padding: "7px",
                                                    marginRight: "auto",
                                                    marginLeft: "auto",
                                                    maxWidth: "70%",

                                                    backgroundColor: "rgb(201, 76, 76 , 0)",
                                                    borderRight: "2px solid rgb(13, 0, 26)",
                                                    color: "black", opacity: "100"
                                                }} >
                                                {task.task}</p>
                                            <div style={{ color: "black", display: "flex", justifyContent: "center" }}>
                                                <h4 className="created"  >توسط <span style={{ color: "#ffb830" }} >{task.assignedBy.name}<span style={{ opacity: "0" }}>-</span></span></h4>

                                                <h4 className="created"  > <span >برای</span> {task.executors[0] === undefined ? <span >همه</span> : <></>} <span style={{ color: "#ffb830" }} >
                                                    {task.executors && task.executors.map(
                                                        (executor, index) => {
                                                            if (index != 0)
                                                                return (<span > <span style={{ opacity: "0" }}>-</span> <sth style={{ color: "#868686" }}> و </sth> <span> {executor.name} </span> </span>)
                                                            else
                                                                return executor.name
                                                        }

                                                    )}</span></h4>
                                            </div>

                                            <div style={{ display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                                                <h3 style={{ cursor: "pointer", textAlign: "center", margin: "5px" }}>
                                                    <span style={{ cursor: "pointer", textAlign: "center", }}>
                                                        {`از ${dateToJalali(task.startDate)} تا ${dateToJalali(task.finishDate)} `}
                                                    </span>
                                                </h3>

                                                {task.done !== true ? <div style={{ display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>
                                                    <h3 style={{ cursor: "pointer", textAlign: "center", margin: "5px" }}>
                                                        <span style={{ cursor: "pointer", textAlign: "center", }}>
                                                            یعنی                                                    </span>
                                                    </h3>
                                                    <h3 style={find_diff(task.finishDate) < 4 ? { cursor: "pointer", textAlign: "center", margin: "5px", color: "#ff2442" } : { cursor: "pointer", textAlign: "center", margin: "5px" }}>
                                                        <span style={{ cursor: "pointer", textAlign: "center" }}>
                                                            {find_diff(task.finishDate)} روز وقت داری
                                                        </span>
                                                    </h3></div>
                                                    :
                                                    <></>

                                                }
                                            </div>
                                            <div style={{ display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center" }}>

                                                {task.done === false ?
                                                    <i onClick={e => okTask(e, task._id)} style={{ margin: "5px", cursor: "pointer", padding: "8px 9px 8px 9px", backgroundColor: "#00af91", borderRadius: "100px", color: "white" }} class="fa fa-check-circle" aria-hidden="true"></i>
                                                    :
                                                    <i onClick={e => unOkTask(e, task._id)} style={{ margin: "5px", cursor: "pointer", padding: "8px 9px 8px 9px", backgroundColor: "#00af91", borderRadius: "100px", color: "white" }} class="fa fa-circle-o" aria-hidden="true"></i>

                                                }

                                            </div>




                                        </form>
                                    </div>
                                </div>
                            <div style={{ clear: "both" }} ></div>
                        </div >
                    </body>

                </div >

            )
        }
        else {
            return (
                <div>
                    <Page404 />
                </div>
            )
        }
    }

    else {
        //return template page
        return (
            <div>

            </div>
        )
    }

}

export default TaskPage;