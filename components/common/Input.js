function Input({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  name,
  children,
  className = '' 
}) {
  const renderInput = () => {
    const baseClasses = "w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600";

    if (type === 'select') {
      return (
        <select
          value={value}
          onChange={onChange}
          required={required}
          name={name}
          className={baseClasses}
        >
          {children}
        </select>
      );
    }

    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        className={baseClasses}
      />
    );
  };

  return (
    <div data-name="input-field" className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-gray-400 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
