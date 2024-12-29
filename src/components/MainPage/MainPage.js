import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/apiURLS';
import axiosInstance from '../../api/axiosInstance';
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
  const fetchAnnouncements = async (page) => {
    try {
      const response = await axiosInstance.get(API_URLS.NOTICE, {
        params: { page }  // page를 params로 전달
      });
  
      // 응답이 비었을 때 '내용 없음'을 넣어준다.
      if (!response.data.results || response.data.results.length === 0) {
        setAnnouncements([{ title: "내용 없음", description: "공지사항이 없습니다." }]);
      } else {
        setAnnouncements(response.data.results);
      }
  
      setAnnouncementTotalPages(response.data.total_pages);
      
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // 에러 발생 시에도 '내용 없음'을 넣어준다.
      setAnnouncements([{ title: "내용 없음", description: "공지사항을 불러오는 데 실패했습니다." }]);
    }
  };

  const fetchBoardPosts = async (page) => {
    try {
      const response = await axiosInstance.get(API_URLS.NOTICE, {
        params: { page }  // page를 params로 전달
      });
  
      // 응답이 비었을 때 '내용 없음'을 넣어준다.
      if (!response.data.results || response.data.results.length === 0) {
        setBoardPosts([{ title: "내용 없음", description: "등록글이 없습니다." }]);
      } else {
        setBoardPosts(response.data.results);
      }
  
      setBoardTotalPages(response.data.total_pages);
      
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // 에러 발생 시에도 '내용 없음'을 넣어준다.
      setBoardPosts([{ title: "내용 없음", description: "공지사항을 불러오는 데 실패했습니다." }]);
    }
  };
  
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
            <div className="announcements">       
              <div className="header">
                <h2>공지사항</h2>
                <button className="refresh-btn" onClick={refreshData}>
                  <img src="/images/refresh.svg" alt="refresh" />
                </button>
                <div className="pagination-container">
                  {createPagination(announcementPage, announcementTotalPages, setAnnouncementPage)}
                </div>
              </div>       
            
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
                  {announcements.length > 0 ? (
                    announcements.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.author}</td>
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
            </div>

            <div className="board-posts">
              <div className="header">
                <h2>게시판</h2>
                <button className="refresh-btn" onClick={refreshData}>
                  <img src="/images/refresh.svg" alt="refresh" />
                </button>
                <div className="pagination-container">
                  {createPagination(boardPage, boardTotalPages, setBoardPage)}
                </div>
              </div>
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
