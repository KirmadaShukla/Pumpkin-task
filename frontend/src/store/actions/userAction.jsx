import { getRequest, postRequest } from "../../config/Request"
import { removeUser, saveAllUsers, saveToken, saveUser, setLoading } from "../reducers/userSlice"
import toast from "react-hot-toast"


export const asyncgetcurrentuser = (navigate) => async (dispatch) => {
    try {
        const response = await getRequest("/api/v1/auth/me")
        if (response.status === 200) {
            dispatch(saveUser(response.data.user))
            toast.success("Login Successfully")
            navigate("/chat")
        }
    } catch (error) {
        toast.error(error.response.data.message)
    }
}
export const asynclogin = (data, navigate) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await postRequest("/api/v1/auth/login", data)
        if (response.status === 200) {
            dispatch(saveToken(response.data.token))
            dispatch(asyncgetcurrentuser(navigate))
        }
    } catch (error) {
        toast.error("Invalid email or password")
    } finally {
        dispatch(setLoading(false));
    }
}



export const asyncsignup = (data) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await postRequest("/api/v1/auth/signup", data)
        if (response.status === 201) {
            toast.success("Signup Successfully")
        }
    } catch (error) {
        toast.error(error.response.data.message)
    } finally {
        dispatch(setLoading(false));
    }
}

export const asynclogout = () => (dispatch) => {
    dispatch(removeUser());
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
}

export const asyncgetusers = () => async (dispatch) => {
    try {
        const response = await getRequest("/api/v1/chat/users")
        await dispatch(saveAllUsers(response.data))
    } catch (error) {
        toast.error(error.response.data.message)
    }
}