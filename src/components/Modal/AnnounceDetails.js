import React from 'react';
import './AnnounceDetails.css'; 

const AnnounceDetails = ({ title, fields, onClose, isAdmin, onDelete }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {title}
          </h2>
          <button className="close-button" onClick={onClose}>
            &times; {/* X 버튼 */}
          </button>
        </div>

        <div className="modal-body">
          {fields.map((field, index) => {
            if (field.label === 'ID') return null; // 테이블 번호            
            const fieldClass = field.label === "내용" && title === "공지사항" ? "content-field" : "";

            return (
              <div key={index} className="field-container">
                <label htmlFor={field.id} className="field-label">
                  {field.label}
                </label>
                <p className={`field-value ${fieldClass}`}>
                  {field.value || "내용 없음"}
                </p>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <div className="modal-footer">
            <button className="delete-button" onClick={onDelete}>
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnounceDetails;
