import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectLog, setLogs } from '../features/log/logSlice';
import { useDispatch } from 'react-redux';
import { showError } from './Toast_Functions';
function Log() {
  let logs = [];
  const logList = useSelector(selectLog)
  const dispatch= useDispatch();

  useEffect(async () => {
    await axios.get(`/admin/log`,
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    ).then(response => {
      console.log(response);
      logs = response.data;
      dispatch(setLogs({
        log: logs
      }));
    }).catch(error => {
      showError(error);
    })
  }, []);
  console.log(logList
    );
  return <div>{logList && logList.map(log => (<div>codsnodnvods</div>))}</div>;
}

export default Log;
