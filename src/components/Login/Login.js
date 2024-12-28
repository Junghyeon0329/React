import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import FormModal from '../FormModal';
import './Login.css';

function Login() {
  const [email, setEmail] = useState(''); // 로그인 시 입력한 이메일을 저장
  const [password, setPassword] = useState(''); // 로그인 시 입력한 비밀번호를 저장
  const [error, setError] = useState(''); // 로그인 시 발생하는 오류 메시지 저장
  const [showSignUp, setShowSignUp] = useState(false); // 회원가입 모달 표시 여부
  const [signUpEmail, setSignUpEmail] = useState(''); // 회원가입 시 입력한 이메일
  const [signUpPassword, setSignUpPassword] = useState(''); // 회원가입 시 입력한 비밀번호
  const [showResetPassword, setShowResetPassword] = useState(false); // 비밀번호 초기화 모달 표시 여부
  const [resetEmail, setResetEmail] = useState(''); // 비밀번호 초기화 시 입력한 이메일

  const navigate = useNavigate();
  const { loginUser } = useUser(); // context에서 loginUser 함수를 가져옵니다

  // 로그인 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email === '' || password === '') {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      
      const response = await axios.post(API_URLS.LOGIN, { email, password });
      const { access, refresh, user } = response.data;      

      if (access && refresh) {
        loginUser({ ...user, accessToken: access, refreshToken: refresh });
        navigate('/main');  // 로그인 후 리다이렉트
      }

    } catch (error) {
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  // 회원가입 제출 함수
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

  // 비밀번호 초기화 제출 함수
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (resetEmail === '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.put(API_URLS.LOGIN, { email: resetEmail });
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
            onChange={(e) => setEmail(e.target.value)}
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

        {/* 에러 메시지를 위한 공간 */}
        <p style={{
          color: 'red',
          minHeight: '20px',
          visibility: error ? 'visible' : 'hidden',
          marginTop: '10px',
        }}>
          {error}
        </p>

        <button type="submit" className="submit-button">로그인</button>
      </form>

      <div className="link-container">
        <button onClick={() => {
          setSignUpEmail('');
          setSignUpPassword('');
          setShowSignUp(true);
          setShowResetPassword(false);
        }}>회원가입</button>
        <button onClick={() => {
          setResetEmail('');
          setShowResetPassword(true);
          setShowSignUp(false);
        }}>비밀번호 초기화</button>
      </div>

      {/* 회원가입 모달 */}
      {showSignUp && (
        <FormModal
          title="회원가입"
          fields={[
            {
              id: 'signUpEmail',
              label: '이메일',
              type: 'email',
              value: signUpEmail,
              placeholder: '이메일을 입력하세요',
              onChange: (e) => setSignUpEmail(e.target.value)
            },
            {
              id: 'signUpPassword',
              label: '비밀번호',
              type: 'password',
              value: signUpPassword,
              placeholder: '비밀번호를 입력하세요',
              onChange: (e) => setSignUpPassword(e.target.value)
            }
          ]}
          onSubmit={handleSignUpSubmit}
          onClose={() => setShowSignUp(false)}
        />
      )}

      {/* 비밀번호 초기화 모달 */}
      {showResetPassword && (
        <FormModal
          title="비밀번호 초기화"
          fields={[
            {
              id: 'resetEmail',
              label: '이메일',
              type: 'email',
              value: resetEmail,
              placeholder: '이메일을 입력하세요',
              onChange: (e) => setResetEmail(e.target.value)
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
