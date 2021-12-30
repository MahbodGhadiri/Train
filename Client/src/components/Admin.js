import React, { useEffect, useState } from 'react'
import Header from './Header';
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from '../features/task/taskSlice';
import { setUserLoginDetails, selectUserName } from '../features/user/userSlice';
import axios from 'axios';
import { selectTask } from '../features/task/taskSlice';
import moment from 'moment';
import AdminTaskBox from './AdminTaskBox';

function Admin() {
    const dispatch = useDispatch();
    // let tasks = [];
    const name = useSelector(selectUserName);

    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [days, setDays] = useState(0);
    const [subjectTag, setSubjectTag] = useState("");
    const [executors, setExecutors] = useState([]);
    const [startDate, setStartDate] = useState("");


    
    const prof = async () => {
       
        await axios.get("http://localhost:8080/api/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(responce => {
            // console.log(responce);
            dispatch(
                setUserLoginDetails({
                    name: responce.data.name,
                    phone: responce.data.phone.number,
                    email: responce.data.email.address,
                }))

        }).catch(error => {
            console.log(error);
        });
    }

    prof();
    
    const addTask = async (event) => {
        event.preventDefault();
        console.log("i");

        const Task = {
            title: title,
            task: task,
            startDate: moment().format('YYYY-MM-D '),
            finishDate: moment().add(days, 'days').format('YYYY-MM-D '),
            executors: [executors],
            subjectTag: subjectTag
        };
        console.log(Task);

        await axios.post("http://localhost:8080/api/admin/tasks",
            Task,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(responce => {
                console.log(responce);
            })
            .catch(error => {
                console.log(error);
            })
    }



    return (

        <div dir="rtl">

            <div className="content">
                <Header />

                <div className="right alonebox">
                    <h2>فعالیت های کاربران</h2>

                    <form action="#" method="post">
                        <img src="./images/formicn.png" alt="formicn" />
                        <input type="text" name="titr" placeholder="موضوع" required />
                        <input type="text" name="username" placeholder="کاربر" required />
                        <input type="text" name="time" placeholder="زمان" required />
                        <input type="submit" value="ثبت" />
                    </form>
                    <div>
                        {/* {taskList &&
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
                        )} */}
                    </div>
                    
                    <AdminTaskBox />

                </div>


                <div className="right shapebox">
                    <div className="imgsbox">
                        <div className="borderc">
                            <img src="./images/t-logo.png" alt="Train" />
                        </div>
                        <div className="borderc" style={{ width: '90%', margin: '0 auto' }}>
                            <img src="./images/shape-2-min.png" className="admin-img" alt="" />
                            <h2>{name}</h2>
                            <div className="img-sortby">
                                <span style={{ color: "#ff2442" }}>کدفرانت</span>
                                <span style={{ color: "#ffb830" }}>Ui/Ux</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right groupbox">
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


                    <div className="borderc pinbox">
                        <h2>پین جدید</h2>
                        <form action="#newpin.php" method="post">
                            <textarea name="cpin" cols="30" rows="10" placeholder="توضیحات" required></textarea>
                            <img src="./images/formicn.png" alt="formicn" />
                            <input type="text" name="titr" placeholder="موضوع" required />
                            <input type="submit" value="ثبت" />
                        </form>
                    </div>
                </div>
                <div style={{ clear: 'both' }} ></div>


                <div className="alert-b">
                    <i className="fa fa-circle" style={{ color: "#ffb830", right: "-40px" }} ariaHidden="true" ></i>
                    <i className="fa fa-circle" style={{ color: "#ff2442", right: "-20px" }} ariaHidden="true"></i>
                    <i className="fa fa-times" style={{
                        background: "#fff", color: "#ffffff", cursor: "pointer"
                    }} ariaHidden="true" ></i>
                    <p>طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر</p>
                    <i className="fa fa-circle" style={{
                        color: '#3db2ff', left: '-20px'
                    }} ariaHidden="true"></i>
                    <i className="fa fa-circle" style={{ color: '#00af91', left: '-40px' }} ariaHidden="true"></i>
                </div>

            </div>


        </div>
    )
}

export default Admin;

