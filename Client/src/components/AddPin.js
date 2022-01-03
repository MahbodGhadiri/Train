import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const toastOptions =
{
    position: "top-right",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    autoClose: 5000,
    hideProgressBar: true,
}

function AddPin() {

    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");

    const addPin = async (event) => {
        event.preventDefault();
        const Pin = {
            title: title,
            message: message
        };

        await axios.post("admin/pin",
            Pin,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(responce => {
                console.log(responce);
                const showSuccess = () => toast.success(responce.data.message, toastOptions);
                showSuccess();
            })
            .catch(error => {
                console.log(error);
                const showError = () => toast.error(error.response.data.message, toastOptions);
                showError();
            })
    }
    return (
        <div>
            <div className="borderc pinbox">
                <h2>پین جدید</h2>
                <form onSubmit={event => addPin(event)}>

                    <textarea name="cpin" cols="30" rows="10" placeholder="توضیحات" required value={message} onChange={e =>
                        setMessage(e.target.value)
                    }></textarea>

                    <img src="./images/formicn.png" alt="formicn" />

                    <input list="category" type="text" name="titr" placeholder="موضوع" required value={title} onChange={e =>
                        setTitle(e.target.value)
                    } />

                    <input type="submit" value="ثبت" />
                </form>
                <datalist id="category">
                    <option value="برنامه نویسی" />
                    <option value="گرافیک" />
                    <option value="مدیریت مالی" />
                    <option value="مدیریت" />
                </datalist>
            </div>
        </div>
    )
}

export default AddPin;
