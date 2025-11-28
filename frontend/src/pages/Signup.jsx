import React, { useContext, useState } from 'react'
import vvybe from "../assets/vvybe.png"
import {useNavigate} from "react-router-dom"
import { authDataContext } from '../context/AuthContext'
import axios from "axios"
import { userDataContext } from '../context/userContext'
function Signup() {
  let [show,setShow]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,setUserData}=useContext(userDataContext)
  let navigate=useNavigate()
  let [firstName,setFirstName]=useState("")
  let [lastName,setLastName]=useState("")
  let [userName,setUserName]=useState("")
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [loading,setLoading]=useState(false)
  let [err,setErr]=useState("")

  const handleSignUp=async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl+"/api/auth/signup",{
firstName,
lastName,
userName,
email,
password
      },{withCredentials:true})
      console.log(result)
      setUserData(result.data)
      navigate("/")
      setErr("")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setEmail("")
      setPassword("")
      setUserName("")
    } catch (error) {
      setErr(error.response.data.message)
      setLoading(false)
    }
  }
  return  (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#01000b]">

      {/* Floating gradient circles */}
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

      {/* Glass Signup Form */}
      <form
        className="relative w-[90%] max-w-[400px] h-[650px] bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-lg p-[35px] flex flex-col justify-center z-50"
        onSubmit={handleSignUp}
      >
        <h1 className="text-white text-3xl font-semibold text-center mb-8">
          Sign Up
        </h1>

        <input
          type="text"
          placeholder="First Name"
          required
          className="w-full h-[50px] bg-white/20 text-white px-4 rounded mb-3 outline-none hover:bg-slate-900 transition"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          required
          className="w-full h-[50px] bg-white/20 text-white px-4 rounded mb-3 outline-none hover:bg-slate-900 transition"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username"
          required
          className="w-full h-[50px] bg-white/20 text-white px-4 rounded mb-3 outline-none hover:bg-slate-900 transition"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full h-[50px] bg-white/20 text-white px-4 rounded mb-3 outline-none hover:bg-slate-900 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input with show/hide */}
        <div className="relative w-full h-[50px] mb-2">
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

        {err && <p className="text-center text-red-400 mb-2">*{err}</p>}

        <button
          className="w-full h-[50px] rounded-full bg-indigo-500 hover:bg-indigo-900 text-white font-bold mt-4 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p
          className="text-center text-white mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account?{" "}
          <span className="text-blue-300">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default Signup
