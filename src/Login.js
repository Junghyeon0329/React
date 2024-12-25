import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from './api';
import FormModal from './FormModal'; // 모달 컴포넌트 가져오기

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  const handleemailChange = (e) => setemail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleSignUpEmailChange = (e) => setSignUpEmail(e.target.value);
  const handleSignUpPasswordChange = (e) => setSignUpPassword(e.target.value);
  const handleResetEmailChange = (e) => setResetEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
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
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
      alert('로그인 실패');
    }
  };

  // 회원가입 처리
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (signUpEmail === '' || signUpPassword === '') {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/user/', {
        email: signUpEmail,
        password: signUpPassword,
      });

      alert('회원가입 성공!');
      setShowSignUp(false);
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  // 비밀번호 초기화 처리
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (resetEmail === '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/user/reset-password', {
        email: resetEmail,
      });

      alert('비밀번호 초기화 링크가 전송되었습니다.');
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
            onChange={handleemailChange}
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
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력하세요"
            className="input-field" 
          />
        </div>
        
        {/* 에러 메시지를 위한 공간 */}
        <p style={{
          color: 'red', 
          minHeight: '20px', // 최소 높이를 설정하여 공간을 확보
          visibility: error ? 'visible' : 'hidden', // error가 있을 때만 보이도록 설정
          marginTop: '10px', // 여백 추가
        }}>
          {error}
        </p>
  
        <button type="submit" className="submit-button">로그인</button>
      </form>
  
      <div className="link-container">
        <p>
          <button 
            type="button" 
            onClick={() => { 
              setShowSignUp(true); 
              setShowResetPassword(false); 
            }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              textDecoration: 'underline', 
              cursor: 'pointer' 
              }}>
            회원가입
          </button>
        </p>
        <p>
          <button 
            type="button" 
            onClick={() => { 
              setShowResetPassword(true); 
              setShowSignUp(false); 
            }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              textDecoration: 'underline', 
              cursor: 'pointer' 
              }}>
            비밀번호 초기화
          </button>
        </p>
      </div>
  
      {showSignUp && (
        <FormModal
          title="회원가입"
          fields={[
            {
              id: 'signUpEmail',
              label: '이메일',
              type: 'email',
              value: signUpEmail,
              onChange: handleSignUpEmailChange,
              placeholder: '이메일을 입력하세요'
            },
            {
              id: 'signUpPassword',
              label: '비밀번호',
              type: 'password',
              value: signUpPassword,
              onChange: handleSignUpPasswordChange,
              placeholder: '비밀번호를 입력하세요'
            }
          ]}
          onSubmit={handleSignUpSubmit}
          onClose={() => setShowSignUp(false)} 
        />
      )}
  
      {showResetPassword && (
        <FormModal
          title="비밀번호 초기화"
          fields={[
            {
              id: 'resetEmail',
              label: '이메일',
              type: 'email',
              value: resetEmail,
              onChange: handleResetEmailChange,
              placeholder: '이메일을 입력하세요'
            }
          ]}
          onSubmit={handleResetPasswordSubmit}
          onClose={() => setShowResetPassword(false)}
        />
      )}
    </div>
  );
}

export default Login;
