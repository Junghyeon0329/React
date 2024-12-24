import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';  // 페이지 이동을 위한 hook

function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const navigate = useNavigate();  // 페이지 이동을 위한 hook

  // 입력 필드의 값이 변경될 때 상태 업데이트
  const handleemailChange = (e) => {
    setemail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // 로그인 처리 (실제로는 API 호출로 대체)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (email === '' || password === '') {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      // API로 이메일과 비밀번호 전송 (localhost:8000)
      const response = await axios.post('http://localhost:8000/login/', {
        email: email,
        password: password,
      });

      // 로그인 성공
      const { token } = response.data;  // 서버에서 반환된 토큰

      if (token) {
        // 토큰을 localStorage에 저장
        localStorage.setItem('token', token);

        // 로그인 성공 메시지
        setError('');
        alert('로그인 성공!');

        // 다른 페이지로 이동 (예: 대시보드 페이지로 이동)
        // navigate('/dashboard');
      }
    } catch (error) {
      // 로그인 실패 처리
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-container">
      <h1>One-Que</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={handleemailChange}
              placeholder="아이디를 입력하세요"
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
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
