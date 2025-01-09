import React from 'react';
import axios from 'axios';
import './DownloadPaper.css';

function DownloadPaper() {
    const handleDownload = async (fileType) => {
        // try {
        //     const response = await axios.get(`http://localhost:5000/download/${fileType}`, {
        //         responseType: 'blob', // 응답을 blob(파일) 형식으로 받음
        //     });

        //     // 파일을 다운로드할 수 있도록 처리
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', `${fileType}.pdf`); // 파일명 설정
        //     document.body.appendChild(link);
        //     link.click(); // 다운로드 실행
        //     link.remove(); // 링크 제거
        // } catch (error) {
        //     console.error("파일 다운로드 중 오류가 발생했습니다.", error);
        // }
    };

    // 파일 항목 목록
    const files = [
        { name: '회의록', fileType: 'meeting-notes' },
        { name: '계획서', fileType: 'plan-document' },
        { name: '연구보고서', fileType: 'research-report' },        
        { name: '경비보고서', fileType: 'report' },
        { name: '휴가신청서', fileType: 'plan-2' },
        { name: '구매요청서', fileType: 'meeting-notes' },
        { name: '퇴직서/사직서', fileType: 'research-report' },
        { name: '비밀 유지 계약서', fileType: 'plan-document' },
        { name: '출장비 내역서', fileType: 'report' },
    ];

    return (
        <div className="grid-item DownloadPaper">
            <div className="file-list">
                {files.map((file) => (
                    <div
                        key={file.fileType}
                        className="file-item"
                        onClick={() => handleDownload(file.fileType)}
                    >
                        {file.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DownloadPaper;
