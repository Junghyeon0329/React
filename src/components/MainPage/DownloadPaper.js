import React from 'react';
import { useUser } from '../../contexts/UserContext';
import axiosInstance from '../../api/axiosInstance';
import API_URLS from '../../api/apiURLS';
import './DownloadPaper.css';

function DownloadPaper() {
    
    const { user } = useUser();

    const handleDownload = async (fileType) => {
        
        if (!user) {
            alert("로그인 후 사용 가능한 기능입니다.");
            return;
        }
        try {
            const response = await axiosInstance.get(API_URLS.FILE, {
                params: { fileType }
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileType}.csv`); // 파일명 설정
            document.body.appendChild(link);
            link.click(); 
            link.remove();

        } catch (error) {
            console.error("파일 다운로드 중 오류가 발생했습니다.", error);
        }
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
