import React, { useState } from 'react';
import './MainPage.css';
import { useUser } from '../../contexts/UserContext'; // UserContext import

function MainPage() {
  const { user } = useUser(); // UserContext에서 유저 정보 가져오기
  const [currentPage, setCurrentPage] = useState('Home');

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

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-card">
          <img
            src={user?.avatar || 'https://via.placeholder.com/100'} // 유저 아바타 표시
            alt="User"
            className="user-avatar"
          />
          <p className="user-info">{user?.email || 'GUEST'}</p> {/* 유저 이메일 표시 */}
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

      {/* Main Content */}
      <div className="content">
        <div className="content-inner">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
