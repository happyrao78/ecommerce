// Modal.js
import React from 'react';

const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;
     // Do not render the modal if not visible

    return (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <button
                    className="absolute top-2 right-2 text-xl font-bold"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
