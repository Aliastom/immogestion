function DocumentViewer({ document }) {
  const [activeTab, setActiveTab] = React.useState('preview');

  return (
    <div data-name="document-viewer" className="h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{document.name}</h2>
        <div className="space-x-2">
          <Button
            variant="secondary"
            icon="download"
            onClick={() => window.open(document.url, '_blank')}
          >
            Télécharger
          </Button>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'preview'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Aperçu
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'info'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('info')}
        >
          Informations
        </button>
      </div>

      <div className="bg-gray-700 rounded-lg h-[calc(100%-100px)]">
        {activeTab === 'preview' ? (
          document.type === 'pdf' ? (
            <iframe
              src={`${document.url}#view=FitH`}
              className="w-full h-full rounded-lg"
              title={document.name}
            />
          ) : (
            <img
              src={document.url}
              alt={document.name}
              className="w-full h-full object-contain rounded-lg"
            />
          )
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Type</h3>
                <p className="font-medium">{document.type}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Taille</h3>
                <p className="font-medium">{formatFileSize(document.size)}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Créé le</h3>
                <p className="font-medium">{formatDate(document.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Dernière modification</h3>
                <p className="font-medium">{formatDate(document.updatedAt)}</p>
              </div>
            </div>

            {document.extractedData && (
              <div>
                <h3 className="text-sm text-gray-400 mb-2">Données extraites</h3>
                <div className="bg-gray-800 rounded-lg p-4">
                  {Object.entries(document.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                      <span className="text-gray-400">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
