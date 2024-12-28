import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login'; // 로그인 컴포넌트
import PasswordResetForm from './components/PasswordReset/PasswordReset'; // 비밀번호 재설정 컴포넌트
import MainPage from './components/MainPage/MainPage'; // 게시판 컴포넌트
import { UserProvider } from './contexts/UserContext'; // 사용자 정보 제공 Context

function App() {
  return (
    <UserProvider>
      {/* v7_relativeSplatPath 플래그를 설정 */}
      <Router future={{ v7_relativeSplatPath: true }}>
        <div className="App">
          {/* 라우팅 설정 */}
          <Routes>
            {/* 로그인 페이지 */}
            <Route path="/" element={<Login />} />

            {/* 비밀번호 재설정 페이지 */}
            <Route path="/reset-password/:uid/:token" element={<PasswordResetForm />} />

            {/* 메인 페이지 */}
            <Route path="/main" element={<MainPage />} />

            {/* 404 페이지 */}
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
