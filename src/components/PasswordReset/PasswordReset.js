import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URLS from '../../api/apiURLS';

function PasswordResetForm() {
  const { uid, token } = useParams();  // URL에서 uid와 token 추출
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === '' || confirmPassword === '') {
      setError('항목을 모두 입력해주세요.');
      return;
    }

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
          navigate('/login');  // 로그인 페이지로 리다이렉트
        }
      } catch (error) {
        setError('비밀번호 재설정에 실패했습니다.');
      }
  };

return (
  <div className="login-container">
    <h1>비밀번호 재설정</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">새 비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새로운 비밀번호를 입력하세요"
          className="input-field" 
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 한번 입력하세요"
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

      <button type="submit" className="submit-button">비밀번호 재설정</button>
    </form>

    </div>
  );
}
export default PasswordResetForm;
