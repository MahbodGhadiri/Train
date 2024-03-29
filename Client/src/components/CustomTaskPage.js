import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { selectCustomTasks, selectToBeEditedTask, setCustomTasksStatus, setToBeEditedTask, fetchCustomTasks } from '../features/task/customTasksSlice';
import Page404 from "./404";
import { dateToJalali, find_diff } from "./date_functions";
import { checklogin } from "./CheckLogin";
import { showSuccess, showError } from "./Toast_Functions";
import axios from "axios";
import moment from "moment-jalaali";
function AdminTaskPage() {
    const dispatch = useDispatch();
    const tasks = useSelector(selectCustomTasks);
    const taskStatus = useSelector(state => state.customTasks.status)
    const toBeEditedTask = useSelector(selectToBeEditedTask)
    const history = useHistory();
    let { id } = useParams();


    //? is this part needed?
    const [title, setTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [days, setDays] = useState(null);
    const [subjectTag, setSubjectTag] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState(undefined);
    //?


    useEffect(() => {
        if (toBeEditedTask) {
            setTaskId(toBeEditedTask._id);
            setTitle(toBeEditedTask.title);
            setTaskDescription(toBeEditedTask.task);
            setDays(find_diff(toBeEditedTask.finishDate));
            setSubjectTag(toBeEditedTask.subjectTag);
            dispatch(setToBeEditedTask({ toBeEditedTask: undefined }));
        }
    }, [toBeEditedTask])

    useEffect(() => {
        if (taskStatus === "idle") {
            dispatch(fetchCustomTasks())
        }
    }, [taskStatus, dispatch])


    function showEditTaskBox(e, task) {
        e.preventDefault();
        setIsEditing(true);
        dispatch(setToBeEditedTask({ toBeEditedTask: task }));
    }
    async function deleteTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.delete(`/user/custom-tasks/delete?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setCustomTasksStatus({ status: "idle" }));
            }).catch(error => {
                checklogin(error);
                showError(error);
            });
        history.push("/home")
    }

    async function okTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.get(`/user/custom-tasks/done?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setCustomTasksStatus({ status: "idle" }));
            }).catch(error => {
                checklogin(error);
                showError(error);
            });
    }

    async function unOkTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.get(`/user/custom-tasks/unDone?task=${taskId}`)
            .then(response => {
                console.log(response)
                showSuccess(response);
                dispatch(setCustomTasksStatus({ status: "idle" }));
            })
            .catch(error => {
                checklogin(error);
                showError(error);
            });
    }
    const reset = () => {
        setTaskId(undefined);
        setTitle("");
        setTaskDescription("");
        setDays(null);
        setSubjectTag("");

        setIsEditing(false);
        // removing ckeckmarks from checkboxes

    };
    async function editTask(e, task) {
        e.preventDefault();
        console.log("editing task")

        const payload = {
            title: title,
            task: taskDescription,
            startDate: moment().format('YYYY-MM-D '),
            finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
            subjectTag: subjectTag
        };

        
        await axios.put(`/user/custom-tasks/edit?task=${taskId}`, payload)
            .then(response => {
                showSuccess(response);
                reset();
                dispatch(setCustomTasksStatus({ status: "idle" }));
            })
            .catch(error => {
                showError(error);
                checklogin(error);
            })

    }
    if (taskStatus === "succeed") {
        const task = tasks.find(task => task._id === id);
console.log(task)
        if (task) {
            return (

                <div>
                    <body dir="rtl">
                        <div className="pro-content">

                            {isEditing === false ?
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
                                                <i onClick={e => {
                                                    showEditTaskBox(e, task)

                                                }} style={{ margin: "5px", cursor: "pointer", padding: "8px 7px 8px 9px", backgroundColor: "#ffaa0e", borderRadius: "100px", color: "white" }} class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                                <i onClick={e => deleteTask(e, task._id)} style={{ margin: "5px", cursor: "pointer", padding: "8px 10px 8px 10px", backgroundColor: "#ff2442", borderRadius: "100px", color: "white" }} class="fa fa-trash-o" aria-hidden="true"></i>


                                            </div>

                                        </form>
                                    </div>
                                </div>
                                :
                                <div className="signup" style={{ marginBottom: "5px", marginTop: "-20px" }}>
                                    <div className="edit-box">
                                        <form style={{ maxWidth: "100%" }}>
                                            <div onClick={e => setIsEditing(false)}
                                                style={{ marginRight: "auto", marginLeft: "auto", borderRadius: "200px", textAlign: "center", cursor: "pointer", color: "black", }}>
                                                <h4 style={{ textAlign: "center", cursor: "pointer", color: "black", padding: "5px 10px" }}> بازگشت <span> &#8592; </span> </h4>
                                            </div>

                                            <input type="text" name="tpost" placeholder={"موضوع خود را بنویسید"} value={title} onChange={e =>
                                                setTitle(e.target.value)
                                            } />

                                            <textarea
                                                name="cpost"
                                                cols="30" rows="10"
                                                placeholder={"توضیحات خود را بنویسید"}
                                                value={taskDescription}
                                                onChange={e =>
                                                    setTaskDescription(e.target.value)
                                                }
                                                style={{ boxShadow: 'rgb(0 0 0 / 30%) 1px 1px 6px 0px', width: "70%", marginRight: "15%", marginLeft: "0", padding: "5px", borderRadius: "10px", border: "none" }}
                                            ></textarea>

                                            <input list="category" type="text" name="titr" placeholder={"سابجکت"} value={subjectTag} onChange={e =>
                                                setSubjectTag(e.target.value)
                                            } />

                                            <input type="number" name="time" placeholder={"زمان"} value={days} onChange={e =>
                                                setDays(e.target.value)
                                            } />
                                            <input type="submit" onClick={e => editTask(e, task)} style={{ backgroundColor: "#00af91", color: "white" }} value="ویرایش" />

                                        </form>

                                    </div>
                                </div>

                            }




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

export default AdminTaskPage;