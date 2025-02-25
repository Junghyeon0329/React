import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import API_URLS from '../../api/apiURLS';
import { useUser } from '../../contexts/UserContext';
import './Announce.css';
import InformModal from '../Modal/InformModal';
import AccountModal from '../Modal/AccountModal';

function Announce() {
	const [state, setState] = useState({
		email: '', // 로그인 시 입력한 이메일
		password: '', // 로그인 시 입력한 비밀번호
		error: '', // 로그인 시 발생한 오류 메시지
		announcements: [], // 공지사항 리스트
		announcementPage: 1, // 현재 페이지
		announcementTotalPages: 1, // 전체 페이지 수		
		selectedNotice: false, // 선택된 공지사항
		NoticeCreate: false, // 공지사항 작성
		searchQuery: '', //공지사항 검색
		debouncedQuery: '', // 디바운싱된 검색어

		NoticeTitle: '', // (작성중)공지사항 제목
		NoticeContent: '', // (작성중)공지사항 내용
	});

	// 상태 업데이트 함수
	const updateState = (key, value) => {
		setState((prev) => ({ ...prev, [key]: value }));
	};

	const { user } = useUser();

	const fetchAnnouncements = useCallback(async (page, query = '') => {
		try {

			const response = await axiosInstance.get(API_URLS.NOTICE, {
				params: { page, query } // 검색어가 있으면 포함
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
	}, []);

	const createPagination = (currentPage, totalPages, setPage) => (
		<div className="pagination">
			<button
				disabled={currentPage === 1}
				onClick={() => {
					const newPage = Math.max(currentPage - 1, 1);
					updateState('announcementPage', newPage);
					fetchAnnouncements(newPage); // 페이지 변경 시 공지사항 재로딩
				}}
			>
				&lt;
			</button>
			<button
				disabled={currentPage === Math.ceil(totalPages / 5) || totalPages === 0}
				onClick={() => {
					const newPage = Math.min(currentPage + 1, Math.ceil(totalPages / 5));
					updateState('announcementPage', newPage);
					fetchAnnouncements(newPage); // 페이지 변경 시 공지사항 재로딩
				}}
			>
				&gt;
			</button>
		</div>
	);

	const refreshData = () => {
		if (state.searchQuery) {
			fetchAnnouncements(state.announcementPage, state.searchQuery);
		} else {
			fetchAnnouncements(state.announcementPage);
		}
	};
	useEffect(() => {
		const handler = setTimeout(() => {
			updateState('debouncedQuery', state.searchQuery);
		}, 1000);
		return () => {
			clearTimeout(handler);
		};
	}, [state.searchQuery]);

	useEffect(() => {
		const fetchResults = async () => {
			if (state.debouncedQuery) {
				try {
					const response = await axiosInstance.get(API_URLS.NOTICE, {
						params: { query: state.debouncedQuery }
					});
					updateState('announcements', response.data.results); // 검색 결과 저장
				} catch (error) {
					console.error('Error fetching notices:', error);
					updateState('error', '공지사항을 불러오는 데 실패했습니다.');
				}
			} else {
				fetchAnnouncements(state.announcementPage);
			}
		};

		fetchResults();
	}, [state.debouncedQuery, fetchAnnouncements, state.announcementPage]);

	const openNoticeModal = (notice) => {
		const fields = [
			{ label: '제목', value: notice.title },   // 공지사항 제목
			{ label: '내용', value: notice.content },  // 공지사항 내용
			{ id: notice.id, label: 'ID', value: notice.id },
		];
		updateState('selectedNotice', fields);
	};
	const openCreateModal = () => {
		updateState('error', '');
		const fields = [
			{ label: '제목', value: '' },
			{ label: '내용', value: '' },
		];
		updateState('NoticeCreate', fields);
	};

	const handleNoticeSubmit = async (e) => {
		e.preventDefault();
		if (state.NoticeTitle === '' || state.NoticeContent === '') {
			updateState('error', '제목과 내용을 모두 입력해주세요.');
			return;
		}

		try {
			await axiosInstance.post(API_URLS.NOTICE, { title: state.NoticeTitle, content: state.NoticeContent });
			alert('공지사항 작성 성공!');
			fetchAnnouncements(state.announcementPage);

			updateState('NoticeCreate', false)
		} catch (error) {
			alert('공지사항 작성 실패');
		}
	};

	const handleDeleteNotice = async (noticeId) => {
		try {
			await axiosInstance.delete(`${API_URLS.NOTICE}`, {
				data: { board_id: noticeId }
			});
			alert('공지사항 삭제 성공!');
			fetchAnnouncements(state.announcementPage);
			updateState('selectedNotice', false);
		} catch (error) {
			alert('공지사항 삭제 실패');
		}
	};

	useEffect(() => {
		fetchAnnouncements(state.announcementPage);
	}, [fetchAnnouncements, state.announcementPage]);

	return (
		<div className="grid-item Announce">
			<div className="Notice-container">
				<h1>공지사항</h1>

				{/* 새로고침 */}
				<button className="common-btn refresh-btn" onClick={refreshData}>
					<img src="/images/refresh.svg" alt="refresh" />
				</button>

				{/* 공지사항 작성(관리자) */}
				{user?.staff && (
					<button className="common-btn create-btn" onClick={() => {
						updateState('NoticeTitle', '');
						updateState('NoticeContent', '');
						openCreateModal();
					}}>
						<img src="/images/writing.svg" alt="writing" />
					</button>
				)}

				<div className="search-container">
					{/* 공지사항 검색창 */}
					<input
						type="text"
						value={state.searchQuery}
						onChange={(e) => updateState('searchQuery', e.target.value)}
						placeholder="검색"
						className="search-input"
					/>
					{/* 공지사항 페이지 */}
					{createPagination(state.announcementPage, state.announcementTotalPages, updateState)}
				</div>
			</div>
			{/* 테이블 내용 */}
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
					{state.announcements
						.slice()
						.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
						.map((item, index) => (
							<tr 
								key={item.id} 
								onClick={() => openNoticeModal(item)} 
								style={{ cursor: 'pointer' }}
							>
								<td>{(state.announcementPage - 1) * 5 + index + 1}</td>
								<td>{item.title}</td>
								<td>{item.author_email}</td>
								<td>{new Date(item.created_at).toLocaleDateString('en-CA')}</td>
							</tr>
						))
					}
				</tbody>
			</table>



			{state.selectedNotice && (
				<InformModal
					title="공지사항"
					fields={state.selectedNotice}
					onClose={() => updateState('selectedNotice', false)}
					isAdmin={user?.staff}
					onDelete={() => handleDeleteNotice(state.selectedNotice[2]?.value)}
				/>
			)}
			{state.NoticeCreate && (
				<AccountModal
					title="공지사항 작성"
					fields={[
						{
							id: 'NoticeTitle',
							label: '공지사항 제목',
							type: 'title',
							value: state.NoticeTitle,
							placeholder: '공지사항 제목을 입력하세요',
							onChange: (e) => updateState('NoticeTitle', e.target.value)
						},
						{
							id: 'NoticeContent',
							label: '공지사항 내용',
							type: 'Content',
							value: state.NoticeContent,
							placeholder: '공지사항 내용을 입력하세요',
							onChange: (e) => updateState('NoticeContent', e.target.value)
						}
					]}
					onSubmit={handleNoticeSubmit}
					onClose={() => {
						updateState('NoticeCreate', false);
						updateState('error', '');
					}}
					error={state.error}
				/>
			)}


		</div>
	);
}

export default Announce;
