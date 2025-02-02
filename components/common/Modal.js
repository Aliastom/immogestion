function Modal({ children, onClose }) {
  return (
    <div 
      data-name="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
