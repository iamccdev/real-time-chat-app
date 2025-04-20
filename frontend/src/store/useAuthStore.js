import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    checkAuth:
        async () => {
            try {
                const res = await axiosInstance.get("/auth/check");
                set({ authUser: res.data })
            } catch (error) {
                console.log("Error in checkUser:", error?.data?.message);
                set({authUser: null})

            }finally{
                set({isCheckingAuth: false})
            }
        },
    isLoggingIn: false,
    isUpdatingProfile: false,
    isSignUp: false,
    isSigningUp: false,
    signup: async (data) => {
        set({ isSignUp: true})

        try{
            const res = await axiosInstance.post("auth/signup", data)
            set({ authUser: res.data})
            toast.success("Cuenta creada exitosamente")
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false})
        }

    },
    login:async (data) => {
        set({ isLoggingIn: true})

        try{
            const res = await axiosInstance.post("auth/login", data)
            set({ authUser: res.data})
            toast.success("Sesión iniciada exitosamente")
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false})
        }

    },
    logout: async() =>{
        try {
            await axiosInstance.post("auth/logout")
            set({ authUser: null})
            toast.success("Sesión cerrada exitosamente")
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data})
            toast.success("Perfil actualizado exitosamente")
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message )
        }finally{
            set({ isUpdatingProfile: false})
        }
    },
}))