function TaxServiceIntegration() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [taxData, setTaxData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      // Simulation de connexion à l'API des impôts
      const response = await fetch(`${config.TAX_SERVICE_API}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: 'user123',
          password: 'password123'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
      }

      const data = await response.json();
      localStorage.setItem('taxServiceToken', data.token);
      setIsConnected(true);
      await fetchTaxData();
    } catch (error) {
      reportError(error);
      setError("Erreur lors de la connexion au service des impôts");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.TAX_SERVICE_API}/data`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('taxServiceToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
      }

      const data = await response.json();
      setTaxData(data);
    } catch (error) {
      reportError(error);
      setError("Erreur lors de la récupération des données fiscales");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-name="tax-service-integration" className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Service des impôts</h2>
        {!isConnected ? (
          <Button
            variant="primary"
            icon="link"
            onClick={handleConnect}
            loading={loading}
          >
            Connecter
          </Button>
        ) : (
          <Button
            variant="secondary"
            icon="sync"
            onClick={fetchTaxData}
            loading={loading}
          >
            Actualiser
          </Button>
        )}
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : isConnected && taxData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-2">Numéro fiscal</h3>
              <p className="font-medium">{taxData.taxNumber}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-2">Dernière déclaration</h3>
              <p className="font-medium">{formatDate(taxData.lastDeclaration)}</p>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm text-gray-400 mb-2">Revenus déclarés</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Montant</th>
                  <th className="pb-2">Année</th>
                </tr>
              </thead>
              <tbody>
                {taxData.revenues.map((revenue, index) => (
                  <tr key={index}>
                    <td className="py-2">{revenue.type}</td>
                    <td className="py-2">{formatCurrency(revenue.amount)}</td>
                    <td className="py-2">{revenue.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-building-columns text-4xl text-gray-600 mb-4"></i>
          <p className="text-gray-400">
            Connectez-vous pour synchroniser vos données fiscales
          </p>
        </div>
      )}
    </div>
  );
}
