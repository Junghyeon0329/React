// import React from "react";
// import { useUser } from "../contexts/UserContext";
// import { Link } from "react-router-dom";

// const UserProfile = () => {
//   const { user, logout } = useUser();

//   const handleLogout = () => {
//     logout();
//     // 로그아웃 후 리디렉션 처리
//   };

//   return (
//     <div className="profile-container">
//       <h2>사용자 정보</h2>
//       <p>Email: {user.email}</p>
//       <p>이름: {user.name}</p>
//       <p>사원 번호: {user.employeeId}</p>
//       <p>생년월일: {user.dob}</p>
//       <button onClick={handleLogout}>로그아웃</button>
//       <Link to="/change-password">비밀번호 변경</Link>
//     </div>
//   );
// };

// export default UserProfile;
