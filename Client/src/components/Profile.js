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