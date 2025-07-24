import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import LoginPage from "../Pages/LoginPage";


export const useAuthStore = create((set,get)=>({

    authUser:null,
    isSignningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth: async() =>{
        try {
            const res = await axiosInstance.get("/auth/checkAuth")
            set({authUser:res.data})
            // get().connectSocket();
        } catch (error) {
            console.log("error in checkAuth : ", error);
            
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
            
        }
    },
    signup: async(data) =>{
        set({isSignningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created SuccesfuLLy")
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while Signing up");
        }finally{
            set({isSignningUp:false});
        }
    },
    login:async(data) =>{
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            // get().connectSocket();
            toast.success("LoggedIn SuccesfuLLy")
        } catch (error) {
            toast.error("Email or Pssword is wrong");
            
        }finally{
            set({isLoggingIn:true});
        }
    },
    logout:async()=>{
        try {
            const res = await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            
        } catch (error) {
            toast.error(error);
        }
    },
    updateProfile: async (data) => {
        
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

}))