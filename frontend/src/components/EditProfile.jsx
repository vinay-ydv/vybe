import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/userContext';
import dp from "../assets/dp.webp"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

function EditProfile() {
  let { edit, setEdit, userData, setUserData ,edit2,setEdit2} = useContext(userDataContext)
  let {serverUrl}=useContext(authDataContext)
  let [firstName,setFirstName]=useState(userData.firstName || "")
  let [lastName,setLastName]=useState(userData.lastName || "")
  let [userName,setUserName]=useState(userData.userName || "")
  let [headline,setHeadline]=useState(userData.headline || "")
  let [location,setLocation]=useState(userData.location || "")
  let [gender,setGender]=useState(userData.gender || "")
  let [skills,setSkills]=useState(userData.skills || [])
  let [newSkills,setNewSkills]=useState("")
  let [education,setEducation]=useState(userData.education || [])
  let [newEducation,setNewEducation]=useState({
    college:"",
    degree:"",
    fieldOfStudy:""
  })
  let [experience,setExperience]=useState(userData.experience || [])
  let [newExperience,setNewExperience]=useState( {
    title:"",
    company:"",
    description:""
  })

  let [frontendProfileImage,setFrontendProfileImage]=useState(userData.profileImage || dp)
  let [backendProfileImage,setBackendProfileImage]=useState(null)
  let [frontendCoverImage,setFrontendCoverImage]=useState(userData.coverImage || null)
  let [backendCoverImage,setBackendCoverImage]=useState(null)
  let [saving,setSaving]=useState(false)
  const profileImage=useRef()
  const coverImage=useRef()

  function addSkill(e){
    e.preventDefault()
    if(newSkills && !skills.includes(newSkills)){
      setSkills([...skills,newSkills])
    }
    setNewSkills("")
  }

  function removeSkill(skill){
    if(skills.includes(skill)){
      setSkills(skills.filter((s)=>s!==skill))
    }
  }
  function addEducation(e){
    e.preventDefault()
    if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy ){
      setEducation([...education,newEducation])
    }
    setNewEducation({
      college:"",
      degree:"",
      fieldOfStudy:""
    })
  }
  function addExperience(e){
    e.preventDefault()
    if(newExperience.title && newExperience.company && newExperience.description ){
      setExperience([...experience,newExperience])
    }
    setNewExperience({
      title:"",
      company:"",
      description:""
    })
  }
  function removeEducation(edu){
    if(education.includes(edu)){
      setEducation(education.filter((e)=>e!==edu))
    }
  }
  function removeExperience(exp){
    if(experience.includes(exp)){
      setExperience(experience.filter((e)=>e!==exp))
    }
  }

  function handleProfileImage(e){
    let file=e.target.files[0]
    setBackendProfileImage(file)
    setFrontendProfileImage(URL.createObjectURL(file))
  }
  function handleCoverImage(e){
    let file=e.target.files[0]
    setBackendCoverImage(file)
    setFrontendCoverImage(URL.createObjectURL(file))
  }

  const handleSaveProfile=async ()=>{
    setSaving(true)
    try {
      let formdata=new FormData()
      formdata.append("firstName",firstName)
      formdata.append("lastName",lastName)
      formdata.append("userName",userName)
      formdata.append("headline",headline)
      formdata.append("location",location)
      formdata.append("skills",JSON.stringify(skills))
      formdata.append("education",JSON.stringify(education))
      formdata.append("experience",JSON.stringify(experience))

      if(backendProfileImage){
        formdata.append("profileImage",backendProfileImage)
      }
      if(backendCoverImage){
        formdata.append("coverImage",backendCoverImage)
      }

      let result=await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true})
      setUserData(result.data)
      setSaving(false)
      setEdit(false)
    } catch (error) {
      console.log(error);
      setSaving(false)
    }
  }

  return (
    <div className='w-full h-[100vh] fixed top-3 lg:top-0  z-[100] flex justify-center items-center'>
      <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>

      <div className='w-full h-full bg-black/70 absolute top-0 left-0'></div>
      <div className='w-[90%] max-w-[500px] h-[600px] bg-[#0f172a] relative overflow-auto z-[200] shadow-2xl rounded-lg p-[10px] border border-[#1f2937] text-gray-100' >
        <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={() => setEdit(false)}><RxCross1 className='w-[25px] cursor-pointer h-[25px] text-gray-300 hover:text-white transition' /></div>

        <div className="w-full flex justify-center items-center mt-[40px]">
          <div className="relative w-[140px] h-[140px] flex justify-center items-center">
            <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-[#1d4ed8] shadow-lg shadow-blue-500/30">
              <img 
                src={frontendProfileImage} 
                alt="" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div 
              className="w-[34px] h-[34px] bg-[#17c1ff] rounded-full flex justify-center items-center absolute bottom-0 right-0 shadow-lg cursor-pointer border border-[#0ea5e9]"
              onClick={() => profileImage.current.click()}
            >
              <FiPlus className="text-white w-[18px] h-[18px]" />
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col items-center justify-center gap-[20px] mt-[50px]' >
          <input type="text" placeholder='FirstName' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg placeholder:text-gray-500' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
          <input type="text" placeholder='LastName' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg'value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
          <input type="text" placeholder='UserName' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
          <input type="text" placeholder='Bio' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
          <input type="text" placeholder='Location' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={location} onChange={(e)=>setLocation(e.target.value)}/>
          <input type="text" placeholder='Gender (male/female/other)' className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={gender} onChange={(e)=>setGender(e.target.value)}/>
          <div className="w-full p-[10px] border-2 border-[#374151] bg-[#020617] flex flex-col gap-[10px] rounded-lg">
            <h1 className='text-[19px] font-semibold text-gray-100'>Hobbies</h1>
            {skills && <div className='flex flex-col gap-[10px]'>
              { skills.map((skill,index)=>(
                <div key={index} className='w-full h-[40px] border border-[#4b5563] bg-[#111827] rounded-lg p-[10px] flex justify-between items-center text-gray-100'><span>{skill}</span><RxCross1 className='w-[20px] h-[20px] cursor-pointer text-gray-400 hover:text-red-400 transition' onClick={()=>removeSkill(skill)}/></div>
              ))}
            </div>}
            <div className='flex flex-col gap-[10px] items-start'>
              <input type="text" placeholder='Add new hobby' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)} className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder:text-gray-500'/>
              <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] hover:bg-[#2dc0ff]/10 transition' onClick={addSkill}>Add</button>
            </div>
          </div>
          <div className="w-full p-[10px] border-2 bg-[#020617] border-[#374151] flex flex-col gap-[10px] rounded-lg">
            <h1 className='text-[19px] font-semibold text-gray-100'>Education</h1>
            {education && <div className='flex flex-col gap-[10px]'>
              { education.map((edu,index)=>(
                <div key={index} className='w-full border border-[#4b5563] bg-[#111827] rounded-lg p-[10px] flex justify-between items-center text-gray-100'><div className='text-sm space-y-[2px]'>
                  <div>College: {edu.college}</div>
                  <div>Degree: {edu.degree}</div>
                  <div>Field Of Study: {edu.fieldOfStudy}</div>
                </div>
                <RxCross1 className='w-[20px] h-[20px] cursor-pointer text-gray-400 hover:text-red-400 transition' onClick={()=>removeEducation(edu)}/></div>
              ))}
            </div>}
            <div className='flex flex-col gap-[10px] items-start'>
              <input type="text" placeholder='college' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})} className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder:text-gray-500'/>
              <input type="text" placeholder='degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})} className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder:text-gray-500'/>
              <input type="text" placeholder='Field Of Study' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})} className='w-full h-[50px] outline-none border-[#374151] bg-[#020617] text-gray-100 px-[10px] py-[5px] text-[16px] border-2 rounded-lg placeholder:text-gray-500'/>
              <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] hover:bg-[#2dc0ff]/10 transition' onClick={addEducation}>Add</button>
            </div>
          </div>

          <button className='w-[100%] h-[50px] rounded-full bg-[#24b2ff] mt-[10px] text-white font-semibold hover:bg-[#0ea5e9] transition' disabled={saving} onClick={()=>handleSaveProfile()}>{saving?"saving...":"Save Profile"}</button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
 
