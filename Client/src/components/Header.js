import React from "react";
import { Link } from "react-router-dom";
import { getUserAuthorization } from "./SessionStorage";
import { useHistory } from "react-router";
const Header = () => {
    const role = getUserAuthorization();
    const history = useHistory();
    console.log(history.location.pathname)
    return (
        <div >
            <a href="./profile.html" className="usericn">
                <Link to={`/home/profile`}>
                    <img src="/images/usericn.png" alt="user" />
                </Link>
                {history.location.pathname !== "/home/user" ?

                    role === "super admin" || role === "admin" ?
                        <Link to={`home/user`}>
                            <h3 style={{ marginLeft: "-25px", marginRight: "-20px", marginBottom: "5px", color: "green", backgroundColor: "white", padding: "5px 15px", borderRadius: "30px" }}>شخصی</h3>
                        </Link> :
                        <></>
                    :
                    role === "super admin" || role === "admin" ?
                        <Link to={`home`}>
                            <h3 style={{ marginLeft: "-25px", marginRight: "-20px", marginBottom: "5px", color: "green", backgroundColor: "white", padding: "5px 15px", borderRadius: "30px" }}>ادمین</h3>
                        </Link> :
                        <></>
                }


                {role === "super admin" ?
                    <Link to={`/log`} >
                        <h3 style={{ marginLeft: "-50px", marginRight: "12px", color: "rgb(255, 36, 66)", backgroundColor: "white", padding: "5px 10px", borderRadius: "30px" }}>لاگ</h3>
                    </Link> :
                    <></>}

            </a>

            <div className="logo">
                <img src="/images/t-logo.png" alt="Train" />
            </div>
        </div>
    );
}

export default Header;