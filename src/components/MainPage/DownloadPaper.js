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
                params: { fileType },
                responseType: 'arraybuffer'
            });
            
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileType}.docx`); // 파일명 설정
            document.body.appendChild(link);
            link.click(); 
            link.remove();
    
        } catch (error) {
            console.error("파일 다운로드 중 오류가 발생했습니다.", error);
        }
    };

    // 파일 항목 목록
    const files = [
        { name: '회의록', fileType: 'meeting-notes'},
        { name: '공지문', fileType: 'notice-document'},
        { name: '계약서', fileType: 'contact-document'},     
        { name: '프로젝트 기획서', fileType: 'project-report'},        
        { name: '주간업무보고서', fileType: 'work-report'}, 
        { name: '연말결산보고서', fileType: 'settlement-report'},           
        { name: '실험보고서', fileType: 'experiment_report'},
        { name: '기본리포트1', fileType: 'basic_report1'},  
        { name: '기본리포트2', fileType: 'basic_report2'},
    ];

    return (
        <div className="grid-item DownloadPaper">
            <div className="Download-title">
                <h1>자료실</h1>
            </div>
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
