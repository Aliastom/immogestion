function Finances() {
  const [transactions, setTransactions] = React.useState([]);
  const [selectedPeriod, setSelectedPeriod] = React.useState('month');
  const [showTransactionForm, setShowTransactionForm] = React.useState(false);
  const [assets, setAssets] = React.useState({
    immobilier: {
      value: 182375,
      percentage: 70,
      details: [
        { name: "Appartement Paris 11", value: 120000 },
        { name: "Maison Bordeaux", value: 62375 }
      ]
    },
    livrets: {
      value: 51264,
      percentage: 20,
      details: [
        { name: "Livret A", value: 31264 },
        { name: "LEP", value: 20000 }
      ]
    },
    comptesBancaires: {
      value: 41026,
      percentage: 16,
      details: [
        { name: "Compte courant", value: 41026 }
      ]
    },
    actionsFonds: {
      value: 5725,
      percentage: 2,
      details: [
        { name: "PEA", value: 5725 }
      ]
    }
  });
  const [liabilities, setLiabilities] = React.useState({
    emprunts: {
      value: 39197,
      percentage: 100,
      details: [
        { name: "Prêt immobilier", value: 39197 }
      ]
    }
  });

  React.useEffect(() => {
    try {
      // Charger les transactions initiales
      setTransactions([
        {
          id: 1,
          date: "2024-01-15",
          type: "revenu",
          category: "loyer",
          amount: 1500,
          propertyId: 1,
          description: "Loyer Janvier 2024"
        },
        {
          id: 2,
          date: "2024-01-10",
          type: "depense",
          category: "charges",
          amount: 200,
          propertyId: 1,
          description: "Charges copropriété"
        }
      ]);
    } catch (error) {
      reportError(error);
    }
  }, []);

  const handleAddTransaction = (newTransaction) => {
    try {
      const transaction = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...newTransaction
      };
      setTransactions(prev => [...prev, transaction]);
      setShowTransactionForm(false);
    } catch (error) {
      reportError(error);
    }
  };

  const totalAssets = Object.values(assets).reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = Object.values(liabilities).reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div data-name="finances-page" className="p-6 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Finances</h1>
          <Button 
            variant="primary"
            icon="plus"
            onClick={() => setShowTransactionForm(true)}
          >
            Nouvelle transaction
          </Button>
        </div>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {/* Graphique d'évolution du patrimoine */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Patrimoine total</h2>
          <div className="text-2xl font-bold text-purple-500">{formatCurrency(netWorth)}</div>
        </div>
        <div className="h-48 bg-gray-700 rounded-lg"></div>
      </div>

      {/* Actifs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Actifs</h2>
          <div className="text-xl font-semibold text-green-500">{formatCurrency(totalAssets)}</div>
        </div>
        <div className="space-y-6">
          {Object.entries(assets).map(([key, asset]) => (
            <div key={key} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <i className={`fas fa-${getAssetIcon(key)} mr-3 text-${getAssetColor(key)}-500`}></i>
                  <span className="font-medium">{getAssetLabel(key)}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(asset.value)}</div>
                  <div className="text-sm text-gray-400">{asset.percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className={`bg-${getAssetColor(key)}-500 h-2 rounded-full`}
                  style={{ width: `${asset.percentage}%` }}
                ></div>
              </div>
              <div className="mt-3 space-y-2">
                {asset.details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-400">{detail.name}</span>
                    <span>{formatCurrency(detail.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Passifs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Passifs</h2>
          <div className="text-xl font-semibold text-red-500">{formatCurrency(totalLiabilities)}</div>
        </div>
        <div className="space-y-6">
          {Object.entries(liabilities).map(([key, liability]) => (
            <div key={key} className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <i className="fas fa-hand-holding-usd mr-3 text-red-500"></i>
                  <span className="font-medium">{getLiabilityLabel(key)}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(liability.value)}</div>
                  <div className="text-sm text-gray-400">{liability.percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${liability.percentage}%` }}
                ></div>
              </div>
              <div className="mt-3 space-y-2">
                {liability.details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-400">{detail.name}</span>
                    <span>{formatCurrency(detail.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions récentes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions récentes</h2>
        <TransactionList transactions={transactions} />
      </div>

      {/* Modal de formulaire de transaction */}
      {showTransactionForm && (
        <Modal onClose={() => setShowTransactionForm(false)}>
          <TransactionForm 
            onSubmit={handleAddTransaction}
            onClose={() => setShowTransactionForm(false)}
            properties={Object.entries(assets.immobilier.details).map(([_, detail]) => ({
              id: Date.now(),
              title: detail.name,
              value: detail.value
            }))}
          />
        </Modal>
      )}
    </div>
  );
}

function getAssetIcon(type) {
  switch(type) {
    case 'immobilier': return 'home';
    case 'livrets': return 'piggy-bank';
    case 'comptesBancaires': return 'wallet';
    case 'actionsFonds': return 'chart-line';
    default: return 'circle';
  }
}

function getAssetColor(type) {
  switch(type) {
    case 'immobilier': return 'purple';
    case 'livrets': return 'green';
    case 'comptesBancaires': return 'blue';
    case 'actionsFonds': return 'yellow';
    default: return 'gray';
  }
}

function getAssetLabel(type) {
  switch(type) {
    case 'immobilier': return 'Immobilier';
    case 'livrets': return 'Livrets';
    case 'comptesBancaires': return 'Comptes bancaires';
    case 'actionsFonds': return 'Actions & fonds';
    default: return type;
  }
}

function getLiabilityLabel(type) {
  switch(type) {
    case 'emprunts': return 'Emprunts';
    default: return type;
  }
}
