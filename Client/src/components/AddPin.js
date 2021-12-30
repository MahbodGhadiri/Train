import React ,{useState}from 'react';
import axios from 'axios';

function AddPin() {

    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");

    const addPin = async (event) => {
        event.preventDefault();

        console.log("inside AddPin");

        const Pin = {
            title: title,
            message: message
        };

        await axios.post("http://localhost:8080/api/admin/pin",
            Pin,
            { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            .then(responce => {
                console.log(responce);
            })
            .catch(error => {
                console.log(error);
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

                    <input type="text" name="titr" placeholder="موضوع" required value={title} onChange={e =>
                        setTitle(e.target.value)
                    } />

                    <input type="submit" value="ثبت" />
                </form>
            </div>
        </div>
    )
}

export default AddPin;
