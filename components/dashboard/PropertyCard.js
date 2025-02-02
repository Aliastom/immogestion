function PropertyCard({ title, address, price, status }) {
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'loué': return 'bg-green-500';
      case 'disponible': return 'bg-blue-500';
      case 'en travaux': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div data-name="property-card" className="bg-gray-700 rounded-lg p-4 flex items-center">
      <div className="h-16 w-16 bg-gray-600 rounded-lg mr-4"></div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{address}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-purple-400">{price}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
