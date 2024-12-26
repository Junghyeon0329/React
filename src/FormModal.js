import React from 'react';

const FormModal = ({ title, fields, onSubmit, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {/* X 버튼 추가 */}
        <button className="close-button" onClick={onClose}>
          &times; {/* &times;는 'X' 문자 */}
        </button>

        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          {fields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                className="input-field" // 동일한 클래스 적용
              />
            </div>
          ))}
          <button type="submit" className="submit-button">제출</button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;

