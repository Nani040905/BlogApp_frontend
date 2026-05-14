import { create } from 'zustand'
import api from '../api/axios'

export const useAuth = create((set)=>({
    currentUser:null,
    loading:false,
    isAuthenticated :false,
    error:null,
    verifyAuth: async () =>{
          try {
            //set loading true and error null
            set({loading:true,error:null})
            //make api call
            let res = await api.get(`/common-api/check-auth`)
            res=res.data
            // console.log(res)
            set({
                loading:false,
                isAuthenticated:true,
                currentUser:res.payload,
                error:null
            });

          } catch (err) {
            console.log(err)
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.error
            })
      }
    },
    login : async (userCredWithRole) => {
        const {role, ...userCredObj} = userCredWithRole;
        try {
            //set loading true and error null
            set({loading:true,error:null})
            //make api call
            let res = await api.post(`/common-api/login`,userCredObj)
            res=res.data
            // console.log(res)
            //update state
            set({
                loading:false,
                isAuthenticated:true,
                currentUser:res.payload,
                error:null
            });

        } catch (err) {
            console.log(err)
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.error || "Login failed"
            })
        }
    },
    logout :async ()=>{
      try {
        set({loading:true,error:null})
        let res =await api.get(`/common-api/logout`)
        res=res.data
        // console.log(res)
        set({
            loading:false,
            isAuthenticated:false,
            currentUser:null
        });
      } 
			catch (err) {
				// console.log(err)
            set({
              loading:false,
              isAuthenticated:false,
              currentUser:null,
              error:err.response?.data?.error || "Logout failed"
            });
      }
    },
}));



// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import axios from 'axios'

// export const useAuth = create(
//   persist(
//     (set) => ({
//       currentUser: null,
//       loading: false,
//       error: null,
//       isAuthenticated: false,

//       login: async (userCredWithRole) => {
//         const { role, ...userCredObj } = userCredWithRole
//         try {
//           set({ loading: true, error: null })

//           let res = await axios.post(
//             `${import.meta.env.VITE_API_BASE_URL}/common-api/login`,
//             userCredObj,
//             { withCredentials: true }
//           )

//           set({
//             loading: false,
//             isAuthenticated: true,
//             currentUser: res.data.payload
//           })
//         } catch (err) {
//           set({
//             loading: false,
//             isAuthenticated: false,
//             currentUser: null,
//             error: err.response?.data?.error || "Login failed",
//           })
//         }
//       },

//       logout: async () => {
//         try {
//           set({ loading: true, error: null })

//           await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/common-api/logout`,
//             { withCredentials: true }
//           )

//           set({
//             loading: false,
//             isAuthenticated: false,
//             currentUser: null
//           })
//         } catch (err) {
//           set({
//             loading: false,
//             isAuthenticated: false,
//             currentUser: null,
//             error: err.response?.data?.error || "Logout failed",
//           })
//         }
//       }
//     }),
//     {
//       name: "auth-storage", // 🔥 key in localStorage
//     }
//   )
// )