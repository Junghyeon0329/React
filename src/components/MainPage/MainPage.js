import React, { useState, useEffect } from 'react';
import './MainPage.css';
import './Calendar.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/apiURLS';
import axiosInstance from '../../api/axiosInstance';
import FormModalShow from '../../components/FormModalShow'; // 모달 컴포넌트 임포트
import Calendar from 'react-calendar'; // react-calendar 임포트

function MainPage() {
  const { user, logoutUser } = useUser();
  const [currentPage, setCurrentPage] = useState('Home');
  const [announcements, setAnnouncements] = useState([]);
  
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [announcementTotalPages, setAnnouncementTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null); // 선택된 공지사항 상태
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
  
      setAnnouncementTotalPages(response.data.total_count);
      
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      // 에러 발생 시에도 '내용 없음'을 넣어준다.
      setAnnouncements([{ title: "내용 없음", description: "공지사항을 불러오는 데 실패했습니다." }]);
    }
  };

  const createPagination = (currentPage, totalPages, setPage) => (
    <div className="pagination">
      <button 
        disabled={currentPage === 1} 
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))} // currentPage가 1보다 적으면 1로 설정
      >
        &lt;
      </button>
      <button 
        disabled={currentPage === Math.ceil(totalPages / 5) || totalPages === 0} 
        onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(totalPages / 5)))}
      >
        &gt;
      </button>
    </div>
  );

  useEffect(() => {
    if (currentPage === 'Home') {
      fetchAnnouncements(announcementPage);
    }
  }, [currentPage, announcementPage]);

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
  };

  const openNoticeModal = (notice) => {
    const fields = [
      { label: '제목', value: notice.title },   // 공지사항 제목
      { label: '내용', value: notice.content },  // 공지사항 내용
    ];
    setSelectedNotice(fields);  // fields 배열을 상태에 저장
  };

  // 날짜 선택 핸들러
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate); // 달력에서 선택된 날짜 업데이트
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
            <div className="calendar-container">
              <Calendar
                onChange={onChange}
                value={date}
                showNeighboringMonth={false}
                view="month"  // 월 단위 보기
                locale="ko-KR"  // 한국어 로케일로 설정
                tileClassName="react-calendar__tile"  // 날짜 타일의 기본 클래스
                calendarType="gregory" // 일요일부터 시작하도록 설정
              />
            </div>

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
                      <tr key={item.id} onClick={() => openNoticeModal(item)}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>
                          {item.author_email === "admin" ? "관리자" : item.author_email}
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString('en-CA')}</td>
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
      {selectedNotice  && (
        <FormModalShow
        title="공지사항"
        fields={selectedNotice}
        onClose={() => setSelectedNotice(null)} // 모달 닫기
        />
      )}
    </div>
  );
}

export default MainPage;
