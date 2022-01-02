import React ,{useState}from 'react'
import { useDispatch } from 'react-redux';
import moment from 'moment';
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

function AddTask() {
    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [days, setDays] = useState(0);
    const [subjectTag, setSubjectTag] = useState("");
    const [executors, setExecutors] = useState([]);
    
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
            .then(responce => {
                const showSuccess = () => toast.success(responce.data.message,toastOptions);
                showSuccess();
            })
            .catch(error => {
                const showError = () => toast.error(error.response.data.message,toastOptions);
                showError();
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
                    <input type="text" name="titr" placeholder="موضوع" required value={subjectTag} onChange={e =>
                        setSubjectTag(e.target.value)
                    } />
                    <input type="text" name="user" placeholder="کاربر" required value={executors} onChange={e =>
                        setExecutors(e.target.value)
                    } />
                    <input type="text" name="time" placeholder="زمان" required value={days} onChange={e =>
                        setDays(e.target.value)
                    } />
                    <input type="submit" value="ثبت" />
                </form>
            </div>
        </div>
    )
}

export default AddTask;
