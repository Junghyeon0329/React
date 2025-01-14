import React, { useState } from 'react';
import axios from 'axios';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import AccountModal from '../Modal/AccountModal';
import InformModal from '../Modal/InformModal';
import './Login.css';

function Login() {
    const [state, setState] = useState({
        email: '', // 로그인 시 입력한 이메일
        password: '', // 로그인 시 입력한 비밀번호
        error: '', // 로그인 시 발생한 오류 메시지
        signUpError: '', // 회원가입 오류 메시지
        ResetError: '', // 비밀번호 리셋 오류 메시지
        showSignUp: false, // 회원가입 폼의 표시 여부
        showUserInfo: false, // 사원정보 폼의 표시 여부
    });

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const { user, loginUser, logoutUser } = useUser();

    // useEffect(() => {}, [loginUser]);

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
          if (!access || !refresh) {
            throw new Error('Access token or refresh token missing');
          }

          loginUser({ ...user, accessToken: access, refreshToken: refresh });      
        
          updateState('loggedInUser', user);
          updateState('error', '');
        } catch (error) {
          updateState('error', '이메일 또는 비밀번호가 잘못되었습니다.');
        }
    };
    const handleLogout = () => {
        logoutUser();
        updateState('email', ''); 
        updateState('password', '');
    };
    const openModal = () => {
        updateState('showUserInfo', true); 
        updateState('showSignUp', false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // 날짜가 없으면 'N/A' 반환
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' 형식
    };

    const fields = [
        { id: '사원번호', label: '사원번호', type: 'text', value: user?.username || 'N/A' },
        { id: '이메일', label: '이메일', type: 'email', value: user?.email || 'N/A' },
        { id: '등록일', label: '등록일', type: 'text', value: formatDate(user?.joinedDate) }, // 날짜 포맷팅 적용
    ];

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
            {user ? (
                <>
                {user.password_expired ? (
                   <h2 className="password-expired-message">비밀번호 변경이 필요합니다.</h2>
                ) : (
                    <h1>환영합니다!</h1>
                )}                
                    <div className="user-card">
                        <img
                            src={user?.avatar || '/images/person.svg'}
                            alt="User"
                            className={`user-avatar ${!user?.avatar ? 'no-avatar' : ''}`}
                        />
                        <p className="userstate">
                            {state.loggedInUser.email}
                        </p>
                        <div className="button-container">
                            <button className="user-info-btn" onClick={openModal}>사원 정보</button>
                            <button className="logout-btn" onClick={handleLogout}>로그 아웃</button>
                        </div>
                    </div>
                </>
            ) : (  // 로그인 상태가 아니라면 로그인 폼을 출력
                <>
                    <h1>로그인</h1> {/* 로그인되지 않았을 때 표시될 메시지 */}
                    <form onSubmit={handleSubmit}>
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
    
                        <button type="submit" className="submit-button">제출하기</button>
                    </form>
                </>
            )}
            
            {!user && (  // 로그인되지 않았을 때만 회원가입 및 비밀번호 초기화 버튼 보이기
                <div className="link-container">
                    <button
                        onClick={() => {
                            updateState('signUpEmail', '');
                            updateState('signUpPassword', '');
                            updateState('showSignUp', true);
                            updateState('showResetPassword', false);
                        }}
                    >
                        회원가입
                    </button>
                    <button
                        onClick={() => {
                            updateState('resetEmail', '');
                            updateState('showResetPassword', true);
                            updateState('showSignUp', false);
                        }}
                    >
                        비밀번호 초기화
                    </button>
                </div>
            )}
    
        
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
            {state.showUserInfo && (
                <InformModal
                title="사원 정보"
                fields={fields}
                onClose={() => updateState('showUserInfo', false)}
                />
            )}

        </div>

    );
}

export default Login;
