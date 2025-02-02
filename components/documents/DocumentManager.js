function DocumentManager() {
  const [documents, setDocuments] = React.useState([]);
  const [selectedDocument, setSelectedDocument] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [scanning, setScanning] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const categories = [
    { id: 'all', label: 'Tous les documents', icon: 'folder' },
    { id: 'contract', label: 'Contrats', icon: 'file-contract' },
    { id: 'invoice', label: 'Factures', icon: 'file-invoice' },
    { id: 'tax', label: 'Documents fiscaux', icon: 'file-invoice-dollar' },
    { id: 'insurance', label: 'Assurances', icon: 'file-shield' },
    { id: 'other', label: 'Autres', icon: 'file' }
  ];

  React.useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // Données mockées avec catégories
      const mockDocuments = [
        {
          id: 1,
          name: "Bail - Appartement Paris.pdf",
          type: "contract",
          category: "contract",
          size: 2500000,
          createdAt: "2024-01-15T10:30:00",
          updatedAt: "2024-01-15T10:30:00",
          url: "#",
          propertyId: 1,
          extractedData: {
            "Montant du loyer": "1500 €",
            "Date de début": "01/01/2024",
            "Locataire": "Marie Dubois"
          }
        },
        {
          id: 2,
          name: "Facture Travaux.pdf",
          type: "invoice",
          category: "invoice",
          size: 1500000,
          createdAt: "2024-01-10T14:20:00",
          updatedAt: "2024-01-10T14:20:00",
          url: "#",
          propertyId: 1,
          extractedData: {
            "Montant": "2500 €",
            "Date": "10/01/2024",
            "Prestataire": "Entreprise XYZ"
          }
        },
        {
          id: 3,
          name: "Taxe foncière 2023.pdf",
          type: "tax",
          category: "tax",
          size: 1800000,
          createdAt: "2023-12-20T09:15:00",
          updatedAt: "2023-12-20T09:15:00",
          url: "#",
          propertyId: 1,
          extractedData: {
            "Montant": "1200 €",
            "Année": "2023",
            "Référence": "TF-2023-12345"
          }
        },
        {
          id: 4,
          name: "Assurance Habitation.pdf",
          type: "insurance",
          category: "insurance",
          size: 1200000,
          createdAt: "2024-01-05T11:20:00",
          updatedAt: "2024-01-05T11:20:00",
          url: "#",
          propertyId: 1,
          extractedData: {
            "Montant": "450 €",
            "Période": "2024",
            "Assureur": "AXA"
          }
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockDocuments);
    } catch (error) {
      reportError(error);
      setError("Erreur lors du chargement des documents");
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  return (
    <div data-name="document-manager" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Button
          variant="primary"
          icon="plus"
          onClick={() => setShowUploadModal(true)}
        >
          Ajouter un document
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <i className={`fas fa-${category.icon} mr-2`}></i>
            {category.label}
            <span className="ml-2 bg-gray-800 px-2 py-1 rounded-full text-xs">
              {category.id === 'all' 
                ? documents.length 
                : documents.filter(doc => doc.category === category.id).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(document => (
            <div
              key={document.id}
              className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700"
              onClick={() => setSelectedDocument(document)}
            >
              <div className="flex items-center mb-4">
                <i className={`fas fa-${getDocumentIcon(document.category)} text-2xl text-${getDocumentColor(document.category)}-500 mr-3`}></i>
                <div>
                  <h3 className="font-medium">{document.name}</h3>
                  <p className="text-sm text-gray-400">{formatDate(document.createdAt)}</p>
                </div>
              </div>

              {document.extractedData && (
                <div className="bg-gray-700 rounded p-2 text-sm">
                  <p className="text-gray-400">Données extraites :</p>
                  <ul className="mt-1">
                    {Object.entries(document.extractedData).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span className="font-medium">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <span className="text-sm text-gray-400">{formatFileSize(document.size)}</span>
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="download"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Téléchargement simulé');
                    }}
                  >
                    Télécharger
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <Modal onClose={() => setShowUploadModal(false)}>
          <DocumentUpload
            onUpload={handleFileUpload}
            progress={uploadProgress}
            scanning={scanning}
            categories={categories.filter(c => c.id !== 'all')}
          />
        </Modal>
      )}

      {selectedDocument && (
        <Modal onClose={() => setSelectedDocument(null)}>
          <DocumentViewer document={selectedDocument} />
        </Modal>
      )}
    </div>
  );
}

function getDocumentIcon(category) {
  switch (category) {
    case 'invoice': return 'file-invoice';
    case 'contract': return 'file-contract';
    case 'tax': return 'file-invoice-dollar';
    case 'insurance': return 'file-shield';
    default: return 'file';
  }
}

function getDocumentColor(category) {
  switch (category) {
    case 'invoice': return 'blue';
    case 'contract': return 'purple';
    case 'tax': return 'green';
    case 'insurance': return 'yellow';
    default: return 'gray';
  }
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
