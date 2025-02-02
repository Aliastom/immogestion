function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  icon,
  disabled = false,
  className = ''
}) {
  const variants = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      data-name="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        font-medium
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <i className={`fas fa-${icon} ${children ? 'mr-2' : ''}`}></i>}
      {children}
    </button>
  );
}
