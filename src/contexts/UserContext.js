// import React, { createContext, useContext, useState } from "react";

// // 초기 사용자 정보
// const initialUser = {
//   email: '',
//   name: '',
//   employeeId: '',
//   dob: '',
// };

// const UserContext = createContext();

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(initialUser);
  
//   const login = (userData) => setUser(userData);
//   const logout = () => setUser(initialUser);
  
//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
