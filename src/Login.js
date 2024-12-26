import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from './api';
import FormModal from './FormModal'; // 모달 컴포넌트 가져오기

function Login() {
  // 로그인 폼 관련 상태 변수들
  const [email, setemail] = useState(''); // 로그인 시 입력한 이메일을 저장
  const [password, setPassword] = useState(''); // 로그인 시 입력한 비밀번호를 저장
  const [error, setError] = useState(''); // 로그인 시 발생하는 오류 메시지 저장

  // 회원가입 폼 관련 상태 변수들
  const [showSignUp, setShowSignUp] = useState(false); // 회원가입 모달 표시 여부
  const [signUpEmail, setSignUpEmail] = useState(''); // 회원가입 시 입력한 이메일
  const [signUpPassword, setSignUpPassword] = useState(''); // 회원가입 시 입력한 비밀번호

  // 비밀번호 초기화 관련 상태 변수들
  const [showResetPassword, setShowResetPassword] = useState(false); // 비밀번호 초기화 모달 표시 여부
  const [resetEmail, setResetEmail] = useState(''); // 비밀번호 초기화 시 입력한 이메일

  // 로그인 시 이메일 값 변경 처리 함수
  const handleemailChange = (e) => setemail(e.target.value);

  // 로그인 시 비밀번호 값 변경 처리 함수
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // 회원가입 시 이메일 값 변경 처리 함수
  const handleSignUpEmailChange = (e) => setSignUpEmail(e.target.value);

  // 회원가입 시 비밀번호 값 변경 처리 함수
  const handleSignUpPasswordChange = (e) => setSignUpPassword(e.target.value);

  // 비밀번호 초기화 시 이메일 값 변경 처리 함수
  const handleResetEmailChange = (e) => setResetEmail(e.target.value);

  // 로그인 제출 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 이메일 또는 비밀번호가 비어 있을 경우 에러 메시지 설정
    if (email === '' || password === '') {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 로그인 API 요청
      const response = await axios.post(API_URLS.LOGIN, {
        email,
        password
      });

      const { access, refresh } = response.data; // 로그인 응답에서 access와 refresh 토큰 추출

      if (access && refresh) {
        // 로그인 성공 시 토큰을 localStorage에 저장
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        setError(''); // 에러 메시지 초기화
        alert('로그인 성공!');
      }
    } catch (error) {
      // 로그인 실패 시 에러 메시지 설정
      setError('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  };

  // 회원가입 처리 함수
  const handleSignUpSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 이메일과 비밀번호가 비어 있을 경우 경고
    if (signUpEmail === '' || signUpPassword === '') {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // 회원가입 API 요청
      await axios.post(API_URLS.USER, {
        email: signUpEmail,
        password: signUpPassword,
      });

      alert('회원가입 성공!');
      setShowSignUp(false); // 회원가입 모달 닫기
    } catch (error) {
      alert('회원가입 실패');
    }
  };

  // 비밀번호 초기화 처리 함수
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 이메일이 비어 있을 경우 경고
    if (resetEmail === '') {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      // 비밀번호 초기화 API 요청
      await axios.put(API_URLS.LOGIN, {
        email: resetEmail,
      });

      alert('비밀번호 초기화 링크가 전달 완료되었습니다.');
      setShowResetPassword(false); // 비밀번호 초기화 모달 닫기
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
            onChange={handleemailChange} // 이메일 입력 값 변경 시 handler 호출
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
            onChange={handlePasswordChange} // 비밀번호 입력 값 변경 시 handler 호출
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
              // 회원가입 모달 열기, 이메일과 비밀번호 초기화
              setSignUpEmail('');
              setSignUpPassword('');
              setShowSignUp(true); 
              setShowResetPassword(false); // 비밀번호 초기화 모달 닫기
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
              setResetEmail('');
              setShowResetPassword(true); // 비밀번호 초기화 모달 열기
              setShowSignUp(false); // 회원가입 모달 닫기
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
  
      {/* 회원가입 모달 표시 */}
      {showSignUp && (
        <FormModal
          title="회원가입"
          fields={[
            {
              id: 'signUpEmail',
              label: '이메일',
              type: 'email',
              value: signUpEmail,
              onChange: handleSignUpEmailChange, // 이메일 입력 값 변경 시 handler 호출
              placeholder: '이메일을 입력하세요'
            },
            {
              id: 'signUpPassword',
              label: '비밀번호',
              type: 'password',
              value: signUpPassword,
              onChange: handleSignUpPasswordChange, // 비밀번호 입력 값 변경 시 handler 호출
              placeholder: '비밀번호를 입력하세요'
            }
          ]}
          onSubmit={handleSignUpSubmit} // 회원가입 제출 시 handler 호출
          onClose={() => setShowSignUp(false)} // 모달 닫을 때
        />
      )}
  
      {/* 비밀번호 초기화 모달 표시 */}
      {showResetPassword && (
        <FormModal
          title="비밀번호 초기화"
          fields={[
            {
              id: 'resetEmail',
              label: '이메일',
              type: 'email',
              value: resetEmail,
              onChange: handleResetEmailChange, // 이메일 입력 값 변경 시 handler 호출
              placeholder: '이메일을 입력하세요'
            }
          ]}
          onSubmit={handleResetPasswordSubmit} // 비밀번호 초기화 제출 시 handler 호출
          onClose={() => setShowResetPassword(false)} // 모달 닫을 때
        />
      )}
    </div>
  );
}

export default Login;
