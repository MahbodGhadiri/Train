import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { showSuccess,showError } from '../Toast_Functions';
import { selectReload, setReload } from '../../features/task/taskSlice';
import UserPopUp from './UserPopUp';


function AddTask() {

    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [days, setDays] = useState(null);
    const [subjectTag, setSubjectTag] = useState("");
    const [executors, setExecutors] = useState([]);
    const dispatch = useDispatch();
    const reload = useSelector(selectReload);

    const reset = () => {
        setTitle("");
        setTask("");
        setDays(0);
        setSubjectTag("");
        setExecutors([]);

    };
    const addTask = async (event) => {
        event.preventDefault();

        const Task = {
            title: title,
            task: task,
            startDate: moment().format('YYYY-MM-D '),
            finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
            executors: [executors],
            subjectTag: subjectTag
        };
       
        await axios.post("/admin/tasks",
            Task,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(response => {
                showSuccess(response);
                reset();
                ///////////////
                if (reload === false) {
                    dispatch(setReload({
                        reload: true
                    }))

                } else {
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

    return (
        <div>
            <div className="borderc">
                <h2>پست جدید</h2>
                <form onSubmit={(event) => addTask(event)}>
                    <i className="fa fa-circle" style={{ color: "#00af91" }} ariaHidden="true" ></i>
                    <input type="text" name="tpost" placeholder="موضوع خود را بنویسید" required value={title} onChange={e =>
                        setTitle(e.target.value)
                    } />
                    <textarea name="cpost" cols="30" rows="10" placeholder="توضیحات" required value={task} onChange={e =>
                        setTask(e.target.value)
                    }></textarea>
                    <img src="./images/formicn.png" alt="formicn" />
                    <input list="category" type="text" name="titr" placeholder="موضوع" required value={subjectTag} onChange={e =>
                        setSubjectTag(e.target.value)
                    } />

                    <input  type="button" list="userslist" onClick={ <UserPopUp/>}  name="user" placeholder="کاربر" required value={executors} onChange={e =>
                        setExecutors(e.target.value)
                    } />
                    
                    <input type="number" name="time" placeholder="زمان" required value={days} onChange={e =>
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

                <datalist id="userslist">
                    <option value=" احمد" />
                    <option value="امین" />
                    <option value="مهبد" />
                    <option value="محمد جمشید" />
                </datalist>
            </div>
        </div>
    )
}

export default AddTask;
