import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';  // 로그인 컴포넌트
import UserProfile from './components/UserProfile/UserProfile';  // 사용자 프로필 컴포넌트
import PasswordResetForm from './components/PasswordReset/PasswordReset';  // 비밀번호 재설정 컴포넌트
import PasswordChange from './components/PasswordChange/PasswordChange';  // 비밀번호 변경 컴포넌트
import Board from './components/Board/Board';  // 게시판 컴포넌트
import { UserProvider } from './contexts/UserContext';  // 사용자 정보 제공 Context

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          {/* 라우팅 설정 */}
          <Routes>
            {/* 로그인 페이지 */}
            <Route path="/" element={<Login />} />

            {/* 비밀번호 재설정 페이지 */}
            <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />

            {/* 사용자 프로필 페이지 */}
            <Route path="/profile" element={<UserProfile />} />

            {/* 비밀번호 변경 페이지 */}
            <Route path="/change-password" element={<PasswordChange />} />

            {/* 게시판 페이지 */}
            <Route path="/board" element={<Board />} />

            {/* 404 페이지 */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
