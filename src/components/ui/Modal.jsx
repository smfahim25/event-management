// src/components/ui/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black overflow-y-scroll bg-opacity-50 flex items-center justify-center  z-50">
      <div className="bg-white  rounded-lg shadow-lg p-6 max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
