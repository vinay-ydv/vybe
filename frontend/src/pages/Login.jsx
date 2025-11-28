import React, { useContext, useState } from 'react'
import vvybe from "../assets/vvybe.png"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/userContext'
function Login() {
  let [show,setShow]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,setUserData}=useContext(userDataContext)
  let navigate=useNavigate()
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSignIn=async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/login",{
email,
password
      },{withCredentials:true})
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setEmail("")
      setPassword("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }
  return (
     <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#02000f]">
      
      {/* Background floating circles (Glass effect) */}
      <div className="absolute w-[430px] h-[520px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#1845ad] to-[#23a2f6] left-[-80px] top-[-80px]" />
        <div className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-[#ff512f] to-[#f09819] right-[-30px] bottom-[-80px]" />
      </div>

      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img
                src={vvybe}
                alt=""
                
                className="w-[90px] lg:w-[120px] cursor-pointer items-center justify-center ml-12 mt-3 drop-shadow-[0_5px_2px_white]"
              />
      </div>

      {/* Glass Form */}
      <form
        className="relative w-[90%] max-w-[400px] h-[520px] bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-lg p-[35px] flex flex-col justify-center z-50"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-3xl font-semibold text-center mb-10">
          Sign In
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full h-[50px] bg-white/20 text-white px-4 rounded outline-none mb-4 hover:bg-slate-900 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password with show/hide */}
        <div className="relative w-full h-[50px]">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            required
            className="w-full h-full bg-white/20 text-white px-4 rounded outline-none hover:bg-slate-900 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-4 top-[12px] text-blue-300 font-semibold cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? "hide" : "show"}
          </span>
        </div>

        {/* Error */}
        {err && <p className="text-center text-red-400 mt-3">*{err}</p>}

        {/* Submit Button */}
        <button
          className="w-full h-[50px] rounded-full bg-indigo-500 hover:bg-indigo-900 text-white font-bold mt-[30px] transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        {/* Redirect */}
        <p
          className="text-center text-white mt-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Want to create a new account?{" "}
          <span className="text-blue-300">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Login
