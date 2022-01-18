import React from 'react'
import Header from "./Header";
import UserAdminTaskBox from './UserAdminTaskBox';
import UserPinBox from "./UserPinBox";
import UserTaskBox from './UserTaskBox';
import { selectTask, selectReload, selectClick } from '../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setReload, setClick } from '../features/task/taskSlice';
import axios from 'axios';
import { showError } from './Toast_Functions';
import { store } from '../app/store';






function User() {
    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    const [userList, setUserList] = useState("")
    const [time, setTime] = useState("")
    const [category, setCategory] = useState("");
    let [filter, setFilter] = useState("");
    let tempFilter = "";

    const [sendRequest, setSendRequest] = useState(false);
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
            taskId,
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
        <div dir="rtl">
            <div className="content">

                <Header />


                <UserTaskBox />

                <div className="right shapebox">
                    <div className="imgsbox">
                        <img src="./images/t-logo.png" alt="Train" />
                        <img src="./images/shape-1-min.png" alt="" />
                    </div>
                    <h2>احمد رضا وکیلی</h2>
                    <div className="img-sortby">
                        <span style={{ color: "#ff2442" }} >کدفرانت</span>
                        <span style={{ color: "#00af91" }}>فایننشال</span>
                    </div>
                </div>

                <UserAdminTaskBox />

                <div style={{ clear: "both" }}></div>


                <UserPinBox />
                <div className="post-btn">
                    <span>جدید</span>
                </div>

                <div className="post">
                    <i className="fa fa-times" aria-hidden="true"></i>
                    <h2>پست جدید</h2>
                    <form action="#new-post.php" method="post">
                        <i className="fa fa-circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                        <input type="text" name="tpost" placeholder="موضوع خود را بنویسید" required />
                        <textarea name="cpost" id="" cols="30" rows="10" placeholder="توضیحات" required></textarea>
                        <input type="text" name="retpost" placeholder="موضوع" required />
                        <input type="text" name="time" placeholder="زمان" required />
                        <input type="submit" value="ثبت" />
                    </form>
                </div>

            </div>
        </div >
    )
}

export default User;
