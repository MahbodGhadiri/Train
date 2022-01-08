import React from 'react'
import Header from "./Header";
import UserPinBox from "./UserPinBox";

function User() {
    return (
        <div dir="rtl">
            <div className="content">

                <Header />


                <div className="right alonebox">
                    <h2>فعالیت های فردی</h2>

                    <div className="alonerow">
                        <div className="task">
                            <i className="fa fa-circle circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                            <h3>طراحی پوستر صفحه اصلی بخش پ...</h3>
                            <i className="fa fa-times" style={{ background: "#ff2442" }} aria-hidden="true"></i>
                            <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} aria-hidden="true"></i>
                            <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true"></i>
                            <div className="task-down">
                                <p>
                                    طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش
                                </p>
                                <span style={{color: "#868686"}}>توسط <span style={{ color: "#ffb830" }}>امیرعلی</span></span>
                                <div className="date">
                                    <span>
                                        شنبه 13/13/13 تا چهارشنبه 12/45/07
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="time">
                            9روز
                        </div>
                    </div>



                </div>


                <div className="right shapebox">
                    <div className="imgsbox">
                        <img src="./images/t-logo.png" alt="Train" />
                        <img src="./images/shape-1-min.png" alt="" />
                    </div>
                    <h2>احمد رضا وکیلی</h2>
                    <div className="img-sortby">
                        <span style={{ color: "#ff2442" }} >کدفرانت</span>
                        <span style={{ color: "#00af91" }}>فایننشال</span>
                    </div>
                </div>


                <div className="right groupbox">
                    <h2>فعالیت های گروهی</h2>

                    <div className="alonerow">
                        <div className="task">
                            <i className="fa fa-circle circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                            <h3>طراحی پوستر صفحه اصلی بخش پ...</h3>
                            <i className="fa fa-times" style={{ background: "#ff2442" }} aria-hidden="true"></i>
                            <i className="fa fa-arrow-down" style={{ background: "#ffb830" }} aria-hidden="true"></i>
                            <i className="fa fa-circle circle-topbtn" style={{ color: "#5c527f" }} aria-hidden="true"></i>
                            <div className="task-down">
                                <p>
                                    طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش طراحی پوستر صفحه اصلی بخش
                                </p>
                                <span style={{ color: "#868686" }}>توسط <span style={{ color: "#ffb830" }}>امیرعلی</span></span>
                                <div className="date">
                                    <span>
                                        شنبه 13/13/13 تا چهارشنبه 12/45/07
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="time">
                            9روز
                        </div>
                    </div>


                </div>
                <div style={{ clear: "both" }}></div>


                <UserPinBox />
                <div className="post-btn">
                    <span>جدید</span>
                </div>

                <div className="post">
                    <i className="fa fa-times" aria-hidden="true"></i>
                    <h2>پست جدید</h2>
                    <form action="#new-post.php" method="post">
                        <i className="fa fa-circle" style={{ color: "#707070" }} aria-hidden="true"></i>
                        <input type="text" name="tpost" placeholder="موضوع خود را بنویسید" required />
                        <textarea name="cpost" id="" cols="30" rows="10" placeholder="توضیحات" required></textarea>
                        <input type="text" name="retpost" placeholder="موضوع" required />
                        <input type="text" name="time" placeholder="زمان" required />
                        <input type="submit" value="ثبت" />
                    </form>
                </div>

            </div>
        </div >
    )
}

export default User;
