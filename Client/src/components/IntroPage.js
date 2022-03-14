import React from 'react'
import { useHistory } from 'react-router';
function IntroPage() {
    const history = useHistory();
    return (
        <div>
            <body dir="rtl" style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
                <div className="pro-content">
                    <div className="signup" style={{ marginBottom: "5px", marginTop: "-55px" }}>
                        <div className="edit-box">


                            <form  >
                                <div className="logo sl-logo">
                                    <img style={{width:"150px"}} src="./images/HeadLogo.png" alt="Train" title="Train" />
                                </div>

                                <h2 style={{ cursor: "pointer", textAlign: "center", marginTop: "0px", marginBottom: "0" }}>
                                    خوش اومدی!
                                </h2>
                                <h4 style={{ cursor: "pointer", textAlign: "center", marginTop: "0px", marginBottom: "0" }}>
                                    برای ورود به بخش مورد نظر روی دکمه آن  بزنید
                                </h4>



                                <input type="submit" value="ورود به Train" onClick={e => history.push("/home")} style={{ color: "white", backgroundColor: "rgb(255, 184, 48)", marginBottom: "-15px", width: "60%" }} id="edit-btn" />
                                <input type="submit" value="ورود به Bokko" onClick={e => history.push("/bokko")} style={{ color: "white", backgroundColor: "#00af91", marginBottom: "0px", width: "60%" }} id="edit-btn" />









                            </form>
                        </div>
                    </div>
                </div>
            </body>
        </div>


    )
}
export default IntroPage;