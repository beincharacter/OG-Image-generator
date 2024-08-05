import React from 'react';

export function Notification({ message, type, onClose }) {
    return (
        <div className={`notification ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">x</button>
        </div>
    );
}
