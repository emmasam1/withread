// "use client";

// import React, { useState, useEffect } from "react";
// import { Button, Dropdown, Space } from "antd";
// import Image from "next/image";
// import axios from "axios";
// import { useApp } from "../../../context/context";

// const items = [
//   { label: "Not interested in this post", key: "0" },
//   { label: "Remove @ramsey’s post from my feed", key: "1" },
//   { type: "divider" },
//   { label: "Mute", key: "2" },
//   { label: "Block", key: "3" },
//   { label: "Report", key: "4" },
//   { label: "Show fewer posts like this", key: "5" },
// ];

// const ForYou = () => {

//    const { isLoggedIn, API_BASE_URL, user, setUser, logout, loading } = useApp();
//     const [allPost, setAllPost] = useState([])

//      const getAllPost = async () => {
//       const url = `${API_BASE_URL}/api/post/all-posts`;
    
//       try {
//         const res = await axios.get(url); 
//         setAllPost(res.data)
//         // console.log("Posts fetched:", res.data); 
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };
    
//     useEffect(() => {
//       if (API_BASE_URL) {
//         getAllPost();
//       }
//     }, [API_BASE_URL]);
    
//     console.log(allPost)
 

//   return (
//     <div className="space-y-8">
//       {allPost.map((post, index) => (
//         <div
//           key={index}
//           className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto"
//         >
//           {/* User Info */}
//           <div className="flex justify-between items-center mb-4">
//             <div className="flex items-center gap-3">
//               <Image
//                 src={post.userImage}
//                 alt="User 1"
//                 width={40}
//                 height={40}
//                 className="rounded-full"
//               />
//               <Image
//                 src={post.userImage}
//                 alt="User 2"
//                 width={40}
//                 height={40}
//                 className="rounded-full -ml-7"
//               />
//               <div>
//                 <div className="flex items-center gap-1">
//                   <p className="font-medium text-gray-800">{post.user1} &amp; {post.user2}</p>
//                   <Image
//                     src={post.verify}
//                     alt="Verified"
//                     width={18}
//                     height={18}
//                     className="inline"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500">{post.createdAt}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <Button
//                 size="small"
//                 className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-1 !px-3"
//               >
//                 Follow Both
//               </Button>
//               <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
//                 <a onClick={(e) => e.preventDefault()}>
//                   <Space>
//                     <Image
//                       src="/images/Frame.png"
//                       alt="More options"
//                       width={18}
//                       height={12}
//                     />
//                   </Space>
//                 </a>
//               </Dropdown>
//             </div>
//           </div>
//           {/* Post Image */}
//           <div className="my-3">
//             <Image
//               src={post.image}
//               alt="Post image"
//               width={800}
//               height={300}
//               className="rounded w-full object-cover"
//             />
//           </div>
//           {/* Post Content */}
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-2">
//               {post.topic}
//             </h2>
//             <p className="text-sm text-gray-600">{post.content}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ForYou;


"use client";

import React, { useState, useEffect } from "react";
import { Button, Dropdown, Space } from "antd";
import Image from "next/image";
import axios from "axios";
import { useApp } from "../../../context/context";

const items = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove this post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];

const ForYou = () => {
  const { isLoggedIn, API_BASE_URL, user, setUser, logout, loading } = useApp();
  const [allPost, setAllPost] = useState([]);
  const [allInterestPost, setAllInterestPost] = useState('');

  const getAllPost = async () => {
    const url = `${API_BASE_URL}/api/post/all-posts`;
    try {
      const res = await axios.get(url);
      setAllPost(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getAllInterestPost = async () => {
      const url = `${API_BASE_URL}/api/post/user/post-by-interest`;
    try {
      const res = await axios.get(url);
      setAllInterestPost(res.data.interests);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  console.log("one user", allInterestPost.length)

console.log(allPost)
  useEffect(() => {
    if (API_BASE_URL) {
      getAllPost();
      getAllInterestPost()
    }
  }, [API_BASE_URL]);

  return (
    <div className="space-y-8">
      {allPost.map((post, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto"
        >
          {/* User Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.author?.avatar || "/images/default-avatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {post.author?.firstName} {post.author?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="small"
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-1 !px-3"
              >
                Follow
              </Button>
              <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Image
                      src="/images/Frame.png"
                      alt="More options"
                      width={18}
                      height={12}
                    />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>

          {/* Post Image */}
          {post.images?.length > 0 && (
            <div className="my-3">
              <Image
                src={post.images[0]}
                alt="Post image"
                width={800}
                height={300}
                className="rounded w-full object-cover"
              />
            </div>
          )}

          {/* Post Content */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {post.topic || "Untitled"}
            </h2>
            <p className="text-sm text-gray-600">{post.content}</p>
          </div>

          <div className="flex justify-between items-center mt-3">
            <div className="flex justify-between items-center gap-6">
              <p className="flex items-center gap-1 text-xs bg-gray-300 rounded-full py-1 px-3"><Image src='/images/like.png' alt='icon' width={15} height={15}/>  Likes <Image src='/images/dot.png' alt='icon' width={3} height={3}/> {post.likes.length}</p>
              <p className="flex items-center gap-1 text-xs"><Image src='/images/comment.png' alt='icon' width={15} height={15}/> Comments</p>
              <p className="flex items-center gap-1 text-xs"><Image src='/images/share.png' alt='icon' width={15} height={15}/> Share</p>
            </div>
            <div className="flex justify-between items-center gap-1.5">
              <p className="flex items-center gap-1 text-xs">{post.comments.length} Comments</p>
              <Image src='/images/dot.png' alt='icon' width={3} height={3}/>
              <p className="flex items-center gap-1 text-xs">{post.comments.length} Impressions</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForYou;
