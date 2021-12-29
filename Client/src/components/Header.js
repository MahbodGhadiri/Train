import React, { useState, useRef } from "react";


const Header = () => {
    return (
        <div>
            <a href="./profile.html" className="usericn">
                <img src="./images/usericn.png" alt="user" />
            </a>

            <div className="logo">
                <img src="./images/t-logo.png" alt="Train" />
            </div>
        </div>
    );
}

export default Header;