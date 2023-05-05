import React from 'react';

const Modal = ({ title, children, modalOpen = false, setModalOpen }) => {
  return (
    <div>
      <input
        type='checkbox'
        checked={modalOpen}
        onChange={() => setModalOpen(!modalOpen)}
        className='modal-toggle'
      />
      <div className='modal'>
        <div className='relative modal-box'>
          <label
            onClick={() => setModalOpen(!modalOpen)}
            className='absolute btn btn-sm btn-circle right-2 top-2'>
            ✕
          </label>
          <h3 className='text-lg font-bold'>{title}</h3>
          <p className='py-4'>{children}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
