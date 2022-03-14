import React from "react";
import {useLocation} from "react-router-dom";
import AdminTaskPage from './AdminComponents/AdminTaskPage'
import UserTaskPage from './UserComponents/UserTaskPage'

// React Router does not have any opinions about
// how you should parse URL query strings.
// you can use the browser's built-in URLSearchParams API.


// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function TaskPage() {
    const query = useQuery();
    const role=query.get("role");
    if(role==="admin"){
        return (
            <div>
                <AdminTaskPage/>
            </div>
        );
    }
    else{
        return (
            <div>
                <UserTaskPage/>
            </div>
        );
    }
}

export default TaskPage;