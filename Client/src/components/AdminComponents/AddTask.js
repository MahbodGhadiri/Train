import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectToBeEditedTask,  setToBeEditedTask, setTasksStatus } from '../../features/task/adminTasksSlice'
import { setUserTasksStatus } from '../../features/task/userTasksSlice';
import moment from 'moment';
import axios from 'axios';
import { showSuccess, showError } from '../Toast_Functions';
import { find_diff } from '../date_functions';
import { checklogin } from '../CheckLogin';

//TODO this component need a button to opt out of editing.
function AddTask() {
    const dispatch = useDispatch();
    const toBeEditedTask = useSelector(selectToBeEditedTask);
    const [title, setTitle] = useState(""); 
    const [task, setTask] = useState(""); 
    const [days, setDays] = useState(null); 
    const [subjectTag, setSubjectTag] = useState(""); 
    const [assignedBy, setAssignedBy] = useState(undefined); //server handle this on post but not put //TODO server completly handle assignedBy
    const [isEditing, setIsEditing] = useState(false);
    const [taskId, setTaskId] = useState(undefined)
    const [users, setUsers] = useState([]) //TODO usersSlice api call
 
    let executors = [];

    if(toBeEditedTask){
        setTaskId(toBeEditedTask._id);
        setTitle(toBeEditedTask.title);
        setTask(toBeEditedTask.task);
        setDays(find_diff(toBeEditedTask.finishDate));
        setSubjectTag(toBeEditedTask.subjectTag);
        setAssignedBy(toBeEditedTask.assignedBy);
        setEditTaskExecutors(toBeEditedTask.executors);
        setIsEditing(true);
        dispatch(setToBeEditedTask({toBeEditedTask:undefined}));
    }
    
    const reset = () => { 
        setTaskId(undefined);
        setTitle("");
        setTask("");
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
                console.log(cb.checked) //TODO remove this
                executors.push({ _id: users[i]._id, name: users[i].name })
            }
        }
    }

    function setEditTaskExecutors(executors) {
        for (let i = 0; i < executors.length; i++) {
            document.querySelector(`#cb${executors[i]._id}`).checked = true;
        }
    }

    const addTask = async (event) => {
        event.preventDefault();
        setExecutors();
    
        const payload = {
            title: title,
            task: task,
            startDate: moment().format('YYYY-MM-D '),
            finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
            executors: executors,
            subjectTag: subjectTag
        };

        if (isEditing) {
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
        else {
            await axios.post("/admin/tasks",payload)
            .then(response => {
                showSuccess(response);
                reset();
                dispatch(setTasksStatus({status:"idle"}));
                dispatch(setUserTasksStatus({status:"idle"}));
            })
            .catch(error => {
                showError(error);
                checklogin(error)
            })
        }
    }

    useEffect(() => {
        var checkList = document.getElementById('list1');
        checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
            else
                checkList.classList.add('visible');
        }
    })

    useEffect(async () => {

        //TODO create userSlice api call
        await axios.get("/admin/users")
            .then((response) => {
                setUsers(response.data);
            }).catch((err) => {
                showError(err);
                checklogin(err);
            })
    }, [])

    return (
        <div>
            <div className="borderc">
                <h2>پست جدید</h2>
                <form onSubmit={(event) => addTask(event)}>
                    <i className="fa fa-circle" style={{ color: "#00af91" }} ariaHidden="true" ></i>
                    <input type="text" name="tpost" placeholder={"موضوع خود را بنویسید"} value={title} onChange={e =>
                        setTitle(e.target.value)
                    } />
                    <textarea name="cpost" cols="30" rows="10" placeholder={"توضیحات خود را بنویسید"} value={task} onChange={e =>
                        setTask(e.target.value)
                    }></textarea>
                    <img src="./images/formicn.png" alt="formicn" />
                    <input list="category" type="text" name="titr" placeholder={"سابجکت"} value={subjectTag} onChange={e =>
                        setSubjectTag(e.target.value)
                    } />

                    <div id="list1" class="dropdown-check-list" tabindex="100">
                        <span class="anchor"> کاربر</span>
                        <ul class="items">
                            {users && users.map((user) => (
                                <li><input type="checkbox" id={`cb${user._id}`} value={user.name} />{user.name} </li>
                            ))}
                        </ul>
                    </div>

                    <input type="number" name="time" placeholder={"زمان"} value={days} onChange={e =>
                        setDays(e.target.value)
                    } />
                    <input type="submit" value="ثبت" />
                </form>

                <datalist id="category">
                    <option value="برنامه نویسی" />
                    <option value="گرافیک" />
                    <option value="مدیریت مالی" />
                    <option value="مدیریت" />
                </datalist>


            </div>
        </div>
    )
}

export default AddTask;
