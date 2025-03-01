import React from 'react';
import './AnnounceWriting.css';

const AnnounceWriting = ({ title, fields, onSubmit, onClose, error }) => {
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
                        const hasError = error === field.id;
                        const fieldClass = field.label === "공지사항 내용" && title === "공지사항 작성" ? 
                                "content-field" : "";
                        return (
                            <div key={index} className={`field-container ${hasError ? 'error' : ''} ${fieldClass}`}>
                                <label htmlFor={field.id} className="field-label">
                                    {field.label}
                                </label>
                                <textarea
                                    type="text"
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className={`field-input ${hasError ? 'input-error' : ''}`}
                                />
                                {hasError && <p className="error-message">이 필드는 필수입니다.</p>}
                            </div>
                        );
                    })}
                    <button className="submit-button" onClick={onSubmit}>제출하기</button>
                </div>
            </div>
        </div>

    );
};

export default AnnounceWriting;
