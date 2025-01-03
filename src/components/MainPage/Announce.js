import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import './Announce.css';

function Announce() {
    const [state, setState] = useState({
        email: '', // 로그인 시 입력한 이메일
        password: '', // 로그인 시 입력한 비밀번호
        error: '', // 로그인 시 발생한 오류 메시지
    });

    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const { loginUser } = useUser();

    const { user, logoutUser } = useUser();
    const [announcements, setAnnouncements] = useState([]);
    const [announcementPage, setAnnouncementPage] = useState(1);
    const [announcementTotalPages, setAnnouncementTotalPages] = useState(1);
    const [NoticeTitle, setAnnouncementTitle] = useState('');
    const [NoticeContent, setAnnouncementContent] = useState('');

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

    const refreshData = () => {
        fetchAnnouncements(announcementPage);
    };

    return (
        <div className="grid-item Announce">     
            <div className="Notice-title">
                <h2>공지사항</h2>
                    <button className="refresh-btn" onClick={refreshData}>
                        <img src="/images/refresh.svg" alt="refresh" />
                    </button>
                    {user?.staff && (
                        <button className="create-btn" onClick={() => {
                            setAnnouncementTitle('')
                            setAnnouncementContent('')
                            // openCreateModal();
                        }}> <img src="/images/writing.svg" alt="writing" /> </button>
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
                    announcements
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((item, index) => (
                        // <tr key={item.id} onClick={() => openNoticeModal(item)}>
                        <tr key={item.id} >
                        <td>{(announcementPage - 1) * 5 + index + 1}</td> 
                        <td>{item.title}</td>
                        <td>
                            {item.author_email === "admin" ? "관리자" : item.author_email}
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString('en-CA')}</td>
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
    )}

    export default Announce;