
export function checklogin(error)
{
    if (error.status===401)
    {
        window.sessionStorage.removeItem("isUserAuthenticated");
        window.sessionStorage.removeItem("role");
        window.location.reload();
    }
}