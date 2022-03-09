import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { selectCustomTasks, selectCustomTasksFilter, fetchCustomTasks } from '../../features/task/customTasksSlice';
import { setCustomTasksStatus, setCustomTasksFilter } from '../../features/task/customTasksSlice';
import axios from 'axios';
import { showError, showSuccess } from '../Toast_Functions';
import { dateToJalali, find_diff } from "../date_functions";
import { checklogin } from '../CheckLogin';

function UserTaskBox() {

    const dispatch = useDispatch();
    const taskList = useSelector(selectCustomTasks);
    const taskStatus = useSelector(state=>state.customTasks.status);
    const filter = useSelector(selectCustomTasksFilter);
    const [userList, setUserList] = useState(""); //TODO filter using users
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("");

    useEffect(async () => {
        if(taskStatus==="idle"){
            dispatch(fetchCustomTasks(filter));
        }
    }, [taskStatus,dispatch]);

    async function deleteTask(e, taskId) {
        e.preventDefault();

        await axios.delete(`/user/custom-tasks/delete?task=${taskId}`)
        .then(response => {
            showSuccess(response);
            dispatch(setCustomTasksStatus({status:"idle"}))
        }).catch(error => {
            checklogin(error);
            showError(error);
        });
    }

    function filterTask(event) {
        event.preventDefault();
        let tempFilter = "";
        if (category) {
            tempFilter = `subject=${category}&`;
        }
        if (time) {
            tempFilter += `days=${time}&`;
        }
        // if(userList)
        // {
        //     setFilter(filter+`userList=${userList}&`)
        // }
        dispatch(setCustomTasksFilter({filter:tempFilter}))
    }

    async function unDoneTask(e, taskId, task) {
        //TODO after fixing api, just edit "done"
        await axios.put(`/user/custom-tasks/edit?task=${taskId}`, {
            title: task.title,
            task: task.task,
            startDate: task.startDate,
            finishDate: task.finishDate,
            subjectTag: task.subjectTag
        })
            .then(response => {
                showSuccess(response);
                dispatch(setCustomTasksStatus({status:"idle"}));
            })
            .catch(error => {
                checklogin(error);
                showError(error);
            });
    }
    async function okTask(e, taskId) {
        e.preventDefault();

        await axios.get(`/user/custom-tasks/done?task=${taskId}`)
            .then(response => {
                showSuccess(response);
                dispatch(setCustomTasksStatus({status:"idle"}))
            }).catch(error => {
                checklogin(error)
                showError(error);
            });
    }

    return (
        <div>
            <div className="right alonebox">
                <h2>فعالیت های فردی</h2>
                <div>

                    <form onSubmit={event => filterTask(event)}>
                        <img src="/images/formicn.png" alt="formicn" />
                        <input list="category" name="titr" placeholder="موضوع" value={category} onChange={e => setCategory(e.target.value)} />

                        <input type="text" list="userslist" name="username" placeholder="کاربر" onChange={e => setUserList(e.target.value)} />


                        <input type="number" name="time" placeholder="زمان(روز)" value={time} onChange={e => setTime(e.target.value)} />

                        <input type="submit" value="ثبت" />

                    </form>

                </div>

                {taskList &&
                    taskList.map(
                        (task, key) => (
                            <Link to={`/home/custom-task/${task._id}`}>
                            <div>

                                <div className="alonerow" style={task.done ? { opacity: "50%" } : { opacity: "100" }}>


                                    <div className="task">
                                        <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                        <h3>{task.title}</h3>
                                        <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => {
                                            if (task.done === true) {
                                                unDoneTask(e, task._id, task)
                                            } else {
                                                deleteTask(e, task._id)
                                            }
                                        }}></i>
                                        <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true" ></i>
                                        {task.done ? <></> : <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i>}
                                        <div className="task-down">
                                            <p>
                                                {task.task}
                                            </p>






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
                            </div>
                            </Link>
                        )
                    )}


            </div>

        </div>
    )
}

export default UserTaskBox;
