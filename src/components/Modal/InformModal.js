import React from 'react';
import './InformModal.css'; 

const InformModal = ({ title, fields, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {/* X 버튼 추가 */}
        <button className="close-button" onClick={onClose}>
          &times; {/* &times;는 'X' 문자 */}
        </button>

        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">
          {fields.map((field, index) => {
            const fieldClass = field.label === "내용" && title === "공지사항" ? "content-field" : "";
            return (
              <div key={index} className="field-container">
                <label htmlFor={field.id} className="field-label">
                  {field.label}
                </label>
                <p className={`field-value ${fieldClass}`}>
                  {field.value || "정보 없음"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InformModal;
