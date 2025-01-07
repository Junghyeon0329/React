import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import AccountModal from '../Modal/AccountModal';

function Login() {
    const [state, setState] = useState({
        email: '', // 로그인 시 입력한 이메일
        password: '', // 로그인 시 입력한 비밀번호
        error: '', // 로그인 시 발생한 오류 메시지
        signUpError: '', // 회원가입 오류 메시지
        ResetError: '', // 비밀번호 리셋 오류 메시지
        showSignUp: false, // 회원가입 폼의 표시 여부
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

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
    
        const { signUpEmail, signUpPassword } = state;
    
        if (signUpEmail === '' || signUpPassword === '') {
            updateState('signUpError', '필수항목을 모두 입력해주세요.');
            return;
        }
    
        try {
            await axios.post(API_URLS.USER, { email: signUpEmail, password: signUpPassword });
            alert('회원가입 성공!');
            updateState('showSignUp', false);
            updateState('signUpError', '');
        } catch (error) {
            updateState('signUpError', '사용할 수 없는 이메일입니다.');
        }
      };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();

        const { resetEmail } = state;

        if (resetEmail === '') {
            updateState('ResetError', '이메일을 입력해주세요.');
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

                <p className={`error-message ${state.error ? 'visible' : ''}`}>
                    {state.error}
                </p>

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
    
        {state.showSignUp && (
            <AccountModal
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
            error={state.signUpError} // 오류 메시지 전달
            />
        )}
        {state.showResetPassword && (
            <AccountModal
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
            error={state.ResetError} // 오류 메시지 전달
            />
        )}

        </div>

    );
}

export default Login;
