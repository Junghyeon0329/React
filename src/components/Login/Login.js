import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from '../../api';
import FormModal from '../FormModal'; 
import './Login.css'; // CSS 파일 import

function Login() {
  // 로그인 폼 관련 상태 변수들
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 회원가입 폼 관련 상태 변수들
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // 비밀번호 초기화 관련 상태 변수들
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(API_URLS.LOGIN, { email, password });
      const { access, refresh } = response.data;
      if (access && refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        setError('');
        alert('로그인 성공!');
      }
    } catch (error) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpEmail === '' || signUpPassword === '') {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post(API_URLS.USER, { email: signUpEmail, password: signUpPassword });
      alert('회원가입 성공!');
      setShowSignUp(false);
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (resetEmail === '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.put(API_URLS.RESET_PASSWORD, { email: resetEmail });
      alert('비밀번호 초기화 링크가 전달 완료되었습니다.');
      setShowResetPassword(false);
    } catch (error) {
      alert('비밀번호 초기화 실패');
    }
  };

  return (
    <div className="login-container">
      <h1>One-Que</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="input-field"
          />
        </div>

        <p style={{ color: 'red', visibility: error ? 'visible' : 'hidden', marginTop: '10px' }}>
          {error}
        </p>

        <button type="submit" className="submit-button">로그인</button>
      </form>

      <div className="link-container">
        <button onClick={() => { setShowSignUp(true); setShowResetPassword(false); }}>회원가입</button>
        <button onClick={() => { setShowResetPassword(true); setShowSignUp(false); }}>비밀번호 초기화</button>
      </div>

      {/* 회원가입 모달 표시 */}
      {showSignUp && (
        <FormModal
          title="회원가입"
          fields={[
            { id: 'signUpEmail', label: '이메일', type: 'email', value: signUpEmail, onChange: (e) => setSignUpEmail(e.target.value) },
            { id: 'signUpPassword', label: '비밀번호', type: 'password', value: signUpPassword, onChange: (e) => setSignUpPassword(e.target.value) }
          ]}
          onSubmit={handleSignUpSubmit}
          onClose={() => setShowSignUp(false)}
        />
      )}

      {/* 비밀번호 초기화 모달 표시 */}
      {showResetPassword && (
        <FormModal
          title="비밀번호 초기화"
          fields={[
            { id: 'resetEmail', label: '이메일', type: 'email', value: resetEmail, onChange: (e) => setResetEmail(e.target.value) }
          ]}
          onSubmit={handleResetPasswordSubmit}
          onClose={() => setShowResetPassword(false)}
        />
      )}
    </div>
  );
}

export default Login;
