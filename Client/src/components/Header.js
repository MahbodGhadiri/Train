import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div>
            <a href="./profile.html" className="usericn">
                <Link to={`/home/profile`}>
                    <img src="./images/usericn.png" alt="user" />
                </Link>
            </a>

            <div className="logo">
                <img src="./images/t-logo.png" alt="Train" />
            </div>
        </div>
    );
}

export default Header;