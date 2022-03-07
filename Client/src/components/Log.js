import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLog, setLogs } from '../features/log/logSlice';
import { useDispatch } from 'react-redux';
import { showError } from './Toast_Functions';
import { useHistory } from 'react-router';
function Log() {
  let logs = [];
  const logList = useSelector(selectLog);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(async () => {
    await axios.get(`/admin/log`,
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(response => {

      logs = response.data.log;
      dispatch(setLogs({
        log: logs
      }));
    }).catch(error => {
      showError(error);
    })
  }, []);

  return <div style={{ marginTop: "10px" }}>
    <div onClick={e => history.push("/home")}
      style={{ marginRight: "auto", marginLeft: "auto", borderRadius: "200px", textAlign: "center", cursor: "pointer", color: "black", backgroundColor: "white", padding: "5px 10px", width: "120px", height: "45px" }}>
      <h4 style={{ textAlign: "center", cursor: "pointer", color: "black", padding: "5px 10px" }}><span> &#8592; </span> بازگشت </h4>

    </div>

    {logList && logList.map(log => (<div>
      <div style={{ backgroundColor: "white", padding: "5px 5px", textAlign: "center", width: "70%", marginLeft: "auto", marginRight: "auto", border: "3px solid #c1c1c1", borderRadius: "30px", marginTop: "10px", marginBottom: "10px" }}>{log.message} <hr />({log.timestamp})</div>

    </div>))}
  </div>;
}

export default Log;
