import React, { useState } from 'react';
import './MainPage.css';

function MainPage() { // 이름을 대문자로 변경
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
            src="https://via.placeholder.com/100"
            alt="User"
            className="user-avatar"
          />
          <h2 className="user-name">John Doe</h2>
          <p className="user-info">john.doe@example.com</p>
        </div>
        <nav>
            <ul>
                <li><button onClick={() => setCurrentPage('Home')}>Home</button></li>
                <li><button onClick={() => setCurrentPage('Board')}>Board</button></li>
                <li><button onClick={() => setCurrentPage('Contact')}>Contact</button></li>
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
