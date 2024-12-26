import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URLS from './api';

function PasswordResetForm() {
  const { uid, token } = useParams();  // URL에서 uid와 token 추출
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
        // API_URLS.RESET_PASSWORD 값과 uid, token을 합쳐서 동적으로 URL을 만들기
        const url = `${API_URLS.RESET_PASSWORD}${uid}/${token}/`;
        const response = await axios.put(url, { password });
      
        if (response.data.success) {
          alert('비밀번호가 성공적으로 변경되었습니다.');
          navigate('/');  // 로그인 페이지로 리다이렉트
        }
      } catch (error) {
        setError('비밀번호 재설정에 실패했습니다.');
      }
  };

  return (
    <div>
      <h2>비밀번호 재설정</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">새 비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">비밀번호 재설정</button>
      </form>
    </div>
  );
}

export default PasswordResetForm;
