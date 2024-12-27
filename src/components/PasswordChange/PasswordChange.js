// import React, { useState } from "react";
// import { useNavigate  } from "react-router-dom";
// import { changePassword } from "../services/authService";

// const PasswordChange = () => {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       alert("비밀번호가 일치하지 않습니다.");
//       return;
//     }

//     try {
//       await changePassword(password);
//       alert("비밀번호가 변경되었습니다.");
//       history.push("/profile");
//     } catch (error) {
//       alert("비밀번호 변경에 실패했습니다.");
//     }
//   };

//   return (
//     <div className="password-change-container">
//       <h2>비밀번호 변경</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>새 비밀번호</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>비밀번호 확인</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit">변경</button>
//       </form>
//     </div>
//   );
// };

// export default PasswordChange;
