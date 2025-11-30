import React, { useContext, useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus, FiCamera } from "react-icons/fi"
import { userDataContext } from '../context/UserContext'
import { HiPencil } from "react-icons/hi2"
import EditProfile from '../components/EditProfile'
import { RxCross1 } from "react-icons/rx"
import { BsImage } from "react-icons/bs"
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import Post from '../components/Post'

function Home() {
  let { userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)

  let [frontendImage, setFrontendImage] = useState("")
  let [backendImage, setBackendImage] = useState("")
  let [description, setDescription] = useState("")
  let [uploadPost, setUploadPost] = useState(false)
  
  // NEW: Filter state
  const [postFilter, setPostFilter] = useState('all') // 'all' | 'connections'

  let image = useRef()
  let [posting, setPosting] = useState(false)
  let [suggestedUser, setSuggestedUser] = useState([])

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) {
        formdata.append("image", backendImage)
      }

      let result = await axios.post(serverUrl + "/api/post/create", formdata, {
        withCredentials: true
      })

      setPosting(false)
      setUploadPost(false)
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", { withCredentials: true })
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // NEW: Get connections to filter posts
  const [connections, setConnections] = useState([])
  const handleGetConnections = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/connection`, { withCredentials: true })
      setConnections(result.data)
    } catch (error) {
      console.log("Connections fetch error:", error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
    handleGetConnections() // Fetch connections on mount
  }, [])

  useEffect(() => {
    getPost()
  }, [uploadPost])

  // Filter posts based on connections
  const filteredPosts = postFilter === 'connections' 
    ? postData.filter(post => 
        connections.some(connection => connection._id === post.author._id)
      )
    : postData

  return (
    <div
      className="
      w-full min-h-[100vh] 
      bg-[#0b1020] text-gray-200
      flex items-start justify-center gap-[20px]
      px-[20px] relative pb-[120px]
      pt-[30px]
      lg:pl-[260px]
    "
    >
      {edit && <EditProfile />}

      <Nav />

      {/* Overlay */}
      {uploadPost && (
        <div className='w-full h-full bg-black/70 fixed top-0 left-0 z-[100]' />
      )}

      {/* Upload Popup */}
      {uploadPost && (
        <div className='w-[90%] max-w-[500px] h-[600px] bg-[#1e1e1e] shadow-[0_0_40px_rgba(0,0,0,0.8)] top-[70px] rounded-lg fixed z-[200] p-[20px] flex flex-col gap-[20px] text-gray-200'>
          {/* Close Button */}
          <div className='absolute top-[20px] right-[20px]'>
            <RxCross1
              className='w-[25px] h-[25px] cursor-pointer text-gray-300 hover:text-white transition'
              onClick={() => setUploadPost(false)}
            />
          </div>

          {/* User Info */}
          <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden bg-gray-800'>
              <img src={userData.profileImage || dp} alt="" className='h-full w-full object-cover' />
            </div>
            <div className='text-[22px]'> {userData.firstName} {userData.lastName} </div>
          </div>

          {/* Hidden File Input */}
          <input type="file" ref={image} hidden onChange={handleImage} />
          
          {/* Main Content Area */}
          <div 
            className='w-full flex-grow rounded-lg overflow-hidden flex items-center justify-center bg-[#111] cursor-pointer'
            onClick={() => image.current.click()}
          >
            {frontendImage ? (
              <img src={frontendImage} alt="Post preview" className='h-full w-full object-contain rounded-lg' />
            ) : (
              <BsImage
                className='w-[60px] h-[60px] text-gray-500 hover:text-gray-300 transition'
              />
            )}
          </div>

          {/* Post Button */}
          <div className='w-full flex justify-end'>
            <button
              className='w-[100px] h-[45px] rounded-full bg-[#0870a8] hover:bg-[#0a85c5] transition text-white'
              disabled={posting || !frontendImage}
              onClick={handleUploadPost}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}

      {/* Center Section */}
      <div className='w-full lg:w-[50%] flex flex-col gap-[20px] pt-[40px] lg:pt-0'>
        {/* NEW: Post Filter Buttons */}
        <div className='w-full bg-[#1a1a1a] shadow-lg rounded-lg p-[15px] border border-[#1f2937] flex gap-[10px]'>
          <button
            className={`flex-1 p-[10px] rounded-lg font-semibold transition-all ${
              postFilter === 'all'
                ? 'bg-[#22c1ff] text-white shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1f2937]'
            }`}
            onClick={() => setPostFilter('all')}
          >
            All Posts 
          </button>
          <button
            className={`flex-1 p-[10px] rounded-lg font-semibold transition-all ${
              postFilter === 'connections'
                ? 'bg-[#22c1ff] text-white shadow-lg'
                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1f2937]'
            }`}
            onClick={() => setPostFilter('connections')}
          >
            Friend 
          </button>
        </div>

        {/* Create Post */}
        <div className='w-full h-[90px] lg:h-[120px] bg-[#1a1a1a] shadow-lg rounded-lg flex items-center p-[20px] gap-[10px] border-blue-300/50 border'>
          <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-700 cursor-pointer'>
            <img src={userData.profileImage || dp} alt="" className='h-full w-full object-cover' />
          </div>
          <button
            className='w-[80%] h-[50px] border border-gray-600 rounded-full 
            bg-[#141414] text-gray-400 hover:bg-[#222] transition px-[20px] text-left'
            onClick={() => setUploadPost(true)}
          >
            Start a post
          </button>
        </div>

        {/* Filtered Posts */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Post
              key={post._id}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.author.createdAt}
            />
          ))
        ) : (
          <div className='w-full bg-[#1a1a1a] shadow-lg rounded-lg p-[40px] text-center border border-[#1f2937]'>
            <div className='text-gray-400 text-[18px] mb-[10px]'>
              {postFilter === 'connections' ? 'No posts from your connections yet.' : 'No posts available.'}
            </div>
            <div className='text-gray-500 text-[14px]'>
              {postFilter === 'connections' ? 'Connect with people to see their posts here.' : 'Start by creating your first post!'}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className='w-full lg:w-[25%] min-h-[200px] bg-[#191f35] rounded-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-200 font-semibold mb-[10px]'>Suggested Users</h1>

        {suggestedUser.length > 0 ? (
          <div className='flex flex-col gap-[10px]'>
            {suggestedUser.map((su) => (
              <div
                key={su._id}
                className='flex items-center gap-[10px] p-[8px] cursor-pointer rounded-lg hover:bg-[#15182a] transition'
                onClick={() => handleGetProfile(su.userName)}
              >
                <div className='w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-700'>
                  <img src={su.profileImage || dp} alt='' className='w-full h-full object-cover' />
                </div>
                <div>
                  <div className='text-[17px] font-semibold text-gray-100'>
                    {su.firstName} {su.lastName}
                  </div>
                  {/* <div className='text-[12px] text-gray-400'>{su.headline}</div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-gray-500'>No Suggested Users</div>
        )}
      </div>
    </div>
  )
}

export default Home


