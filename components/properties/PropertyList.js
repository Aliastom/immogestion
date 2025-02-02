function PropertyList({ properties, onSelect, transactions }) {
  return (
    <div data-name="property-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => {
        // Récupérer la dernière transaction pour cette propriété
        const lastTransaction = transactions
          .filter(t => t.propertyId === property.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        return (
          <div
            key={property.id}
            onClick={() => onSelect(property)}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
          >
            <div className="relative pb-[75%] bg-gray-700">
              {property.image ? (
                <img
                  src={property.image}
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className={`fas fa-${getPropertyIcon(property.type)} text-4xl text-gray-600`}></i>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-white">{property.title}</h3>
                  <p className="text-gray-400 text-sm">{property.address}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(property.status)} text-white`}>
                  {property.status}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-400 mb-3">
                <div className="flex items-center mr-4">
                  <i className="fas fa-ruler-combined mr-2"></i>
                  <span>{property.surface} m²</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-door-open mr-2"></i>
                  <span>{property.rooms} pièces</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-xl font-semibold text-purple-400">{property.price}</div>
                <div className="text-green-400 text-sm">
                  <i className="fas fa-coins mr-2"></i>
                  {property.rentAmount}/mois
                </div>
              </div>

              {lastTransaction && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg">
                  <h4 className="text-sm text-gray-400 mb-2">Dernière transaction</h4>
                  <div className="flex justify-between items-center">
                    <span className={lastTransaction.type === 'revenu' ? 'text-green-400' : 'text-red-400'}>
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
        );
      })}
    </div>
  );
}

function getPropertyIcon(type) {
  switch(type.toLowerCase()) {
    case 'maison': return 'home';
    case 'appartement': return 'building';
    case 'commerce': return 'store';
    case 'garage': return 'warehouse';
    default: return 'building';
  }
}

function getStatusColor(status) {
  switch(status.toLowerCase()) {
    case 'loué': return 'bg-green-500';
    case 'disponible': return 'bg-blue-500';
    case 'en travaux': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
}
