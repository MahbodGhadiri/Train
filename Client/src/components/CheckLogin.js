
export function checklogin(error)
{
    if (error?.response.status===401)
    {
        window.sessionStorage.removeItem("isUserAuthenticated");
        window.sessionStorage.removeItem("role");
        window.sessionStorage.removeItem("id")
        window.location.reload();
    }
}