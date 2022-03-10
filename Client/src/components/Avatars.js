import React, { useEffect } from 'react'
import { showError, showSuccess } from './Toast_Functions';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { checklogin } from './CheckLogin';
import { useHistory } from "react-router-dom";
import { fetchProfile, setProfileStatus } from '../features/user/ProfileSlice';

function Avatars() {
  const avatarsList = ["boy1", "boy2", "boy3", "boy4", "boy5", "girl1", "girl2"];
  const dispatch = useDispatch();
  const profileStatus=useSelector(state=>state.profile.status);
  const history = useHistory();

  useEffect(()=>{
    if(profileStatus==="idle"){
      dispatch(fetchProfile());
    }
  },[profileStatus,dispatch])

    async function chooseAvatar(e, fileName) {
    e.preventDefault();
  
    await axios.put("/user/change-info",{avatarURL : fileName,})
      .then(response => {
        showSuccess(response);
        dispatch(setProfileStatus({status:"idle"}));
      })
      .catch(error => {
        showError(error);
        checklogin(error);
      });
      history.push("/home");
  }
  return (
    <div dir="rtl">
      <div className='content' style={{ marginTop: "0px" }} >
        <Header />

        <div className="imgsbox">
          <div className="borderc">

            <img src="/images/header_logo.png" alt="Train" style={{ width: "200px" }} />

          </div></div>




        <h1 style={{ textAlign: "center" }}>آواتار خود را انتخاب کنید</h1>
        <input type="submit" value="روی آواتار مورد علاقت بزن تا برات آزاد بشه" style={{ color: "black", backgroundColor: "white", marginBottom: "20px", marginTop: "10px" }} id="edit-btn" />
        <div className='avatarsbox'>
          {
            avatarsList.map((avatar) => {
              <div className='avatarbox' style={{ backgroundImage: `url(../avatars/${avatar}.png)` }}></div>
            })
          }
          <div onClick={e => chooseAvatar(e, "boy1")} className='avatarbox' style={{ backgroundImage: "url(../avatars/boy1.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "boy2")} className='avatarbox' style={{ backgroundImage: "url(../avatars/boy2.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "boy3")} className='avatarbox' style={{ backgroundImage: "url(../avatars/boy3.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "boy4")} className='avatarbox' style={{ backgroundImage: "url(../avatars/boy4.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "boy5")} className='avatarbox' style={{ backgroundImage: "url(../avatars/boy5.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "girl1")} className='avatarbox' style={{ backgroundImage: "url(../avatars/girl1.png)" }}></div>
          <div onClick={e => chooseAvatar(e, "girl2")} className='avatarbox' style={{ backgroundImage: "url(../avatars/girl2.png)" }}></div>
        </div>


      </div>
    </div>
  )
}

export default Avatars