import React, { useState } from 'react';
import './MainPage.css';
import { useUser } from '../../contexts/UserContext';
import FormModalShow from '../FormModalShow';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const { user, logoutUser } = useUser();
  const [currentPage, setCurrentPage] = useState('Home');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const navigate = useNavigate();

  const getPageContent = () => {
    switch (currentPage) {
      case 'Home':
        return {
          title: 'Welcome Home',
          description: 'Experience a modern and sleek dashboard.',
        };
      case 'Board':
        return {
          title: 'Discussion Board',
          description: 'Join the conversation and share your thoughts.',
        };
      case 'Contact':
        return {
          title: 'Contact Us',
          description: 'Reach out to us for support or inquiries.',
        };
      default:
        return {
          title: 'Welcome Home',
          description: 'Experience a modern and sleek dashboard.',
        };
    }
  };

  const content = getPageContent();

  // 로그아웃 함수
  const handleLogout = () => {
    logoutUser();
    navigate('/login');  // 로그인 페이지로 리다이렉트
  };

  // 유저 정보 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 유저 정보 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // joinedDate 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';  // 날짜가 없으면 'N/A' 반환
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');  // 'YYYY-MM-DD' 형식
  };

  // 유저 정보 폼 필드 구성
  const fields = [
    { id: '사원번호', label: '사원번호', type: 'text', value: user?.username || 'N/A' },
    { id: '이메일', label: '이메일', type: 'email', value: user?.email || 'N/A' },    
    { id: '등록일', label: '등록일', type: 'text', value: formatDate(user?.joinedDate) },  // 날짜 포맷팅 적용
  ];

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="user-card">
        <img
          src={user?.avatar && user?.avatar !== "" ? user.avatar : '/images/person.svg'}
          alt="User"
          className={`user-avatar ${!user?.avatar || user?.avatar === "" ? 'no-avatar' : ''}`}  // avatar가 없을 경우 'no-avatar' 클래스 추가
        />
          <p className="user-info">{user?.email || 'GUEST'}</p>

          {user && (
            <div className="button-container">
              <button className="user-info-btn" onClick={openModal}>사원 정보</button>
              <button className="logout-btn" onClick={handleLogout}>로그 아웃</button>
            </div>
          )}
        </div>
        <nav>
          <ul>
            <li>
              <button onClick={() => setCurrentPage('Home')}>Home</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('Board')}>Board</button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('Contact')}>Contact</button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="content">
        <div className="content-inner">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </div>

      {/* User Info Modal (read-only) */}
      {isModalOpen && (
        <FormModalShow
          title="사원 정보"
          fields={fields}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default MainPage;