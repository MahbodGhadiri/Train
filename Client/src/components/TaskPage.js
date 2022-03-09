import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from 'react-redux';
import { selectAdminTasks, fetchAdminTasks } from '../features/task/adminTasksSlice';
import Header from './Header';
import Page404 from "./404";

function TaskPage(){
    const dispatch=useDispatch()
    const tasks= useSelector(selectAdminTasks)
    const taskStatus = useSelector(state => state.adminTasks.status)

    let {id} = useParams();

    useEffect(()=>{
        if(taskStatus==="idle"){
            dispatch(fetchAdminTasks())
        }
    },[taskStatus, dispatch])

    if(taskStatus==="succeed"){
        const task=tasks.find(task=>task._id===id);
        if(task){
            return(
                <Header/>
            )
        }
        else{
            return(
                <div>
                    <Page404/>
                </div>
            )
        }
    }
    else{
        //return template page
        return(
            <div>

            </div>
        )
    }
    
}

export default TaskPage;