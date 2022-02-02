import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const role = window.sessionStorage.getItem("role");
    return (
        <div>
            <a href="./profile.html" className="usericn">
                <Link to={`/home/profile`}>
                    <img src="./images/usericn.png" alt="user" />
                </Link>
                {role === "super admin" ? <Link to={`/log`} >
                    <h3 style={{ marginLeft: "-50px", marginRight: "12px", color: "rgb(255, 36, 66)", backgroundColor: "white", padding: "5px 10px", borderRadius: "30px" }}>لاگ</h3>
                </Link> :
                    <></>}

            </a>

            <div className="logo">
                <img src="./images/t-logo.png" alt="Train" />
            </div>
        </div>
    );
}

export default Header;