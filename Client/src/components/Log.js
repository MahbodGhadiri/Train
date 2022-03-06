import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLog, setLogs } from '../features/log/logSlice';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from './Toast_Functions';
import {checkLogin} from './CheckLogin';

function Log() {
  let logs = [];
  const logList = useSelector(selectLog);
  const dispatch = useDispatch();

  useEffect(async () => {
    await axios.get(`/log`,
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(response => {

      logs = response.data.log;
      dispatch(setLogs({
        log: logs
      }));
    }).catch(error => {
      showError(error);
      checkLogin()
    })
  }, []);
  
  const deleteLog=async(logId)=>{
    await axios.delete(`/log?log=${logId}`,
    {headers:{'content-Type': 'application/json'}, withCredentials: true})
      .then(response =>{
        showSuccess(response);
      })
      .catch(error=>{
        showError(error);
        checkLogin(error);
      })
  }
  return(
    <div style={{}}>
      {logList && logList.map(log => (
      <div>
        <div 
          style={{backgroundColor:"white",padding:"5px 5px",textAlign:"center" , width:"70%" ,marginLeft:"auto", marginRight:"auto",border: "3px solid #c1c1c1" , borderRadius:"30px" , marginTop:"10px", marginBottom:"10px"}}>
          {log.message} 
          <i 
            className="fa fa-times" 
            style={{ background: '#ff2442' }} 
            ariaHidden="true" 
            onClick={() => {
              deleteLog(log._id);
            }}>
          </i>
          <hr/>
          ({log.timestamp})
        </div>
      </div>))}
    </div>
  )
}

export default Log;
