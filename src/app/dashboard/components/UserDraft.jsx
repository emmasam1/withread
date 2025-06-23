// "use client";
// import React, { useEffect, useState } from "react";
// import { useApp } from "../../context/context";
// import { Card } from "antd";
// import axios from "axios";
// import { toast } from "react-toastify";
// // import WithReadLoader from "./WithReadLoader";
// import WithReadLoader from "../components/WithReadLoader";

// const { Meta } = Card;

// const UserDraft = () => {
//   const { API_BASE_URL, setLoading, loading, user, token } = useApp();
//   const [drafts, setDrafts] = useState([]);

//   useEffect(() => {
//     const getDrafts = async () => {
//       if (!API_BASE_URL || !token) return;
//       try {
//         setLoading(true);
//         const res = await axios.get(`${API_BASE_URL}/api/post/user/drafts`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.data.success) {
//             console.log(res)
//             setDrafts(res.data.drafts || []);
//         //   console.log(res.data.posts, "Fetched Posts");
//         } else {
//           toast.error("Failed to fetch posts");
//         }
//       } catch (error) {
//         console.error("Error fetching user posts:", error);
//         toast.error("Error fetching user posts");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getDrafts();
//   }, [API_BASE_URL, token]);

//   return (
//     <div>
//      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {loading ? (
//           <WithReadLoader />
//         ) : (
//           drafts && drafts.length > 0 ? (
//           drafts.map((draft) => (
//             <Card
//               key={draft._id}
//               hoverable
//               cover={
//                 <img
//                   alt="Post cover"
//                   src={draft.images || "/images/placeholder.jpg"}
//                   className="h-60 w-full object-cover"
//                 />
//               }
//             >
//               <Meta
//                 title={draft.title || "Untitled Post"}
//                 description={draft.content?.slice(0, 100) || "No description available."}
//               />
//             </Card>
//           ))
//         ) : (
//           <p>No Drafted posts Yet.</p>
//         )
//         )}
//       </div> 
//     </div>
//   );
// };

// export default UserDraft;

import PostGrid from "./reusables/PostGrid";

const UserDraft = () => {
  return (
    <PostGrid
      endpoint="/api/post/user/drafts"
      emptyMessage="No drafted posts yet."
      titleKey="title"
      descriptionKey="content"
      imageKey="images"
    />
  );
};

export default UserDraft;



