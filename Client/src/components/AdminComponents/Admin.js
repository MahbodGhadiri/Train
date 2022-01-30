import React, { useEffect } from 'react'
import Header from '../Header';
import { useDispatch, useSelector } from "react-redux";
import { setUserLoginDetails, selectUserName } from '../../features/user/userSlice';
import axios from 'axios';
import AdminTaskBox from './AdminTaskBox';
import AddTask from './AddTask';
import AddPin from './AddPin';
import UserPinBox from "../UserComponents/UserPinBox"
import { showError } from '../Toast_Functions';
import { checklogin } from "../CheckLogin";
import $ from 'jquery';
import { setUserId } from '../SessionStorage';

function Admin() {
    const dispatch = useDispatch();
    const name = useSelector(selectUserName);

    async function prof() {
        // event.preventDefault();

        await axios.get("/user/profile",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            setUserId(response.data._id)
            console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
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
    useEffect(async () => {
        prof();
    }, [])

    //Jquery useEffect
    useEffect(() => {


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

