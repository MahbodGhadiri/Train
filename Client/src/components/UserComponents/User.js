import React, { useState, useEffect } from 'react'
import Header from "../Header";
import UserAdminTaskBox from './UserAdminTaskBox';
import UserPinBox from "./UserPinBox";
import UserTaskBox from './UserTaskBox';
import { selectTask, selectReload, } from '../../features/task/taskSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTasks, setReload, } from '../../features/task/taskSlice';
import axios from 'axios';
import { showError } from '../Toast_Functions';
import { store } from '../../app/store';
import $ from 'jquery';
import { showSuccess } from '../Toast_Functions';
import moment from 'moment';
import { setUserLoginDetails, selectUserName, selectUserAbility } from '../../features/user/userSlice';
import { checklogin } from '../CheckLogin';

function User() {

    const dispatch = useDispatch();
    let tasks = [];
    const taskList = useSelector(selectTask);
    const reload = useSelector(selectReload);
    const talents = useSelector(selectUserAbility);
    const [userList, setUserList] = useState("");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState("");
    let [filter, setFilter] = useState("");
    let tempFilter = "";
    const [title, setTitle] = useState("");
    const [task, setTask] = useState("");
    const [days, setDays] = useState(null);
    const [subjectTag, setSubjectTag] = useState("");
    const [executors, setExecutors] = useState([]);
    const name = useSelector(selectUserName);
   
    async function prof() {
 

        await axios.get("/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response)
            dispatch(
                setUserLoginDetails({
                    name: response.data.name,
                    phone: response.data.phone.number,
                    email: response.data.email.address,
                    ability: response.data.ability,
                })
            )
        }).catch(error => {
            showError(error);

            console.log(error);
            checklogin(error)
        });
    }
    setTimeout(() => prof(),1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);

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
            subjectTag: subjectTag
        };

        await axios.post("/user/custom-tasks",
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
    useEffect(async () => {

        $('.skillsbox .fa-arrow-down').click(function (e) {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $('.skillsbox ul').slideDown();
                $(this).css('transform', 'rotate(180deg)');
            } else {
                $('.skillsbox ul').slideUp();
                $(this).css('transform', 'rotate(0deg)');
            }
        });

        $('.show-box .show-item i.fa-eye').click(function () {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {

                $(this).removeClass('fa-eye').addClass('fa-eye-slash');
                $('#pro-pass').attr('type', 'text');
            } else {
                $(this).removeClass('fa-eye-slash').addClass('fa-eye');
                $('#pro-pass').attr('type', 'password');
            }
        });



        // Height Window
        var hw = ($(window).height()) - 125;
        $('.alonebox,.groupbox').css('height', hw + 'px');

        // Post
        $('.post-btn').click(function (e) {
            $('.post').show(200);
        });
        $('.post .fa-times').click(function (e) {
            $('.post').hide(200);
        });

        // Alert Close
        $('.alert-b i.fa-times').click(function (e) {
            $('.alert-b').hide(100);
        });

        // AloneRow
        $('.alonerow i.fa-arrow-down').on('click', function () {
            $(this).closest('.task').find('.task-down').toggle(350);
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $(this).closest('.alonerow').find('.time').hide(200);
            } else {
                $(this).closest('.alonerow').find('.time').show(200);
            }
        });

        // Height Window
        var hw = ($(window).height()) - 130;
        $('.alonebox,.groupbox').css('height', hw + 'px');

        // Post
        $('.post-btn').click(function (e) {
            $('.post').show(200);
        });
        $('.post .fa-times').click(function (e) {
            $('.post').hide(200);
        });

        // Alert Close
        $('.alert-b i.fa-times').click(function (e) {
            $('.alert-b').hide(100);
        });
    });
    const talentTransformer = (e , talents) => {
        e.preventDefault()
        let output;
       
        for(let i = 0 ; i<talents.length; i++)
        {
            output = output+talents[i]+" "

        }
        console.log(output);
        return output;
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
                    <h2>{name}</h2>
                    <div className="img-sortby">

                        <span style={{ color: "#ff2442" }} >{e => talentTransformer(e , talents)}</span>

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

                    <form onSubmit={(event) => addTask(event)}>
                        <i className="fa fa-circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                        <input type="text" name="tpost" placeholder="موضوع خود را بنویسید" required value={title} onChange={e =>
                            setTitle(e.target.value)
                        } />
                        <textarea name="cpost" id="" cols="30" rows="10" placeholder="توضیحات" requiredvalue={task} onChange={e =>
                            setTask(e.target.value)
                        }></textarea>
                        <input type="text" name="retpost" placeholder="موضوع" required value={subjectTag} onChange={e =>
                            setSubjectTag(e.target.value)
                        } />
                        <input type="text" name="time" placeholder="زمان" requiredvalue={days} onChange={e =>
                            setDays(e.target.value)
                        } />
                        <input type="submit" value="ثبت" />

                    </form>

                </div>

            </div>
        </div >
    )
}

export default User;
