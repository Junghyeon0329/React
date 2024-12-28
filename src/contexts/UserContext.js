import React, { createContext, useState, useContext } from 'react';

// UserContext 생성
const UserContext = createContext();

// UserProvider 컴포넌트
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // 유저 정보 초기값: null

  // 로그인 시 유저 정보를 업데이트하는 함수
  const loginUser = (userInfo) => setUser(userInfo);

  return (
    <UserContext.Provider value={{ user, loginUser }}>
      {children}
    </UserContext.Provider>
  );
}

// useUser 커스텀 훅
export const useUser = () => useContext(UserContext);
