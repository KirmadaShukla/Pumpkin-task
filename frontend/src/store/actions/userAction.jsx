import { postRequest } from "../../config/Request"
import { showErrorToast, showSuccessToast } from "../../utils/toast"
import { removeUser, saveUser, setLoading } from "../reducers/userSlice"

export const asynclogin=(data)=>async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response=await postRequest("/api/v1/auth/login",data)
        if(response.status===200){
            await dispatch(saveUser(response.data))
            showSuccessToast("Login Successfully")
        }
    } catch (error) {
        showErrorToast(error.response.data.message)
    } finally {
        dispatch(setLoading(false));
    }
}

export const asyncsignup=(data)=>async(dispatch)=>{
    try {
        dispatch(setLoading(true));
        const response=await postRequest("/api/v1/auth/register",data)
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