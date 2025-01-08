import React from 'react';
import './AccountModal.css';

// 회원가입, 비밀번호 찾기

const AccountModal = ({ title, fields, onSubmit, onClose, error }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times; 
        </button>

        <h2 className="modal-title">{title}</h2>
        <form onSubmit={onSubmit}>
          {fields.map((field, index) => (
            <div key={index} className="input-group">
              <label htmlFor={field.id} className="input-label">{field.label}</label>
              <input
                type={field.type}
                id={field.id}
                value={field.value}
                onChange={field.onChange}
                placeholder={field.placeholder}
                className="input-field"
              />
            </div>
          ))}

          <p className="error-message" style={{ visibility: error ? 'visible' : 'hidden' }}>
            {error}
          </p>

          <button type="submit" className="submit-button">제출</button>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
