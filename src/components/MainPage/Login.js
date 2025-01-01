import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';

function Login() {
    const [state, setState] = useState({
        email: '', // 로그인 시 입력한 이메일
        password: '', // 로그인 시 입력한 비밀번호
        error: '', // 로그인 시 발생한 오류 메시지
    });

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const { loginUser } = useUser();

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
          }
          updateState('error', '로그인 성공');
        } catch (error) {
          updateState('error', '이메일 또는 비밀번호가 잘못되었습니다.');
        }
      };

    return (
        <div className="grid-item login">
            <form onSubmit={handleSubmit}>
                <h1>로그인</h1>
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="text"
                        id="email"
                        value={state.email}
                        onChange={(e) => setState({ ...state, email: e.target.value })}
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
                        onChange={(e) => setState({ ...state, password: e.target.value })}
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
                >{state.error}</p>

                <button type="submit" className="submit-button"> 제출하기 </button>
            </form>
            <div className="link-container">
                <button
                    onClick={() => {
                        updateState('signUpEmail', '');
                        updateState('signUpPassword', '');
                        updateState('showSignUp', true);
                        updateState('showResetPassword', false);
                    }}
                > 회원가입 </button>
                <button
                    onClick={() => {
                        updateState('resetEmail', '');
                        updateState('showResetPassword', true);
                        updateState('showSignUp', false);
                    }}
                > 비밀번호 초기화 </button>
            </div>
        </div>
    );
}

export default Login;
