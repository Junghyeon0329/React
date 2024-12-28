import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const loginUser = (userData) => {
    setUser(userData);  // 로그인 시 사용자 정보를 상태에 저장
    localStorage.setItem('authToken', userData.accessToken);  // authToken 저장
    localStorage.setItem('refreshToken', userData.refreshToken);  // refreshToken 저장
  };

  const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
