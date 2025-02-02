function TaxSimulation() {
  const [currentSimulation, setCurrentSimulation] = React.useState(null);
  const [forecastSimulation, setForecastSimulation] = React.useState(null);
  const [properties, setProperties] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [personalInfo, setPersonalInfo] = React.useState(null);
  const [taxData, setTaxData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      // Charger les informations personnelles
      const savedInfo = localStorage.getItem('personalInfo');
      if (savedInfo) {
        setPersonalInfo(JSON.parse(savedInfo));
      }

      // Charger les données fiscales
      const savedTaxData = localStorage.getItem('taxData');
      if (savedTaxData) {
        setTaxData(JSON.parse(savedTaxData));
      }

      // Charger les propriétés
      setProperties([
        {
          id: 1,
          title: "Appartement Paris 11",
          rentAmount: 1500,
          charges: {
            deductible: {
              maintenance: 1200,
              insurance: 400,
              managementFees: 5,
              propertyTax: 1800
            }
          }
        },
        {
          id: 2,
          title: "Maison Bordeaux",
          rentAmount: 1200,
          charges: {
            deductible: {
              maintenance: 2000,
              insurance: 600,
              managementFees: 0,
              propertyTax: 2200
            }
          }
        }
      ]);

      // Charger les transactions
      setTransactions([
        {
          id: 1,
          propertyId: 1,
          date: "2024-01-15",
          type: "revenu",
          category: "loyer",
          amount: 1500
        },
        {
          id: 2,
          propertyId: 2,
          date: "2024-01-15",
          type: "revenu",
          category: "loyer",
          amount: 1200
        },
        {
          id: 3,
          propertyId: 1,
          date: "2024-01-15",
          type: "depense",
          category: "maintenance",
          amount: 300
        }
      ]);

      setLoading(false);
    } catch (error) {
      reportError(error);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!personalInfo) {
    return (
      <div className="p-6">
        <Alert
          type="warning"
          message="Veuillez d'abord renseigner vos informations personnelles dans les paramètres"
        />
      </div>
    );
  }

  // Afficher les données fiscales si disponibles
  const renderTaxData = () => {
    if (!taxData) return null;

    return (
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Données fiscales importées</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 mb-2">Numéro fiscal</p>
            <p className="text-lg font-medium">{taxData.taxNumber}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Dernière déclaration</p>
            <p className="text-lg font-medium">{formatDate(taxData.lastDeclaration)}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-medium mb-3">Revenus déclarés</h4>
          <div className="bg-gray-700 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Montant</th>
                  <th className="pb-3">Année</th>
                </tr>
              </thead>
              <tbody>
                {taxData.revenues.map((revenue, index) => (
                  <tr key={index} className="border-t border-gray-600">
                    <td className="py-2">{revenue.type}</td>
                    <td className="py-2">{formatCurrency(revenue.amount)}</td>
                    <td className="py-2">{revenue.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div data-name="tax-simulation" className="space-y-8 p-6">
      {renderTaxData()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation actuelle (basée sur les données réelles) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Simulation actuelle</h2>
            <div className="text-sm text-gray-400">
              Basé sur les revenus et charges réels
            </div>
          </div>
          <TaxCalculator 
            onSave={setCurrentSimulation}
            properties={properties}
            transactions={transactions}
            personalInfo={personalInfo}
            taxData={taxData}
            isCurrentYear={true}
          />
        </div>

        {/* Simulation prévisionnelle (basée sur l'année en cours) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Simulation prévisionnelle</h2>
            <div className="text-sm text-gray-400">
              Projection sur l'année {new Date().getFullYear()}
            </div>
          </div>
          <TaxCalculator 
            onSave={setForecastSimulation}
            properties={properties}
            transactions={[]} // Pas de transactions pour la simulation prévisionnelle
            personalInfo={personalInfo}
            taxData={taxData}
            isCurrentYear={false}
          />
        </div>
      </div>

      {currentSimulation && forecastSimulation && (
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-4">Comparaison actuel vs prévisionnel</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="pb-4">Critère</th>
                  <th className="pb-4">Actuel</th>
                  <th className="pb-4">Prévisionnel</th>
                  <th className="pb-4">Différence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">Revenu imposable</td>
                  <td className="py-2">{formatCurrency(currentSimulation.taxableIncome)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.taxableIncome)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.taxableIncome - currentSimulation.taxableIncome)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Revenus fonciers bruts</td>
                  <td className="py-2">{formatCurrency(currentSimulation.rentalIncome.gross)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.rentalIncome.gross)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.rentalIncome.gross - currentSimulation.rentalIncome.gross)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Charges déduites</td>
                  <td className="py-2">{formatCurrency(currentSimulation.rentalIncome.charges)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.rentalIncome.charges)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.rentalIncome.charges - currentSimulation.rentalIncome.charges)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Revenus fonciers nets</td>
                  <td className="py-2">{formatCurrency(currentSimulation.rentalIncome.net)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.rentalIncome.net)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.rentalIncome.net - currentSimulation.rentalIncome.net)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Impôt total</td>
                  <td className="py-2">{formatCurrency(currentSimulation.tax)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.tax)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.tax - currentSimulation.tax)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Taux moyen</td>
                  <td className="py-2">{currentSimulation.averageRate.toFixed(2)}%</td>
                  <td className="py-2">{forecastSimulation.averageRate.toFixed(2)}%</td>
                  <td className="py-2">
                    {(forecastSimulation.averageRate - currentSimulation.averageRate).toFixed(2)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Reste à payer</td>
                  <td className="py-2">{formatCurrency(currentSimulation.remainingTax)}</td>
                  <td className="py-2">{formatCurrency(forecastSimulation.remainingTax)}</td>
                  <td className="py-2">
                    {formatCurrency(forecastSimulation.remainingTax - currentSimulation.remainingTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
