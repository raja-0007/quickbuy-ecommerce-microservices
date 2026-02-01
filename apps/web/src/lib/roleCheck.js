
const pagePermissions = {
    '/testPage' : ['admin']
}

export const hasPagePermission = async(url, token)=>{
    // const token =  useSession()
    console.log('token in roleCheck', token)
    const role = token?.role
    const allowedRoles = pagePermissions[url]
    if(!allowedRoles){
        return true
    }else if(allowedRoles.includes(role)){
        return true
    }else{
        return false
    }
}