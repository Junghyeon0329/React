import React, { useState, useEffect } from 'react';
import './MainPage.css';
import './Calendar.css';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import API_URLS from '../../api/apiURLS';
import axiosInstance from '../../api/axiosInstance';
import FormModalShow from '../../components/FormModalShow'; 
import FormModal from '../../components/FormModal'; 
import Calendar from 'react-calendar'; 
import moment from 'moment';


// import Sidebar from './Sidebar';

function MainPage() {
  const { user, logoutUser } = useUser();
  const [currentPage, setCurrentPage] = useState('Home');
  const [announcements, setAnnouncements] = useState([]);
  
  const [announcementPage, setAnnouncementPage] = useState(1);
  const [announcementTotalPages, setAnnouncementTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(false); 
  const [isCreateMode, setIsCreateMode] = useState(false);

  const [NoticeTitle, setAnnouncementTitle] = useState('');
  const [NoticeContent, setAnnouncementContent] = useState('');

  const navigate = useNavigate();

  const fetchAnnouncements = async (page) => {
    try {
      const response = await axiosInstance.get(API_URLS.NOTICE, {
        params: { page } 
      });

      if (!response.data.results || response.data.results.length === 0) {
        setAnnouncements([{ title: "내용 없음", description: "공지사항이 없습니다." }]);
      } else {
        setAnnouncements(response.data.results);
      }
  
      setAnnouncementTotalPages(response.data.total_count);
      
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([{ title: "내용 없음", description: "공지사항을 불러오는 데 실패했습니다." }]);
    }
  };

  const createPagination = (currentPage, totalPages, setPage) => (
    <div className="pagination">
      <button 
        disabled={currentPage === 1} 
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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

  // 공지사항 작성 모드 시작
  const openCreateModal = () => {
    const fields = [
      { label: '제목', value: ''},
      { label: '내용', value: ''},
    ];
    setIsCreateMode(fields);  // fields 배열을 상태에 저장
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (NoticeTitle === '' || NoticeContent === '') {
      alert('공지사항 제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await axiosInstance.post(API_URLS.NOTICE, { title: NoticeTitle, content: NoticeContent });
      alert('공지사항 작성 성공!');
      setIsCreateMode(false);
    } catch (error) {
      alert('공지사항 작성 실패');
    }
  };

  // 날짜 선택 핸들러
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate); // 달력에서 선택된 날짜 업데이트
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <nav>
          <ul>
            <li>
              <button onClick={() => setCurrentPage('Home')}>One-Que</button>
            </li>
          </ul>
        </nav>
        <div className="user-card">
          <img
            src={user?.avatar || '/images/person.svg'}
            alt="User"
            className={`user-avatar ${!user?.avatar ? 'no-avatar' : ''}`}
          />
          <p className="user-info">{user?.email || 'GUEST'}</p>
          {user && (
            <div className="button-container">
              <button className="user-info-btn" onClick={openModal}> 사원 정보 </button>
              <button className="logout-btn" onClick={handleLogout}> 로그 아웃 </button>
            </div>
          )}
        </div>
        
        <div className="calendar-container">
          <Calendar
            onChange={onChange}
            value={date}
            formatDay={(local, date) => moment(date).format("D")}
            showNeighboringMonth={false}
            view="month"
            locale="ko-KR"
            tileClassName="react-calendar__tile"
            calendarType="gregory"
          /> 
        </div>
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
                {user?.staff && (
                  <button className="create-btn" onClick={() => {
                    setAnnouncementTitle('')
                    setAnnouncementContent('')
                    openCreateModal();
                  }}>
                    <img src="/images/writing.svg" alt="writing" />
                  </button>
                )}
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
                    // 작성일 기준 내림차순 정렬
                    announcements
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // created_at 기준으로 내림차순 정렬
                      .map((item, index) => (
                        <tr key={item.id} onClick={() => openNoticeModal(item)}>
                          <td>{(announcementPage - 1) * 5 + index + 1}</td> {/* 번호 부여 */}
                          <td>{item.title}</td>
                          <td>
                            {item.author_email === "admin" ? "관리자" : item.author_email}
                          </td>
                          <td>{new Date(item.created_at).toLocaleDateString('en-CA')}</td>
                        </tr>
                      ))
                  ) : (
                    <tr className="no-content">
                      <td colSpan="4">작성 내역 없음</td> {/* colspan 수정 */}
                    </tr>
                  )}
                </tbody>
              </table> 
              
            </div>
            
            <div className='web-contain'> 
              <div className="header">
                <h2>웹 컨테이너</h2>
              </div>
            </div>
          </div>
          )}
        </div>

      {isModalOpen && (
        <FormModalShow
          title="사원 정보"
          fields={fields}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {selectedNotice  && (
        <FormModalShow
        title="공지사항"
        fields={selectedNotice}
        onClose={() => setSelectedNotice(false)} // 모달 닫기
        />
      )}
            
      {isCreateMode && (
        <FormModal
          title="공지사항 작성"
          fields={[
            {
              id: 'NoticeTitle',
              label: '공지사항 제목',
              type: 'title',
              value: NoticeTitle,
              placeholder: '공지사항 제목을 입력하세요',
              onChange: (e) => setAnnouncementTitle(e.target.value)
            },
            {
              id: 'NoticeContent',
              label: '공지사항 내용',
              type: 'Content',
              value: NoticeContent,
              placeholder: '공지사항 내용을 입력하세요',
              onChange: (e) => setAnnouncementContent(e.target.value)
            }
          ]}
          onSubmit={handleSignUpSubmit}
          onClose={() => setIsCreateMode(false)}

        />
      )}
    </div>


  // <div className="main-container2">
  //   <Sidebar
  //     user={user}
  //     onLogout={handleLogout}
  //     onOpenModal={() => setCurrentPage('UserInfo')}
  //     date={date}
  //     onDateChange={setDate}
  //   />

  //   <div className="content">
  //     {currentPage === 'Home' && <Announce user={user} />}
  //   </div>
  // </div>
  );
}

export default MainPage;