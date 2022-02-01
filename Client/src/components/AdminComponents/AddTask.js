import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { showSuccess, showError } from '../Toast_Functions';
import { selectReload, setReload } from '../../features/task/taskSlice';
import { selectSingleTask } from '../../features/task/singleTaskSlice';
import { find_diff } from '../date_functions';

function AddTask() {
    const singleTask = useSelector(selectSingleTask);
    const [stateTask, setStateTask] = useState({});
    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [days, setDays] = useState(null);
    const [subjectTag, setSubjectTag] = useState("");
    const dispatch = useDispatch();
    const reload = useSelector(selectReload);
    const [users, setUsers] = useState([])
    let executors = [];

    const reset = () => {
        setTitle("");
        setTask("");
        setDays(0);
        setSubjectTag("");

    };

    const setExecutors = () => {
        //user must be an object with name and _id
        for (let i = 0; i < users.length; i++) {
            const cb = document.querySelector(`#cb${users[i]._id}`)
            if (cb.checked) {
                console.log(cb.checked)
                executors.push({ _id: users[i]._id, name: users[i].name })
            }
        }
    }

    function setEditTaskExecutors(executors) {

        for (let i = 0; i < executors.length; i++) {
            console.log(document.querySelector(`#cb${executors[i]._id}`));
            document.querySelector(`#cb${executors[i]._id}`).checked = true;
        }
    }
    const addTask = async (event) => {
        event.preventDefault();
        setExecutors();
          
            const Task = {
                title: title === "" ? singleTask.title : title,
                task: task === "" ? singleTask.task : task,
                startDate: moment().format('YYYY-MM-D '),
                finishDate: days !== null ? moment().add(days, 'days').format('YYYY-MM-D ') : moment().add(find_diff(singleTask.finishDate), 'days').format('YYYY-MM-D '),
                executors: executors === [] ? singleTask.executors : executors,
                subjectTag: subjectTag === "" ? singleTask.subjectTag : subjectTag
            };

        if (singleTask !== null) {
            await axios.put("/admin/tasks/edit",
            Task,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(response => {
                showSuccess(response);
                reset();
                // removing ckeck marks from checkboxes
                for (let i = 0; i < users.length; i++) {
                    document.querySelector(`#cb${users[i]._id}`).checked = false;
                }

                ///////////////
                if (reload === false) {
                    console.log("changing reload to true");
                    dispatch(setReload({
                        reload: true
                    }))

                } else {
                    console.log("changing reload to false");
                    dispatch(setReload({
                        reload: false
                    }))
                }
                //////////////
            })
            .catch(error => {
                showError(error);
                console.log(error.response.message)
            })
        } else {

            

            await axios.post("/admin/tasks",
                Task,
                { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                .then(response => {
                    showSuccess(response);
                    reset();
                    // removing ckeck marks from checkboxes
                    for (let i = 0; i < users.length; i++) {
                        document.querySelector(`#cb${users[i]._id}`).checked = false;
                    }

                    ///////////////
                    if (reload === false) {
                        console.log("changing reload to true");
                        dispatch(setReload({
                            reload: true
                        }))

                    } else {
                        console.log("changing reload to false");
                        dispatch(setReload({
                            reload: false
                        }))
                    }
                    //////////////
                })
                .catch(error => {
                    showError(error);
                    console.log(error.response.message)
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

        await axios.get("/admin/users", { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then((response) => {
                console.log(response)
                setUsers(response.data)
            }).catch((err) => {
                showError(err)
            })
        setStateTask(singleTask)
    }, [])

    return (
        <div>
            <div className="borderc">
                <h2>پست جدید</h2>
                <form onSubmit={(event) => addTask(event)}>
                    <i className="fa fa-circle" style={{ color: "#00af91" }} ariaHidden="true" ></i>
                    <input type="text" name="tpost" placeholder={singleTask === null ? "موضوع خود را بنویسید" : singleTask.title} value={title} onChange={e =>
                        setTitle(e.target.value)
                    } />
                    <textarea name="cpost" cols="30" rows="10" placeholder={singleTask === null ? "توضیحات خود را بنویسید" : singleTask.task} value={task} onChange={e =>
                        setTask(e.target.value)
                    }></textarea>
                    <img src="./images/formicn.png" alt="formicn" />
                    <input list="category" type="text" name="titr" placeholder={singleTask === null ? "سابجکت" : singleTask.subjectTag} value={subjectTag} onChange={e =>
                        setSubjectTag(e.target.value)
                    } />

                    <div id="list1" class="dropdown-check-list" tabindex="100">
                        <span class="anchor" onClick={singleTask === null ? <></> : setEditTaskExecutors(singleTask.executors)}> کاربر</span>
                        <ul class="items">
                            {users && users.map((user) => (
                                <li><input type="checkbox" id={`cb${user._id}`} value={user.name} />{user.name} </li>
                            ))}
                        </ul>
                    </div>

                    <input type="number" name="time" placeholder={singleTask === null ? "زمان" : find_diff(singleTask.startDate, moment())} value={days} onChange={e =>
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
