import React, { useEffect, useState } from "react";
import { useParams , useHistory } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminTasks, selectToBeEditedTask, fetchAdminTasks } from '../../features/task/adminTasksSlice';
import {fetchUsers, selectUserList} from '../../features/user/userSlice';
import Page404 from "../404";
import { dateToJalali , find_diff } from "../date_functions";
import { checklogin } from "../CheckLogin";
import { showSuccess, showError } from "../Toast_Functions";
import axios from "axios";
import {  setToBeEditedTask, setTasksStatus } from '../../features/task/adminTasksSlice'
import moment from "moment-jalaali";
function TaskPage() {
    const dispatch = useDispatch();
    const tasks = useSelector(selectAdminTasks);
    const taskStatus = useSelector(state => state.adminTasks.status)
    const usersStatus = useSelector(state=>state.users.status);
    const users= useSelector(selectUserList);
    const history = useHistory();
    let { id } = useParams();
    
    const toBeEditedTask = useSelector(selectToBeEditedTask);
    
    //? is this part needed?
    const [title, setTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [days, setDays] = useState(null);
    const [subjectTag, setSubjectTag] = useState("");
    const [assignedBy, setAssignedBy] = useState(undefined); //server handle this on post but not put //TODO server completly handle assignedBy
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState(undefined);
    //?

    let executors = [];
    
    
    useEffect (()=>{
        if (toBeEditedTask) {
            setTaskId(toBeEditedTask._id);
            setTitle(toBeEditedTask.title);
            setTaskDescription(toBeEditedTask.task);
            setDays(find_diff(toBeEditedTask.finishDate));
            setSubjectTag(toBeEditedTask.subjectTag);
            setAssignedBy(toBeEditedTask.assignedBy);
            dispatch(setToBeEditedTask({ toBeEditedTask: undefined }));
            setEditTaskExecutors(toBeEditedTask.executors);
        }
    },[toBeEditedTask])

    useEffect(async () => {
        if(usersStatus ==="idle"){
            dispatch(fetchUsers());
        }
    }, [usersStatus,dispatch]);

    useEffect(() => {
        if (taskStatus === "idle") {
            dispatch(fetchAdminTasks())
        }
    }, [taskStatus, dispatch])

    useEffect(() => {
        if(isEditing){
            var checkList = document.getElementById('list1');
            checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
                if (checkList.classList.contains('visible'))
                    checkList.classList.remove('visible');
                else
                    checkList.classList.add('visible');
            }
        }
    },[isEditing])

    const reset = () => { 
        setTaskId(undefined);
        setTitle("");
        setTaskDescription("");
        setDays(null);
        setSubjectTag("");
        setAssignedBy(undefined);
        setIsEditing(false);
        // removing ckeckmarks from checkboxes
        for (let i = 0; i < users.length; i++) {
            document.querySelector(`#cb${users[i]._id}`).checked = false;
        }
    };
    const setExecutors = () => {
        //user must be an object with name and _id
        for (let i = 0; i < users.length; i++) {
            const cb = document.querySelector(`#cb${users[i]._id}`)
            if (cb.checked) {
                executors.push({ _id: users[i]._id, name: users[i].name })
            }
        }
    }


    function setEditTaskExecutors(executors) {
        for (let i = 0; i < executors.length; i++) {
            document.querySelector(`#cb${executors[i]._id}`).checked = true;
        }
    }


    function showEditTaskBox(e, task){
        e.preventDefault();
        setIsEditing(true);
        dispatch(setToBeEditedTask({ toBeEditedTask: task }));
    }

    async function editTask(e, task) {
        e.preventDefault();
        setExecutors();
    
        const payload = {
            title: title,
            task: taskDescription,
            startDate: moment().format('YYYY-MM-D '),
            finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
            executors: executors,
            subjectTag: subjectTag
        };

       
            payload.assignedBy= assignedBy;
            await axios.put(`/admin/tasks/edit?task=${taskId}`,payload)
            .then(response => {
                showSuccess(response);
                reset();
                dispatch(setTasksStatus({status:"idle"}));
            })
            .catch(error => {
                showError(error);
                checklogin(error);
            })
       
    }

    async function deleteTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.delete(`/admin/tasks/delete/?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setTasksStatus({ status: "idle" }));
            }).catch(error => {
                checklogin(error);
                showError(error);
            });
        history.push("/home")
    }

    async function okTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.put(`/admin/tasks/done?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setTasksStatus({ status: "idle" }));
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
                                            <div onClick={e=> setIsEditing(false)}
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

                                            <div
                                                id="list1"
                                                class="dropdown-check-list"
                                                tabindex="100"
                                                style={{ width: "70%", marginRight: "15%" }}>
                                                <span class="anchor" style={{ boxShadow: 'rgb(0 0 0 / 30%) 1px 1px 6px 0px', width: "100%", color: "black", backgroundColor: "white", borderRadius: "20px", padding: "5px 10px" }}> کاربر </span>
                                                <ul class="items">
                                                    {users && users.map((user) => (
                                                        <li><input type="checkbox" id={`cb${user._id}`} value={user.name} />{user.name} </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <input type="number" name="time" placeholder={"زمان"} value={days} onChange={e =>
                                                setDays(e.target.value)
                                            } />
                                            <input type="submit"  onClick={e=>editTask(e,task)} style={{ backgroundColor: "#00af91", color: "white" }} value="ویرایش" />

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

export default TaskPage;