import React, { useEffect } from 'react'
import { selectTask, selectReload } from '../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks , setReload} from '../features/task/taskSlice';
import axios from 'axios';
import {toast } from 'react-toastify';

const toastOptions=
    {   position: "top-right",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        autoClose: 5000,
        hideProgressBar: true
    }

const AdminTaskBox = () => {


    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    

    useEffect(async () => {
        
        console.log(reload);

        if (reload === false) {
            console.log('in you (if) in hook');

            await axios.get("/admin/tasks",
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            ).then(responce => {
                // console.log(responce);
                tasks = responce.data.tasks;
                
                dispatch(setReload({
                    reload: true
                }));
                console.log(reload);
            }).catch(error => {
                console.log(error);
                const showError = () => toast.error(error.response.data.message,toastOptions);
                showError();
            });

            // console.log(tasks);
            dispatch(
                setTasks({
                    task: tasks
                }));
        }
    }, []);

    return (
        <div>
            {taskList &&
                taskList.map(
                    (task, key) => (
                        <div className="alonerow">
                            <div className="task">
                                <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                <h3>{task.title}</h3>
                                <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" ></i>
                                <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true"  ></i>
                                <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} ariaHidden="true"  ></i>
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
    )
}

export default AdminTaskBox;





