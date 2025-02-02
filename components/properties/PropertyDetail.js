function PropertyDetail({ property, onUpdate, onClose }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [showDocuments, setShowDocuments] = React.useState(false);
  const [documents, setDocuments] = React.useState([
    { id: 1, name: 'Bail.pdf', type: 'contrat', date: '2024-01-15' },
    { id: 2, name: 'Etat des lieux.pdf', type: 'etat_lieux', date: '2024-01-15' },
    { id: 3, name: 'Assurance.pdf', type: 'assurance', date: '2024-01-15' }
  ]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDocuments = () => {
    setShowDocuments(true);
  };

  const handleUpdateProperty = (updatedData) => {
    try {
      onUpdate({ ...property, ...updatedData });
      setIsEditing(false);
    } catch (error) {
      reportError(error);
    }
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <PropertyForm
        initialData={property}
        onSubmit={handleUpdateProperty}
        onClose={handleCloseEdit}
      />
    );
  }

  if (showDocuments) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Documents</h3>
          <Button
            variant="secondary"
            icon="upload"
            onClick={() => {/* Gérer l'upload */}}
          >
            Ajouter un document
          </Button>
        </div>

        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-file-pdf text-red-400 text-2xl mr-4"></i>
                <div>
                  <h4 className="font-medium">{doc.name}</h4>
                  <p className="text-sm text-gray-400">Ajouté le {formatDate(doc.date)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  icon="download"
                  size="sm"
                >
                  Télécharger
                </Button>
                <Button
                  variant="danger"
                  icon="trash"
                  size="sm"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => setShowDocuments(false)}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div data-name="property-detail" className="space-y-6">
      <div className="bg-gray-700 rounded-lg overflow-hidden">
        <div className="h-48 bg-gray-600"></div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{property.title}</h2>
          <p className="text-gray-400">{property.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Surface</h3>
          <p className="text-lg">{property.surface} m²</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Pièces</h3>
          <p className="text-lg">{property.rooms}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Prix</h3>
          <p className="text-lg">{property.price} €</p>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm text-gray-400 mb-1">Locataire actuel</h3>
        {property.tenant ? (
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gray-600 rounded-full mr-3"></div>
            <div>
              <p className="font-medium">{property.tenant}</p>
              <p className="text-sm text-gray-400">Loyer: {property.rentAmount} €/mois</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Aucun locataire</p>
        )}
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm text-gray-400 mb-4">Charges annuelles</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Charges déductibles</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Entretien</span>
                <span>{property.charges?.deductible?.maintenance} €</span>
              </li>
              <li className="flex justify-between">
                <span>Assurance</span>
                <span>{property.charges?.deductible?.insurance} €</span>
              </li>
              <li className="flex justify-between">
                <span>Frais de gestion</span>
                <span>{property.charges?.deductible?.managementFees} %</span>
              </li>
              <li className="flex justify-between">
                <span>Taxe foncière</span>
                <span>{property.charges?.deductible?.propertyTax} €</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Charges non déductibles</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Capital d'emprunt</span>
                <span>{property.charges?.nonDeductible?.loanCapital} €</span>
              </li>
              <li className="flex justify-between">
                <span>Travaux d'amélioration</span>
                <span>{property.charges?.nonDeductible?.improvements} €</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" icon="file-alt" onClick={handleDocuments}>
          Documents
        </Button>
        <Button variant="primary" icon="edit" onClick={handleEdit}>
          Modifier
        </Button>
      </div>
    </div>
  );
}
