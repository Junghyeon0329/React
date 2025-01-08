import React from 'react';
import './InformModal.css'; // CSS 파일을 별도로 분리하여 스타일 적용

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
          {fields.map((field, index) => (
            <div key={index} className="field-container">
              <label htmlFor={field.id} className="field-label">
                {field.label}
              </label>
              <p className="field-value">{field.value || "정보 없음"}</p> {/* 텍스트로 값 표시 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformModal;
