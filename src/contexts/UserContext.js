import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const loginUser = (userData) => {
    localStorage.setItem('authToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    setUser(userData);
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
