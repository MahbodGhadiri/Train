import React, { useEffect } from 'react'
import Header from '../Header';
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginDetails, selectUserName, selectUserAbility, selectUserAvatarURL } from '../../features/user/userSlice';
import axios from 'axios';
import AdminTaskBox from './AdminTaskBox';
import AddTask from './AddTask';
import AddPin from './AddPin';
import UserPinBox from "../UserComponents/UserPinBox"
import { showError } from '../Toast_Functions';
import { checklogin } from "../CheckLogin";
import $ from 'jquery';
import { setUserId } from '../SessionStorage';
import { Link } from 'react-router-dom';
function Admin() {
    const dispatch = useDispatch();
    const name = useSelector(selectUserName);
    const talents = useSelector(selectUserAbility);
    const avatarURL = useSelector(selectUserAvatarURL);
    async function prof() {
        // event.preventDefault();

        await axios.get("/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            setUserId(response.data._id)
            dispatch(
                setUserLoginDetails({
                    name: response.data.name,
                    phone: response.data.phone.number,
                    email: response.data.email.address,
                    ability: response.data.ability,
                    avatarURL: response.data.avatarURL,
                })
            )
        }).catch(error => {
            showError(error);
            checklogin(error)
        });
    }
    useEffect(async () => {
        prof();
    }, [])

    //Jquery useEffect
    useEffect(() => {





        // Height Window
        var hw = ($(window).height()) - 125;
        $('.alonebox,.groupbox').css('height', hw + 'px');



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




    });
    //Jquery useEffect
    return (

        <div dir="rtl">
            {/* <button onClick={event => prof(event)}>322</button> */}
            <div className="content">
                <Header />


                <div className="right alonebox">

                    <AdminTaskBox />

                </div>


                <div className="right shapebox">
                    <div className="imgsbox">
                        <div className="borderc">

                            <img src="./images/header_logo.png" alt="Train" />

                        </div>
                        <div className="borderc" style={{ width: '90%', margin: '0 auto' }}>
                            <Link to="/home/avatar">
                                {/* <div style={{
                                    height: "350px", width: "200px", backgroundImage: "url(../avatars/boy1.png)", backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain", textAlign:"center", marginLeft:"500px"
                                }} className="admin-img"> 
                                </div>*/}
                                {avatarURL !== "" ? <div className='showavatarbox admin-img' style={{ backgroundImage: `url(../avatars/${avatarURL}.png)`, marginBottom: "10px" }}></div>
                                :
               
                                <div className='showavatarbox admin-img' style={{ backgroundImage: `url(../avatars/boy1.png)`, marginBottom: "10px" }}></div>
                                        }


                            </Link>
                            <h2>{name}</h2>
                            <div className="img-sortby">
                                <span style={{ color: "#ff2442" }}>{"" + talents + ""}</span>

                            </div>
                        </div>
                    </div>
                </div>


                <div className="right groupbox">

                    <AddTask />

                    <AddPin />

                </div>

                <div style={{ clear: 'both' }} ></div>

                <UserPinBox />



            </div>


        </div>
    )
}

export default Admin;

