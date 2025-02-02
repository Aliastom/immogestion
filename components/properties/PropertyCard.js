function PropertyCard({ property, onClick, transactions }) {
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'loué': return 'bg-green-500';
      case 'disponible': return 'bg-blue-500';
      case 'en travaux': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'appartement': return 'building';
      case 'maison': return 'home';
      case 'commerce': return 'store';
      case 'garage': return 'warehouse';
      default: return 'building';
    }
  };

  // Récupérer la dernière transaction pour ce bien
  const lastTransaction = transactions
    .filter(t => t.propertyId === property.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const getTransactionColor = (type) => {
    return type === 'revenu' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div
      data-name="property-card"
      className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      <div className="relative pb-[75%]">
        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
            <i className={`fas fa-${getTypeIcon(property.type)} text-4xl text-gray-600`}></i>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <p className="text-gray-400 text-sm">{property.address}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(property.status)}`}>
            {property.status}
          </span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-purple-400">
              {property.price}
            </span>
            <span className="text-green-400 font-medium">
              {property.rentAmount}/mois
            </span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <i className={`fas fa-${getTypeIcon(property.type)} mr-2`}></i>
            <span>{property.type}</span>
            <span className="mx-2">•</span>
            <i className="fas fa-ruler-combined mr-2"></i>
            <span>{property.surface} m²</span>
            <span className="mx-2">•</span>
            <i className="fas fa-door-open mr-2"></i>
            <span>{property.rooms} pièces</span>
          </div>

          {lastTransaction && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <h4 className="text-sm text-gray-400 mb-1">Dernière transaction</h4>
              <div className="flex justify-between items-center">
                <span className={getTransactionColor(lastTransaction.type)}>
                  <i className={`fas fa-${lastTransaction.type === 'revenu' ? 'arrow-up' : 'arrow-down'} mr-2`}></i>
                  {formatCurrency(lastTransaction.amount)}
                </span>
                <span className="text-sm text-gray-400">
                  {formatDate(lastTransaction.date)}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{lastTransaction.category}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
