import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import './Announce.css';

function Announce() {
    // state 객체로 모든 상태 관리
    const [state, setState] = useState({
        email: '', // 로그인 시 입력한 이메일
        password: '', // 로그인 시 입력한 비밀번호
        error: '', // 로그인 시 발생한 오류 메시지
        announcements: [], // 공지사항 리스트
        announcementPage: 1, // 현재 페이지
        announcementTotalPages: 1, // 전체 페이지 수
        NoticeTitle: '', // 공지사항 제목
        NoticeContent: '', // 공지사항 내용
    });

    // 상태 업데이트 함수
    const updateState = (key, value) => {
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const { user } = useUser();

    const fetchAnnouncements = async (page) => {
        try {
            const response = await axiosInstance.get(API_URLS.NOTICE, {
                params: { page }
            });

            if (!response.data.results || response.data.results.length === 0) {
                updateState('announcements', [{ title: "내용 없음", description: "공지사항이 없습니다." }]);
            } else {
                updateState('announcements', response.data.results);
            }

            updateState('announcementTotalPages', response.data.total_count);

        } catch (error) {
            console.error('Failed to fetch announcements:', error);
            updateState('announcements', [{ title: "내용 없음", description: "공지사항을 불러오는 데 실패했습니다." }]);
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
        fetchAnnouncements(state.announcementPage);
    };

    useEffect(() => {
        fetchAnnouncements(state.announcementPage); // 처음 컴포넌트가 마운트될 때 데이터 가져오기
    }, []); // 빈 배열([])을 넣어 컴포넌트가 처음 렌더링될 때만 호출되도록 함

    return (
        <div className="grid-item Announce">     
            <div className="Notice-title">
                <h1>공지사항</h1>
                <button className="refresh-btn" onClick={refreshData}>
                    <img src="/images/refresh.svg" alt="refresh" />
                </button>
                {user?.staff && (
                    <button className="create-btn" onClick={() => {
                        updateState('NoticeTitle', '');
                        updateState('NoticeContent', '');
                        // openCreateModal();
                    }}> 
                        <img src="/images/writing.svg" alt="writing" /> 
                    </button>
                )}
                <div className="pagination-container">
                    {createPagination(state.announcementPage, state.announcementTotalPages, updateState)}
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
                    {state.announcements.length > 0 ? (
                        state.announcements
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((item, index) => (
                            <tr key={item.id} >
                                <td>{(state.announcementPage - 1) * 5 + index + 1}</td> 
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
    );
}

export default Announce;
