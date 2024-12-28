import React from 'react';

const FormModalShow = ({ title, fields, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {/* X 버튼 추가 */}
        <button className="close-button" onClick={onClose}>
          &times; {/* &times;는 'X' 문자 */}
        </button>

        <h2>{title}</h2>
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

export default FormModalShow;
