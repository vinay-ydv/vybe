import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/userContext';
import { HiPencil } from "react-icons/hi2";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';

function Profile() {
  let { userData, setuserData, edit, setEdit, postData, setPostData, profileData, setProfileData } = useContext(userDataContext)
  let [profilePost, setProfilePost] = useState([])

  let { serverUrl } = useContext(authDataContext)

  useEffect(() => {
    setProfilePost(postData.filter((post) => post.author._id == profileData._id))
  }, [profileData])

  return (
    <div className='w-full min-h-[100vh] bg-[#0b1020] flex flex-col items-center pt-[100px] pb-[40px] text-gray-100'>
      <Nav />
      {edit && <EditProfile />}

      <div className='lg:w-[60%] w-[100%] mt-[-30px] lg:mt-[-50px] lg:ml-[220px] max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>
        <div className='relative bg-[#111827] pb-[10px] rounded shadow-lg shadow-black/50 flex flex-col items-center border border-[#1f2937]'>

          {/* CENTERED PROFILE IMAGE */}
          <div className='mt-[20px] relative'>
            <div className='w-[90px] h-[90px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer border-2 border-[#1d4ed8] shadow-lg shadow-blue-500/30'>
              <img
                src={profileData.profileImage || dp}
                alt=""
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* USER DETAILS */}
          <div className='mt-[10px] text-center font-semibold text-gray-100'>
            <div className='text-[22px]'>{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className='text-[18px] font-semibold text-gray-200'>{profileData.headline || ""}</div>
            <div className='text-[16px] text-gray-400'>{profileData.location}</div>
            <div className='text-[16px] text-gray-400'>{`${profileData.connection.length} connections`}</div>
          </div>

          {/* BUTTONS */}
          {profileData._id == userData._id ? (
            <button
              className='min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#22c1ff] text-[#22c1ff] flex items-center justify-center gap-[10px] hover:bg-[#22c1ff]/10 transition'
              onClick={() => setEdit(true)}
            >
              Edit Profile <HiPencil />
            </button>
          ) : (
            <div className='mt-[20px]'>
              <ConnectionButton userId={profileData._id} />
            </div>
          )}
        </div>

        <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-100 font-semibold bg-[#111827] shadow-lg rounded-lg border border-[#1f2937]'>
          {`Post (${profilePost.length})`}
        </div>

        {profilePost.map((post, index) => (
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt} />
        ))}

        {profileData.skills.length > 0 && (
          <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-[#111827] shadow-lg rounded-lg border border-[#1f2937]'>
            <div className='text-[22px] text-gray-100'>Skills</div>
            <div className='flex flex-wrap justify-start items-center gap-[20px] text-gray-200 p-[20px]'>
              {profileData.skills.map((skill) => (
                <div className='text-[20px]'>{skill}</div>
              ))}
              {profileData._id == userData._id && (
                <button
                  className='min-w-[150px] h-[40px] rounded-full border-2 ml-[20px] border-[#22c1ff] text-[#22c1ff] flex items-center justify-center gap-[10px] hover:bg-[#22c1ff]/10 transition'
                  onClick={() => setEdit(true)}
                >
                  Add Skills
                </button>
              )}
            </div>
          </div>
        )}

        {profileData.education.length > 0 && (
          <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-[#111827] shadow-lg rounded-lg border border-[#1f2937]'>
            <div className='text-[22px] text-gray-100'>Education</div>
            <div className='flex flex-col justify-start items-start gap-[20px] text-gray-200 p-[20px]'>
              {profileData.education.map((edu) => (
                <>
                  <div className='text-[20px]'>College : {edu.college}</div>
                  <div className='text-[20px]'>Degree : {edu.degree}</div>
                  <div className='text-[20px]'>Field Of Study : {edu.fieldOfStudy}</div>
                </>
              ))}
              {profileData._id == userData._id && (
                <button
                  className='min-w-[150px] h-[40px] rounded-full border-2 border-[#22c1ff] text-[#22c1ff] flex items-center justify-center gap-[10px] hover:bg-[#22c1ff]/10 transition'
                  onClick={() => setEdit(true)}
                >
                  Add Education
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
