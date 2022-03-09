import { emptySessionStrage } from "./SessionStorage";
export function checklogin(error)
{
    if (error?.response.status===401)
    {
        emptySessionStrage();
        window.location.reload();
    }
}