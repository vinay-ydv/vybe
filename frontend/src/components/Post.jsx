import React, { useContext, useEffect, useState, useRef } from "react"
import dp from "../assets/dp.webp"
import moment from "moment"
import { FaRegCommentDots } from "react-icons/fa"
import axios from "axios"
import { authDataContext } from "../context/AuthContext"
import { userDataContext } from "../context/userContext"
import { LuSendHorizontal } from "react-icons/lu"
import { io } from "socket.io-client"
import ConnectionButton from "./ConnectionButton"
import { FaHeart, FaRegHeart } from "react-icons/fa6"

const socket = io("http://localhost:8000")

function Post({ id, author, like, comment, description, image, createdAt }) {
  const { serverUrl } = useContext(authDataContext)
  const { userData, getPost, handleGetProfile } = useContext(userDataContext)
  const [likes, setLikes] = useState(like)
  const [commentContent, setCommentContent] = useState("")
  const [comments, setComments] = useState(comment)
  const [showComment, setShowComment] = useState(false)

  // <CHANGE> Added hover effect states and ref
  const cardRef = useRef(null)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const handleLike = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      })
      setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        { content: commentContent },
        { withCredentials: true },
      )
      setComments(result.data.comment)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  // <CHANGE> Added mouse move handler for tilt and cursor tracking
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCursorPosition({ x, y })

    // Tilt effect
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5 // Reduced intensity for larger card
    const rotateY = ((x - centerX) / centerX) * 5

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
  }

  // <CHANGE> Added mouse leave handler to reset transform
  const handleMouseLeave = () => {
    setIsHovering(false)
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    }
  }

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) setLikes(likes)
    })
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) setComments(comm)
    })
    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  }, [id])

  useEffect(() => {
    getPost()
  }, [likes, comments])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full flex flex-col bg-[#1a1a1a] rounded-lg shadow-lg shadow-black/50 text-gray-100 relative overflow-hidden border-2 border-[#293d5d] transition-all duration-300"
      style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
    >
      {/* <CHANGE> Added animated border glow effect */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(7, 164, 255, 0.8), transparent 70%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "2px",
          }}
        />
      )}

      {/* <CHANGE> Added background glow that follows cursor */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(7, 164, 255, 0.1), transparent 40%)`,
            opacity: isHovering ? 1 : 0,
          }}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center p-[20px] pb-[10px] relative z-10">
        <div
          className="flex justify-center items-start gap-[10px]"
          onClick={() => handleGetProfile(author.userName)}
        >
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer bg-gray-700">
            <img
              src={author.profileImage || dp}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-[18px] font-semibold text-white">
              {author.firstName} {author.lastName}
            </div>
            <div className="text-[14px] text-gray-400">{author.headline}</div>
            <div className="text-[13px] text-gray-500">
              {moment(createdAt).fromNow()}
            </div>
          </div>
        </div>
        {userData._id !== author._id && (
          <ConnectionButton userId={author._id} />
        )}
      </div>

      {/* FULL IMAGE ONLY — NO DESCRIPTION */}
      {image && (
        <div className="w-full h-[500px] overflow-hidden relative z-10">
          <img
            src={image || "/placeholder.svg"}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Likes & Comments */}
      <div className="relative z-10">
        <div className="w-full flex justify-between items-center px-[20px] py-[15px] border-b-2 border-[#3a3a3a]">
          <div className="flex items-center gap-[5px] text-[18px] text-gray-300">
            <FaRegHeart className="text-[#cc2048] w-[20px] h-[20px]" />
            <span>{likes.length}</span>
          </div>
          <div
            className="flex items-center gap-[5px] text-[18px] cursor-pointer text-gray-300 hover:text-blue-400"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <span>{comment.length}</span>
            <span>comments</span>
          </div>
        </div>

        {/* Like & Comment Buttons */}
        <div className="flex items-center w-full px-[20px] py-[15px] gap-[30px]">
          {!likes.includes(userData._id) ? (
            <div
              className="flex items-center gap-[5px] cursor-pointer text-gray-300 hover:text-white"
              onClick={handleLike}
            >
              <FaRegHeart className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          ) : (
            <div className="flex items-center gap-[5px] cursor-pointer" onClick={handleLike}>
              <FaHeart className="w-[24px] h-[24px] text-[#cc2048]" />
              <span className="text-[#cc2048] font-semibold">Liked</span>
            </div>
          )}
          <div
            className="flex items-center gap-[5px] cursor-pointer text-gray-300 hover:text-white"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots className="w-[24px] h-[24px]" />
            <span>comment</span>
          </div>
        </div>

        {/* Comments */}
        {showComment && (
          <div className="px-[20px] pb-[20px]">
            <form
              className="w-full flex justify-between items-center border-b-2 border-[#3a3a3a] p-[10px]"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder="leave a comment"
                className="flex-1 bg-transparent text-gray-100 outline-none placeholder:text-gray-500"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button>
                <LuSendHorizontal className="text-[#07a4ff] w-[22px] h-[22px]" />
              </button>
            </form>
            <div className="flex flex-col gap-[10px] mt-[10px]">
              {comments.map((com) => (
                <div key={com._id} className="flex flex-col gap-[10px] border-b-2 border-[#3a3a3a] p-[20px]">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-gray-700">
                      <img
                        src={com.user.profileImage || dp}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="text-[16px] font-semibold text-white">
                      {com.user.firstName} {com.user.lastName}
                    </div>
                  </div>
                  <div className="pl-[50px] text-gray-300">{com.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Post