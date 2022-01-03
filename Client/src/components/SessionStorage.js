export function setUserAuthenticationStatus(status)
{
    sessionStorage.setItem("isUserAuthenticated",status)
}
export function getUserAuthenticationStatus()
{
    const isUserAuthenticated= sessionStorage.getItem("isUserAuthenticated")
    if(isUserAuthenticated===undefined)
    {
        return "false"
    }
    return isUserAuthenticated
}
