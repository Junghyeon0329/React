import React from 'react';
import './AccountModal.css';

const FormModal = ({ title, fields, onSubmit, onClose, error }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times; 
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
                className="input-field"
              />
            </div>
          ))}

          <p
            style={{
              color: 'red',
              minHeight: '20px',
              marginTop: '10px',
              visibility: error ? 'visible' : 'hidden',
            }}
          >
            {error}
          </p>

          <button type="submit" className="submit-button">제출</button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
