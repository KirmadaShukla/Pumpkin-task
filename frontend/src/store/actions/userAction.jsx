import { getRequest, postRequest } from "../../config/Request"
import { showErrorToast, showSuccessToast } from "../../utils/toast"
import { removeUser, saveAllUsers, saveToken, saveUser, setLoading } from "../reducers/userSlice"


export const asyncgetcurrentuser=(navigate)=>async(dispatch)=>{
    try {
        const response=await getRequest("/api/v1/auth/me")
        if(response.status===200){
            dispatch(saveUser(response.data.user))
            showSuccessToast("Login Successfully")
            navigate("/chat")
        }
    } catch (error) {
        showErrorToast(error.response.data.message)
    }
}
export const asynclogin=(data,navigate)=>async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response=await postRequest("/api/v1/auth/login",data)
        if(response.status===200){
            dispatch(saveToken(response.data.token))
            dispatch(asyncgetcurrentuser(navigate))
        }
    } catch (error) {
        showErrorToast("Invalid email or password")
    } finally {
        dispatch(setLoading(false));
    }
}



export const asyncsignup=(data)=>async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response=await postRequest("/api/v1/auth/signup",data)
        if(response.status===201){
            showSuccessToast("Signup Successfully")
        }
    } catch (error) {
        showErrorToast(error.response.data.message)
    } finally {
        dispatch(setLoading(false));
    }
}

export const asynclogout = () => (dispatch) => {
    dispatch(removeUser());
    showSuccessToast("Logged out successfully");
}

export const asyncgetusers=()=>async(dispatch)=>{
    try {
        const response=await getRequest("/api/v1/chat/users")
        await dispatch(saveAllUsers(response.data))
    } catch (error) {
        showErrorToast(error.response.data.message)
    }
}