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

export function setUserAuthorization(role)
{
    sessionStorage.setItem("role",role)
}

export function getUserAuthorization()
{
    const role= sessionStorage.getItem("role")
    if(role===undefined)
    {
        return ""
    }
    return role
}

export function setUserId(userId)
{
    sessionStorage.setItem("id",userId)
}

export function getUserId()
{
    const role= sessionStorage.getItem("id")
    if(role===undefined)
    {
        return ""
    }
    return role
}