import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import FormModal from '../FormModal';
import './Login.css';

function Login() {
  const [state, setState] = useState({
    email: '', // 로그인 시 입력한 이메일
    password: '', // 로그인 시 입력한 비밀번호
    error: '', // 로그인 시 발생한 오류 메시지
    showSignUp: false, // 회원가입 모달 표시 여부
    signUpEmail: '', // 회원가입 시 입력한 이메일
    signUpPassword: '', // 회원가입 시 입력한 비밀번호
    showResetPassword: false, // 비밀번호 초기화 모달 표시 여부
    resetEmail: '', // 비밀번호 초기화 시 입력한 이메일
  });

  const navigate = useNavigate();
  const { loginUser } = useUser(); // context에서 loginUser 함수를 가져옵니다

  // 상태 업데이트 함수
  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // 로그인 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = state;
    if (email === '' || password === '') {
      updateState('error', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(API_URLS.LOGIN, { email, password });
      const { access, refresh, user } = response.data;

      if (access && refresh) {
        loginUser({ ...user, accessToken: access, refreshToken: refresh });
        navigate('/main');
      }
    } catch (error) {
      updateState('error', '이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  const [signUpError, setSignUpError] = useState('');
  const [ResetError, setResetError] = useState('');
  // 회원가입 제출 함수
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const { signUpEmail, signUpPassword } = state;

    if (signUpEmail === '' || signUpPassword === '') {
      setSignUpError('필수항목을 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post(API_URLS.USER, { email: signUpEmail, password: signUpPassword });
      alert('회원가입 성공!');
      updateState('showSignUp', false);
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  // 비밀번호 초기화 제출 함수
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    const { resetEmail } = state;

    if (resetEmail === '') {
      setResetError('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.put(API_URLS.LOGIN, { email: resetEmail });
      alert('비밀번호 초기화 링크가 전달 완료되었습니다.');
      updateState('showResetPassword', false);
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
            value={state.email}
            onChange={(e) => updateState('email', e.target.value)}
            placeholder="이메일을 입력하세요"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={state.password}
            onChange={(e) => updateState('password', e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="input-field"
          />
        </div>

        <p
          style={{
            color: 'red',
            minHeight: '20px',
            visibility: state.error ? 'visible' : 'hidden',
            marginTop: '10px',
          }}
        >
          {state.error}
        </p>

        <button type="submit" className="submit-button">
          로그인
        </button>
      </form>

      <div className="link-container">
        <button
          onClick={() => {
            updateState('signUpEmail', '');
            updateState('signUpPassword', '');
            setSignUpError('');
            updateState('showSignUp', true);
            updateState('showResetPassword', false);
          }}
        >
          회원가입
        </button>
        <button
          onClick={() => {
            
            updateState('resetEmail', '');
            setResetError('');
            updateState('showResetPassword', true);
            updateState('showSignUp', false);
          }}
        >
          비밀번호 초기화
        </button>
      </div>

      {/* 회원가입 모달 */}
      {state.showSignUp && (
        <FormModal
          title="회원가입"
          fields={[
            {
              id: 'signUpEmail',
              label: '이메일',
              type: 'email',
              value: state.signUpEmail,
              placeholder: '이메일을 입력하세요',
              onChange: (e) => updateState('signUpEmail', e.target.value),
            },
            {
              id: 'signUpPassword',
              label: '비밀번호',
              type: 'password',
              value: state.signUpPassword,
              placeholder: '비밀번호를 입력하세요',
              onChange: (e) => updateState('signUpPassword', e.target.value),
            },
          ]}
          onSubmit={handleSignUpSubmit}
          onClose={() => updateState('showSignUp', false)}
          error={signUpError} // 오류 메시지 전달
        />
      )}

      {/* 비밀번호 초기화 모달 */}
      {state.showResetPassword && (
        <FormModal
          title="비밀번호 초기화"
          fields={[
            {
              id: 'resetEmail',
              label: '이메일',
              type: 'email',
              value: state.resetEmail,
              placeholder: '이메일을 입력하세요',
              onChange: (e) => updateState('resetEmail', e.target.value),
            },
          ]}
          onSubmit={handleResetPasswordSubmit}
          onClose={() => updateState('showResetPassword', false)}
          error={ResetError} // 오류 메시지 전달
        />
      )}
    </div>
  );
}

export default Login;
