import React, { useEffect, useState } from 'react'
import { selectTask, selectReload } from '../../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setReload, } from '../../features/task/taskSlice';
import axios from 'axios';
import { showError } from '../Toast_Functions';
import { store } from '../../app/store';
import moment from "moment";
import { dateToJalali, find_diff } from '../date_functions';
import { setSingleTasks } from '../../features/task/singleTaskSlice';



const AdminTaskBox = () => {



    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    const [userList, setUserList] = useState("")
    const [time, setTime] = useState("")
    const [category, setCategory] = useState("");
    let [filter, setFilter] = useState("");
    let [GoingToBeEditedTask, setGoingToBeEditedTask] = useState({title:"",task:"",subjectTag:"",startDate:"",});
    let tempFilter = "";

    //const [sendRequest, setSendRequest] = useState(false);
    function filterTask(event) {
        event.preventDefault();

        if (category) {
            // console.log(category);
            tempFilter = `subject=${category}&`;

        }
        if (time) {

            tempFilter += `days=${time}&`;
            // console.log(filter)
        }
        // if(userList)
        // {
        //     setFilter(filter+`userList=${userList}&`)
        // }

        setFilter(tempFilter)
        console.log(tempFilter);
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
        //////////////
    }
    useEffect(async () => {

        console.log('in you (if) in hook');
        await axios.get(`/admin/tasks/?${filter}`,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            // console.log(response);
            tasks = response.data.tasks;

            dispatch(setReload({
                reload: true
            }));
            console.log(reload);
        }).catch(error => {
            console.log(error);
            showError(error);
        });

        // console.log(tasks);
        dispatch(
            setTasks({
                task: tasks
            }));

    }, [store.getState().task.reload]);
    async function deleteTask(e, taskId) {
        e.preventDefault();

        console.log(taskId);

        await axios.delete(`/admin/tasks/delete/?task=${taskId}`,
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

    async function okTask(e, taskId) {
        e.preventDefault();

        console.log(taskId);

        await axios.get(`/admin/tasks/done?task=${taskId}`,
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
    async function confirmTask(e, taskId) {
        e.preventDefault();
        deleteTask(e,taskId)
    }
    function editTask(e, taskik) {
        e.preventDefault();
        dispatch(setSingleTasks({singleTask: taskik}));

    }
    
    return (
        <div>
            <h2 >فعالیت های کاربران</h2>
            <div>
                <form onSubmit={(event => filterTask(event))}>
                    <img src="./images/formicn.png" alt="formicn" />
                    <input list="category" name="titr" placeholder="موضوع" value={category} onChange={e => setCategory(e.target.value)} />
                    <datalist id="category" >
                        <option value="برنامه نویسی" />
                        <option value="گرافیک" />
                        <option value="مدیریت مالی" />
                        <option value="مدیریت" />
                    </datalist>
                    <input type="text" list="userslist" name="username" placeholder="کاربر " onChange={e => setUserList(e.target.value)} />
                    <datalist id="userslist" >
                        <option value=" احمد" />
                        <option value="امین" />
                    </datalist>

                    <input type="number" name="time" placeholder="زمان(روز)" value={time} onChange={e => setTime(e.target.value)} />

                    <input type="submit" value="ثبت" />

                </form>
            </div>
            <div>

            </div>

            <div>
                {taskList &&
                    taskList.map(
                        (task, key) => (
                            <div className="alonerow" style={task.done || task.delay ? { opacity: "50%" } : { opacity: "100" }}>
                                <div className="task">
                                    <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                    <h3>{task.title}</h3>
                                    <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => deleteTask(e, task._id)}></i>
                                    <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true" ></i>
                                    {task.done ? <i className="fa fa-circle circle-topbtn" style={{ color: "green" }} aria-hidden="true" onClick={e => confirmTask(e, task._id)}></i> : <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i>}                                    <div className="task-down">
                                        <p>
                                            {task.task}
                                        </p>
                                        <span className="created" style={{ color: "#868686" }} >توسط <span style={{ color: "#ffb830" }} >{task.assignedBy.name}<span style={{ opacity: "0" }}>-</span></span></span>

                                        <span className="created" style={{ color: "#868686" }} > <span >برای</span> {task.executors[0] === undefined ? <span >همه</span> : <></>} <span style={{ color: "#ffb830" }} >
                                            {task.executors && task.executors.map(
                                                (executor, index) => {
                                                    if (index != 0)
                                                        return (<span > <span style={{ opacity: "0" }}>-</span> <sth style={{ color: "#868686" }}> و </sth> <span> {executor.name} </span> </span>)
                                                    else
                                                        return executor.name
                                                }

                                            )}</span></span>



                                        <div className="edit" onClick={e=>editTask(e,task)}>ویرایش</div>
                                        <div className="date">
                                            <span>
                                                {`از ${dateToJalali(task.startDate)} تا ${dateToJalali(task.finishDate)} `}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="time">
                                    {find_diff(task.startDate, moment())}
                                </div>
                            </div>
                        )
                    )}
            </div>
        </div>
    )
}

export default AdminTaskBox;





