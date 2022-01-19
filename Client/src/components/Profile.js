import React,{useEffect} from 'react';
import { getUserAuthorization } from "./SessionStorage"
import AdminProfile from "./AdminComponents/AdminProfile"
import UserProfile from "./UserComponents/UserProfile"
import $ from 'jquery';

function Profile() {

    useEffect(async () => {

        $('.skillsbox .fa-arrow-down').click(function(e) {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                $('.skillsbox ul').slideDown();
                $(this).css('transform', 'rotate(180deg)');
            } else {
                $('.skillsbox ul').slideUp();
                $(this).css('transform', 'rotate(0deg)');
            }
        });

        $('.show-box .show-item i.fa-eye').click(function() {
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

    
        // Height Window
        var hw = ($(window).height()) - 130;
        $('.alonebox,.groupbox').css('height', hw + 'px');

    });

    const role = getUserAuthorization()
    if (role === "user") {
        return (
            <UserProfile />
        )
    }
    else if (role === "admin" | role === "super admin") {
        return (
            <AdminProfile />
        )
    }
}

export default Profile;