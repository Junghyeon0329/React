import React, { useState } from 'react';

function Login() {
  // 상태 관리
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 입력 필드의 값이 변경될 때 상태 업데이트
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // 로그인 처리 (실제로는 API 호출로 대체)
  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (username === '' || password === '') {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
    } else if (username === 'admin' && password === '1234') {
      // 로그인 성공 (예시로 'admin' / '1234'에 대해 성공 처리)
      setError('');
      alert('로그인 성공!');
      // 실제로는 서버에 요청을 보내고, 세션이나 토큰을 처리해야 함
    } else {
      // 로그인 실패
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">아이디</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
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
  );
}

export default Login;
