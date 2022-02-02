import React, { useEffect, useState } from 'react'
import { selectTask, selectReload } from '../../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setReload, } from '../../features/task/taskSlice';
import axios from 'axios';
import { showError } from '../Toast_Functions';
import { store } from '../../app/store';
import { dateToJalali, find_diff } from '../date_functions';



function UserAdminTaskBox() {
    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    let [filter, setFilter] = useState("");


    //const [sendRequest, setSendRequest] = useState(false);

    async function delayTask(e, taskId) {
        e.preventDefault();

        console.log(taskId);

        await axios.get(`/user/tasks/delay?task=${taskId}`,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response);


        }).catch(error => {
            console.log(error);
            showError(error);
        });

        if (reload === false) {
            dispatch(setReload({
                reload: true
            }))

        } else {
            dispatch(setReload({
                reload: false
            }))
        }
        console.log(reload);
    }
    useEffect(async () => {
        setFilter();
        console.log('getting admin taskbox');
        await axios.get(`/user/tasks/?${filter}`,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response);
            tasks = response.data.tasks;

            dispatch(setReload({
                reload: true
            }));
            console.log(reload);
        }).catch(error => {
            console.log(error);
            showError(error);
        });

        dispatch(
            setTasks({
                task: tasks
            }));

    }, [store.getState().task.reload]);
    // async function deleteTask(e, taskId) {
    //     e.preventDefault();

    //     console.log(taskId);

    //     await axios.delete(`/user/tasks/delete/?task=${taskId}`,
    //         { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    //     ).then(response => {
    //         console.log(response);


    //     }).catch(error => {
    //         console.log(error);
    //         showError(error);
    //     });

    //     if (reload === false) {
    //         dispatch(setReload({
    //             reload: true
    //         }))

    //     } else {
    //         dispatch(setReload({
    //             reload: false
    //         }))
    //     }
    //     console.log(reload);
    // }
    async function okTask(e, taskId) {
        e.preventDefault();

        console.log("ncvdovnnnlskdvnkfvmd;fkbm");

        await axios.get(`/user/tasks/done?task=${taskId}`,

            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response);


        }).catch(error => {
            console.log(error);
            showError(error);
        });

        if (reload === false) {
            dispatch(setReload({
                reload: true
            }))

        } else {
            dispatch(setReload({
                reload: false
            }))
        }
        console.log(reload);
    }

    return (
        <div>
            <div className="right groupbox">
                <h2>فعالیت های گروهی</h2>



                {taskList &&
                    taskList.map(
                        (task, key) => (
                            <div className="alonerow" style={task.done ? { opacity: "50%" } : { opacity: "100" }}>
                                <div className="task">
                                    <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                    <h3>{task.title}</h3>
                                    <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => {
                                        console.log(task.delayed);

                                        console.log("delayed");
                                        delayTask(e, task._id);

                                    }}></i>
                                    <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true" ></i>
                                    {task.done ? <i className="fa fa-circle circle-topbtn" style={{ color: "green" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i> : <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i>}
                                    <div className="task-down">
                                        <p>
                                            {task.task}
                                        </p>
                                        <span className="created" style={{ color: "#868686" }} >توسط <span style={{ color: "#ffb830" }} >{task.assignedBy.name}<span style={{ opacity: "0" }}>-</span></span></span>

                                        <div className="date">
                                            <span>
                                                {`از ${dateToJalali(task.startDate)} تا ${dateToJalali(task.finishDate)} `}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="time">
                                    {find_diff(task.finishDate)}
                                </div>
                            </div>
                        ))}

            </div>
        </div>
    )
}

export default UserAdminTaskBox
