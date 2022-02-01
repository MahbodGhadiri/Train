import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPins, selectPin } from '../../features/pin/pinSlice';
import { store } from '../../app/store';
import { showError } from '../Toast_Functions';


function changeTitle(wantedIndex, pinArray) {

    let subjectTag;
    switch (pinArray[wantedIndex]?.title) {
        case "برنامه نویسی":
            // console.log("برنامه نویسی");
            subjectTag = "#ffb830";
            break;

        case "گرافیک":
            subjectTag = "#00af91";
            // console.log("گرافیک");
            break;

        case "مدیریت ":
            // console.log("مدیریت");
            subjectTag = "#ff2442";
            break;

        case "دیگر ":
            // console.log("دیگر");
            subjectTag = "#ff2442";
            break;
        default:

            break;
    }

    return subjectTag;
}

function UserPinBox() {
    const dispatch = useDispatch();
    let pins = [];
    let pinList = useSelector(selectPin);
    let [pinArrIndex, setPinArrIndex] = useState(2);
    let titleColor = "";

    useEffect(async () => {

        await axios.get("/user/pins",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(response => {
            console.log(response.data);
            pins = response.data;
        }).catch(error => {
            showError(error);
        });

        dispatch(setPins({
            pin: pins
        }));

    }, [store.getState().pin.reload]);

    titleColor = changeTitle(pinArrIndex, pinList);

    function ReloadPinFront(event, index) {
        event.preventDefault();
        index--;
        if (index === -1) {
            index = 4;
            titleColor = changeTitle(index, pinList);
        }
        setPinArrIndex(index);

    }
    function ReloadPinBack(event, index) {
        event.preventDefault();
        index++;
        if (index === 5) {
            index = 0;
            titleColor = changeTitle(index, pinList);
        }
        setPinArrIndex(index);

    }

    return (
        <div>

            <div className="alert-b" style={{ background: `${titleColor}`, }}>


                <i className="fa fa-circle"
                    style={{ color: "#ff2442", right: "-20px", cursor: 'pointer' }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPinBack(event, pinArrIndex)}></i>

                <i className="fa fa-times"
                    style={{
                        background: "#fff", color: "red", cursor: "pointer"
                    }} ariaHidden="true" ></i>

                <p >{pinList[pinArrIndex]?.message}</p>


                <i className="fa fa-circle"
                    style={{
                        color: '#3db2ff', left: '-20px', cursor: 'pointer'
                    }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPinFront(event, pinArrIndex)}></i>


            </div>
        </div>
    )
}

export default UserPinBox;
