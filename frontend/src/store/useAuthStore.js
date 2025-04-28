import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    checkAuth:
        async () => {
            try {
                const res = await axiosInstance.get("/auth/check");
                set({ authUser: res.data })
                get().connectSocket()
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
    socket:null,
    signup: async (data) => {
        set({ isSignUp: true})

        try{
            const res = await axiosInstance.post("auth/signup", data)
            set({ authUser: res.data})
            get().connectSocket()
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
            get().connectSocket()
        }catch(error){
            console.log(error);
            
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn: false})
        }

    },
    logout: async() =>{
        try {
            await axiosInstance.post("auth/logout")
            set({ authUser: null})
            get().disconnectSocket()
            toast.success("Sesión cerrada exitosamente")
        } catch (error) {
            console.log(error);
            
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
    onlineUsers: [],
    connectSocket: () => {
        const {authUser} = get()
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query:{
                userId: authUser._id
            }
        })
        
        socket.connect()

        
        set({socket:socket})
        socket.on("getOnlineUsers", (usersIds) => {
            console.log(usersIds);
    
            set({onlineUsers: usersIds})
        })
    },
    disconnectSocket: () =>{
        if (get().socket?.connected) get().socket.disconnect();
    }
}))