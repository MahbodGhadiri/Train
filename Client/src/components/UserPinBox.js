import React, { useEffect } from 'react'
import axios from 'axios';
import { connectAdvanced, useDispatch, useSelector } from 'react-redux';
import { setPins, selectPin } from '../features/pin/pinSlice';
import { store } from '../app/store';


function UserPinBox() {
    const dispatch = useDispatch();
    let pins = [];
    let pinList = useSelector(selectPin);
    let x = 2;
    let titleColor = "";
    
    useEffect(async () => {

        await axios.get("http://localhost:8080/api/user/pins",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(responce => {
            console.log(responce.data);
            pins = responce.data;
        }).catch(error => {
            console.log(error);
        });

        dispatch(setPins({
            pin: pins
        }));



    }, []);


    console.log(pinList[x]?.title);


    switch (pinList[x]?.title) {
        case "برنامه نویسی":
            console.log("برنامه نویسی");
            titleColor = "#ffb830";
            break;

        case "گرافیک": titleColor = "#00af91";
            break;

        default: titleColor = "#ff2442";
            break;
    }


    return (
        <div>
            <div className="alert-b" style={{ background: `${titleColor}` }}>
                <i className="fa fa-circle" style={{ color: "#ffb830", right: "-40px" }} ariaHidden="true" onClick={() => {
                    x = 0;
                    console.log("x:0");
                }}></i>

                <i className="fa fa-circle" style={{ color: "#ff2442", right: "-20px" }} ariaHidden="true" onClick={() => {
                    x = 1;
                    console.log("x:1");
                }}></i>

                <i className="fa fa-times" style={{
                    background: "#fff", color: "red", cursor: "pointer"
                }} ariaHidden="true" ></i>

                <p >{pinList[x]?.message}</p>

                <i className="fa fa-circle" style={{
                    color: '#3db2ff', left: '-20px'
                }} ariaHidden="true"></i>

                <i className="fa fa-circle" style={{ color: '#00af91', left: '-40px' }} ariaHidden="true" onClick={() => x = 3}></i>
            </div>
        </div>
    )
}

export default UserPinBox;
