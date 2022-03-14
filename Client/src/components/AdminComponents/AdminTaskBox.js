import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectAdminTasks, selectAdminTasksFilter, fetchAdminTasks } from '../../features/task/adminTasksSlice';
import { setTasksStatus, setTasksFilter, setToBeEditedTask } from '../../features/task/adminTasksSlice';
import axios from 'axios';
import { showError, showSuccess } from '../Toast_Functions';
import { dateToJalali, find_diff } from '../date_functions';
import { Link , useRouteMatch} from 'react-router-dom';
import { checklogin } from '../CheckLogin';



const AdminTaskBox = () => {
    const dispatch = useDispatch();
    const taskList = useSelector(selectAdminTasks);
    const filter = useSelector(selectAdminTasksFilter);
    const taskStatus = useSelector(state => state.adminTasks.status);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("");
    const [time, setTime] = useState("")
    const [category, setCategory] = useState("");
    let {url} = useRouteMatch()

    function filterTask(event) {
        event.preventDefault(); //? is this needed?

        let tempFilter = "";
        if (category) {
            tempFilter = `subject=${category}&`;
        }
        if (time) {
            tempFilter += `days=${time}&`;
        }
        if(user)
        {
            let index = users.findIndex(singleUser => singleUser.name === user);
            if (index === -1){
               alert("متاسفانه چنین کاربری وجود ندارد ")
               //TODO use tostify instead of alert
            }else{
                tempFilter += `user=${users[index]._id}&`;
            }   
        }
        dispatch(setTasksFilter({filter:tempFilter}))
    }

    useEffect(()=>{
        if(taskStatus==="idle"){
            dispatch(fetchAdminTasks(filter));
        }
    },[taskStatus, dispatch])

    useEffect(async () => {
        await axios.get("/admin/users")
        .then((response) => {
            setUsers(response.data);
        }).catch((err) => {
            showError(err)
        })
    }, []);
    
    async function deleteTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.delete(`/admin/tasks/delete/?task=${taskId}`)
        .then(response => {
            showSuccess(response);
            dispatch(setTasksStatus({status:"idle"}));
        }).catch(error => {
            checklogin(error);
            showError(error);
        });
    }    
    
    async function okTask(e, taskId) {
        e.preventDefault(); //? is this needed?

        await axios.put(`/admin/tasks/done?task=${taskId}`)
        .then(response => {
            showSuccess(response);
            dispatch(setTasksStatus({status:"idle"})) ; 
        }).catch(error => {
            checklogin(error);
            showError(error);
        });
    }
    
    async function confirmTask(e, taskId) { //? whats the point of this?
        e.preventDefault(); 
        deleteTask(e,taskId)
    }
    
    function editTask(e, task) {
        e.preventDefault();
        dispatch(setToBeEditedTask({toBeEditedTask: task}));
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
                    <input type="text" list="userslist1" name="username" placeholder="کاربر " onChange={e => setUser(e.target.value)} />
                    <datalist id="userslist1" >
                        {users && users.map((user, key)=>{
                            <option value={user.name} key={key} />
                        })}
                        
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
                           
                            <div className="alonerow" style={task.done || task.delayed ? { opacity: "50%" } : { opacity: "100" }}>
                                <div className="task">
                                    
                                    <i className="fa fa-circle circle" style={{ color: '#707070' }} ariaHidden="true"></i>
                                    <Link to={`${url}/task/${task._id}?role=admin`}>
                                    <h3>{task.title}</h3>
                                    </Link>
                                    <i className="fa fa-times" style={{ background: '#ff2442' }} ariaHidden="true" onClick={e => {
                                            
                                                deleteTask(e, task._id)
                                            
                                            
                                        }}></i>
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
                                        <div className="date" style={find_diff(task.finishDate) < 0 ? { backgroundColor: "rgb(255, 36, 66)" } : {}}>
                                                <span>
                                                    {`از ${dateToJalali(task.startDate)} تا ${dateToJalali(task.finishDate)} `}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {find_diff(task.finishDate) < 0 ?
                                        <div className="time" style={{ backgroundColor: "rgb(255, 36, 66)" }}>
                                             {find_diff(task.finishDate)}
                                        </div> :
                                        <div className="time">
                                            {find_diff(task.finishDate)}
                                        </div>
                                    }
                            </div>
                             
                        )
                        
                    )
                }
            </div>
        </div>
    )
}

export default AdminTaskBox;





