// import React, { useState, useEffect } from "react";
// import { getPosts, createPost, deletePost } from "../services/boardService";

// const Board = () => {
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState("");

//   useEffect(() => {
//     async function fetchPosts() {
//       const data = await getPosts();
//       setPosts(data);
//     }
//     fetchPosts();
//   }, []);

//   const handleCreatePost = async () => {
//     await createPost(newPost);
//     setNewPost("");
//     const data = await getPosts();
//     setPosts(data);
//   };

//   const handleDeletePost = async (id) => {
//     await deletePost(id);
//     const data = await getPosts();
//     setPosts(data);
//   };

//   return (
//     <div className="board-container">
//       <h2>사내 게시판</h2>
//       <textarea 
//         value={newPost}
//         onChange={(e) => setNewPost(e.target.value)}
//         placeholder="새 게시글을 작성하세요"
//       />
//       <button onClick={handleCreatePost}>게시글 작성</button>
      
//       <ul>
//         {posts.map((post) => (
//           <li key={post.id}>
//             <p>{post.content}</p>
//             <button onClick={() => handleDeletePost(post.id)}>삭제</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Board;
