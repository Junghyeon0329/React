import React from 'react';
import './App.css';
import Login from './Login';  // 기존의 로그인 컴포넌트
import PasswordResetForm from './PasswordResetForm';  // 비밀번호 재설정 폼 컴포넌트
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // React Router import (Switch -> Routes)

function App() {
  return (
    <Router>
      <div className="App">
        {/* 라우팅 설정 */}
        <Routes>
          {/* 로그인 페이지 */}
          <Route exact path="/" element={<Login />} />

          {/* 비밀번호 재설정 페이지 */}
          <Route exact path="/reset-password/:uid/:token" element={<PasswordResetForm />} />

          {/* 나머지 경로는 404 페이지로 처리 */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
