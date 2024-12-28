import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// 인증되지 않은 사용자를 로그인 페이지로 리디렉션하는 ProtectedRoute 컴포넌트
const ProtectedRoute = ({ children }) => {
  const { user } = useUser(); // 인증 상태 확인

  if (!user) {
    // 인증되지 않았다면 로그인 페이지로 리디렉션
    return <Navigate to="/login" />;
  }

  return children; // 인증되었다면 자식 컴포넌트를 렌더링
};

export default ProtectedRoute;
