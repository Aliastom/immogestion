function RealEstateValuation() {
  const [properties, setProperties] = React.useState([]);
  const [valuations, setValuations] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Données mockées des propriétés
      const mockProperties = [
        {
          id: 1,
          title: "Appartement Paris 11",
          address: "25 rue de la République, 75011 Paris",
          price: 450000,
          surface: 65
        },
        {
          id: 2,
          title: "Maison Bordeaux",
          address: "12 avenue des Pins, 33000 Bordeaux",
          price: 320000,
          surface: 90
        },
        {
          id: 3,
          title: "Studio Lyon",
          address: "5 rue Garibaldi, 69003 Lyon",
          price: 180000,
          surface: 30
        }
      ];

      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProperties(mockProperties);

      // Simulation des estimations
      const mockValuations = {
        1: {
          estimated_price: 480000,
          price_per_sqm: 7384,
          trend: 6.7
        },
        2: {
          estimated_price: 335000,
          price_per_sqm: 3722,
          trend: 4.7
        },
        3: {
          estimated_price: 195000,
          price_per_sqm: 6500,
          trend: 8.3
        }
      };

      setValuations(mockValuations);
    } catch (error) {
      reportError(error);
      setError("Erreur lors du chargement des estimations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-name="real-estate-valuation" className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Estimation des biens</h2>
        <Button
          variant="secondary"
          icon="sync"
          onClick={loadProperties}
          loading={loading}
        >
          Actualiser
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map(property => {
            const valuation = valuations[property.id];
            const trend = valuation?.trend || 0;
            const trendColor = trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-400';

            return (
              <div key={property.id} className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">{property.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{property.address}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Prix d'achat</p>
                    <p className="text-lg font-semibold">{formatCurrency(property.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Estimation actuelle</p>
                    <p className="text-lg font-semibold">
                      {valuation ? formatCurrency(valuation.estimated_price) : 'N/A'}
                    </p>
                  </div>
                </div>

                {valuation && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Évolution sur 1 an</span>
                      <span className={`flex items-center ${trendColor}`}>
                        <i className={`fas fa-${trend > 0 ? 'arrow-up' : 'arrow-down'} mr-1`}></i>
                        {Math.abs(trend)}%
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Prix au m² : {formatCurrency(valuation.price_per_sqm)}/m²
                    </div>
                    <div className="mt-4 bg-gray-800 rounded p-3">
                      <div className="text-sm text-gray-400 mb-2">Analyse du marché</div>
                      <div className="text-sm">
                        {trend > 5 
                          ? "Marché très dynamique, forte demande dans ce secteur."
                          : trend > 0
                          ? "Marché stable avec une légère tendance à la hausse."
                          : "Marché en phase de stabilisation."}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {properties.length > 0 && (
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Synthèse du patrimoine</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Valeur totale d'acquisition</p>
              <p className="text-xl font-semibold">
                {formatCurrency(properties.reduce((sum, p) => sum + p.price, 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Valeur estimée actuelle</p>
              <p className="text-xl font-semibold">
                {formatCurrency(properties.reduce((sum, p) => sum + (valuations[p.id]?.estimated_price || p.price), 0))}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Plus-value latente</p>
              <p className="text-xl font-semibold text-green-500">
                {formatCurrency(
                  properties.reduce((sum, p) => sum + ((valuations[p.id]?.estimated_price || p.price) - p.price), 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Surface totale</p>
              <p className="text-xl font-semibold">
                {properties.reduce((sum, p) => sum + p.surface, 0)} m²
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
