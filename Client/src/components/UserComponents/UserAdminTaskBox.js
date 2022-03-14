import React, { useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { selectUserTasks, selectuserTasksFilter,  fetchUserTasks } from '../../features/task/userTasksSlice';
import { setUserTasksStatus } from '../../features/task/userTasksSlice';
import axios from 'axios';
import { showError, showSuccess } from '../Toast_Functions';
import { dateToJalali, find_diff } from '../date_functions';
import { checklogin } from '../CheckLogin';



function UserAdminTaskBox() {
    const dispatch = useDispatch();
    const taskList = useSelector(selectUserTasks);
    const tasksStatus = useSelector(state=>state.userTasks.status);
    const filter = useSelector(selectuserTasksFilter);
    async function delayTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.get(`/user/tasks/delay?task=${taskId}`)
        .then(response => {
            showSuccess(response);
            dispatch(setUserTasksStatus({status:"idle"}));
        }).catch(error => {
            showError(error);
            checklogin(error);
        });
    }
    
    async function okTask(e, taskId) {
        e.preventDefault();

        await axios.get(`/user/tasks/done?task=${taskId}`)
        .then(response => {
            showSuccess(response);
            dispatch(setUserTasksStatus({status:"idle"}));
        }).catch(error => {
            showError(error);
            checklogin();
        });
    }

    useEffect(() => {
        if (tasksStatus==="idle"){
            dispatch(fetchUserTasks(filter));
        }

    }, [tasksStatus,dispatch]);

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
                                    <Link to={`/home/task/${task._id}?role=user`}>
                                    <h3>{task.title}</h3>
                                    </Link>
                                    <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => {
                                        delayTask(e, task._id);
                                    }}></i>
                                    <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} ariaHidden="true" ></i>
                                    {task.done ? <i className="fa fa-circle circle-topbtn" style={{ color: "green" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i> : <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true" onClick={e => okTask(e, task._id)}></i>}
                                    <div className="task-down">
                                        <p>
                                            {task.task}
                                        </p>
                                        <span className="created" style={{ color: "#868686" }} >توسط <span style={{ color: "#ffb830" }} >{task.assignedBy.name}<span style={{ opacity: "0" }}>-</span></span></span>

                                        <div className="date" style={find_diff(task.finishDate) < 0 ? { backgroundColor: "rgb(255, 36, 66)" } : {}}>
                                                <span>
                                                    {`از ${dateToJalali(task.startDate)} تا ${dateToJalali(task.finishDate)} `}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {find_diff(task.finishDate) < 0 ?
                                        <div className="time" style={{ backgroundColor: "rgb(255, 36, 66)" }}>
                                            تمام
                                        </div> :
                                        <div className="time">
                                            {find_diff(task.finishDate)}
                                        </div>
                                    }
                            </div>
                            
                        ))}

            </div>
        </div>
    )
}

export default UserAdminTaskBox
