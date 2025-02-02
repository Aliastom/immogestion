function Alert({ type = 'info', message, onClose }) {
  const types = {
    success: {
      bg: 'bg-green-500',
      icon: 'check-circle'
    },
    error: {
      bg: 'bg-red-500',
      icon: 'exclamation-circle'
    },
    warning: {
      bg: 'bg-yellow-500',
      icon: 'exclamation-triangle'
    },
    info: {
      bg: 'bg-blue-500',
      icon: 'info-circle'
    }
  };

  return (
    <div data-name="alert" className={`${types[type].bg} bg-opacity-10 border border-${types[type].bg} rounded-lg p-4 mb-4`}>
      <div className="flex items-center">
        <i className={`fas fa-${types[type].icon} ${types[type].bg} bg-opacity-20 p-2 rounded-full mr-3`}></i>
        <div className="flex-1">{message}</div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
}
