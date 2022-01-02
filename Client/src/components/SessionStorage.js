function setUserAuthenticationStatus(status)
{
    sessionStorage.setItem("isUserAuthenticated",status)
}
function getUserAuthenticationStatus()
{
    const isUserAuthenticated= sessionStorage.getItem("isUserAuthenticated")
    return isUserAuthenticated
}

module.exports = {setUserAuthenticationStatus,getUserAuthenticationStatus}