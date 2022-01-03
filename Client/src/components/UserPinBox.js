import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { connectAdvanced, useDispatch, useSelector } from 'react-redux';
import { setPins, selectPin } from '../features/pin/pinSlice';
import { store } from '../app/store';
import { toast } from 'react-toastify';

const toastOptions =
{
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    autoClose: 5000,
    hideProgressBar: true
}

function indexGiveOut(wantedIndex, pinArray) {
    let Arr = [0, 1, 2, 3, 4];
    let filtered = Arr.filter((x) => x !== wantedIndex);
    // console.log(filtered);
    wantedIndex = filtered[Math.floor(Math.random() * 3)];
    return wantedIndex;
}

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
    let [pinArrIndex, setPinArrIndex] = useState(Math.floor(Math.random() * 4));
    let titleColor = "";

    useEffect(async () => {

        await axios.get("/user/pins",
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
        ).then(responce => {
            console.log(responce.data);
            pins = responce.data;
        }).catch(error => {
            console.log(error);
            const showError = () => toast.error(error.data.message, toastOptions);
            showError();
        });

        dispatch(setPins({
            pin: pins
        }));



    }, [store.getState().pin.reload]);


    
    function ReloadPin(event) {
        event.preventDefault();

        let Index = indexGiveOut(pinArrIndex, pinList);
        console.log(Index);
        titleColor = changeTitle(Index, pinList);
        console.log(titleColor);

    }
    console.log(pinArrIndex);
    titleColor = changeTitle(pinArrIndex, pinList);
    console.log(titleColor);
    return (
        <div>

            <div className="alert-b" style={{ background: `${titleColor}`, }}>
                <i className="fa fa-circle"
                    style={{ color: "#ffb830", right: "-40px" }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPin(event)}></i>

                <i className="fa fa-circle"
                    style={{ color: "#ff2442", right: "-20px" }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPin(event)}></i>

                <i className="fa fa-times"
                    style={{
                        background: "#fff", color: "red", cursor: "pointer"
                    }} ariaHidden="true" ></i>

                <p >{pinList[pinArrIndex]?.message}</p>


                <i className="fa fa-circle"
                    style={{
                        color: '#3db2ff', left: '-20px'
                    }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPin(event)}></i>

                <i className="fa fa-circle"
                    style={{ color: '#00af91', left: '-40px' }}
                    ariaHidden="true"
                    onClick={(event) => ReloadPin(event)}></i>
            </div>
        </div>
    )
}

export default UserPinBox;
