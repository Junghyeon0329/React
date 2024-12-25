import React from 'react';

// 공통 입력폼 컴포넌트
const FormModal = ({ title, fields, onSubmit, onClose }) => (
  <div className="modal">
    <div className="modal-content">
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
            />
          </div>
        ))}
        <button type="submit">{title === "회원가입" ? "생성" : "전송"}</button>
        <button type="button" onClick={onClose}>닫기</button>
      </form>
    </div>
  </div>
);

export default FormModal;
