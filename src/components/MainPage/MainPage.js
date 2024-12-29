import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormModalShow from '../../components/FormModalShow'; // 모달 컴포넌트 임포트

function MainPage() {
  const { user, logoutUser } = useUser();
  const [currentPage, setCurrentPage] = useState('Home');
  const [announcements, setAnnouncements] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [boardPage, setBoardPage] = useState(1);
  const [announcementTotalPages, setAnnouncementTotalPages] = useState(1);
  const [boardTotalPages, setBoardTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // API 호출 함수
  // const fetchAnnouncements = async (page) => {
  //   try {
  //     const response = await axios.get(`/api/announcements?page=${page}`);
  //     setAnnouncements(response.data.results);
  //     setAnnouncementTotalPages(response.data.total_pages);
  //   } catch (error) {
  //     console.error('Failed to fetch announcements:', error);
  //   }
  // };
  const fetchAnnouncements = async (page) => {
    try {
      // 테스트용 더미 데이터 생성 (공지사항 10개)
      const dummyAnnouncements = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        title: `공지사항 ${index + 1}`,
        date: new Date().toISOString(),
      }));
      
      // 페이지 나누기 구현 (현재 페이지에 해당하는 항목만 반환)
      const results = dummyAnnouncements.slice((page - 1) * 5, page * 5); // 한 페이지당 5개 항목
      setAnnouncements(results);
      setAnnouncementTotalPages(Math.ceil(dummyAnnouncements.length / 5)); // 총 페이지 수 계산
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const fetchBoardPosts = async (page) => {
    try {
      const response = await axios.get(`/api/board-posts?page=${page}`);
      setBoardPosts(response.data.results);
      setBoardTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Failed to fetch board posts:', error);
    }
  };

  // const fetchBoardPosts = async (page) => {
  //   try {
  //     // 테스트용 더미 데이터 생성 (공지사항 10개)
  //     const dummyAnnouncements = Array.from({ length: 10 }, (_, index) => ({
  //       id: index + 1,
  //       title: `게시판 ${index + 1}`,
  //       date: new Date().toISOString(),
  //     }));
      
  //     // 페이지 나누기 구현 (현재 페이지에 해당하는 항목만 반환)
  //     const results = dummyAnnouncements.slice((page - 1) * 5, page * 5); // 한 페이지당 5개 항목
  //     setBoardPosts(results);
  //     setBoardTotalPages(Math.ceil(dummyAnnouncements.length / 5)); // 총 페이지 수 계산
  //   } catch (error) {
  //     console.error('Failed to fetch announcements:', error);
  //   }
  // };


  useEffect(() => {
    if (currentPage === 'Home') {
      fetchAnnouncements(announcementPage);
      fetchBoardPosts(boardPage);
    }
  }, [currentPage, announcementPage, boardPage]);

  // 로그아웃 함수
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
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
    if (!dateString) return 'N/A'; // 날짜가 없으면 'N/A' 반환
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD' 형식
  };

  // 유저 정보 폼 필드 구성
  const fields = [
    { id: '사원번호', label: '사원번호', type: 'text', value: user?.username || 'N/A' },
    { id: '이메일', label: '이메일', type: 'email', value: user?.email || 'N/A' },
    { id: '등록일', label: '등록일', type: 'text', value: formatDate(user?.joinedDate) }, // 날짜 포맷팅 적용
  ];

  // Pagination 버튼 생성
  const createPagination = (currentPage, totalPages, setPage) => (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => setPage((prev) => prev - 1)}>
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={currentPage === i + 1 ? 'active' : ''}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => setPage((prev) => prev + 1)}>
        &gt;
      </button>
    </div>
  );

  // 새로고침 함수
  const refreshData = () => {
    fetchAnnouncements(announcementPage);
    fetchBoardPosts(boardPage);
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="user-card">
          <img
            src={user?.avatar || '/images/person.svg'}
            alt="User"
            className={`user-avatar ${!user?.avatar ? 'no-avatar' : ''}`}
          />
          <p className="user-info">{user?.email || 'GUEST'}</p>
          {user && (
            <div className="button-container">
              <button className="user-info-btn" onClick={openModal}>
                사원 정보
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                로그 아웃
              </button>
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
        {currentPage === 'Home' && (
          <div className="home-sections">

            <div className="header">
              <h2>공지사항</h2>
              <button className="refresh-btn" onClick={refreshData}>
              <img src="/images/refresh.svg" alt="refresh" />
              </button>
            </div>

            <div className="announcements">              
            
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length > 0 ? (
                    announcements.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{new Date(item.date).toLocaleDateString('en-CA')}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-content">
                      <td colSpan="3">작성 내역 없음</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="pagination-container top">
                {createPagination(announcementPage, announcementTotalPages, setAnnouncementPage)}
              </div>
            </div>

            <div className="header">
              <h2>게시판</h2>
              <button className="refresh-btn" onClick={refreshData}>
              <img src="/images/refresh.svg" alt="refresh" />
              </button>
            </div>
            <div className="board-posts">
            
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                  </tr>
                </thead>

                <tbody>
                  {boardPosts.length > 0 ? (
                    boardPosts.map((post) => (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.author}</td>
                        <td>{new Date(post.date).toLocaleDateString('en-CA')}</td>
                      </tr>
                    ))
                  ) : (
                  <tr className="no-content">
                    <td colSpan="4">작성 내역 없음</td>
                  </tr>
                  )}
                </tbody>


              </table>
              <div className="pagination-container top">
                {createPagination(boardPage, boardTotalPages, setBoardPage)}
              </div>
            </div>
          </div>
          )}
        </div>

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
