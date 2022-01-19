import React, { useEffect, useState } from 'react'
import { selectTask, selectReload } from '../../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setReload, } from '../../features/task/taskSlice';
import axios from 'axios';
import { showError } from '../Toast_Functions';
import { store } from '../../app/store';




const AdminTaskBox = () => {



    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    const [userList, setUserList] = useState("")
    const [time, setTime] = useState("")
    const [category, setCategory] = useState("");
    let [filter, setFilter] = useState("");
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

        await axios.put(`/admin/tasks/done`,
            {taskId},
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
                    <input type="text" list="userslist" name="username" placeholder="کاربر" onChange={e => setUserList(e.target.value)} />
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
                            <div className="alonerow">
                                <div className="task">
                                    <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                    <h3>{task.title}</h3>
                                    <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => deleteTask(e, task._id)}></i>
                                    <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true" ></i>
                                    <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} ariaHidden="true"  onClick={e => okTask(e, task._id)}></i>
                                    <div className="task-down">
                                        <p>
                                            {task.task}
                                        </p>
                                        <span className="created" style={{ color: "#868686" }} >توسط <span style={{ color: "#ffb830" }} >امیرعلی</span></span>
                                        <div className="edit">ویرایش</div>
                                        <div className="date">
                                            <span>
                                                شنبه 13/13/13 تا چهارشنبه 12/45/07
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="time">
                                    sth
                                </div>
                            </div>
                        )
                    )}
            </div>
        </div>
    )
}

export default AdminTaskBox;





