function Dashboard() {
  const [properties, setProperties] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [assets, setAssets] = React.useState({
    immobilier: 850000,
    livrets: 25000,
    comptesBancaires: 15000,
    actionsFonds: 50000,
    emprunts: -450000
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      // Simuler le chargement des données
      setProperties([
        {
          id: 1,
          title: "Appartement Paris 11",
          address: "25 rue de la République",
          price: "450000",
          rentAmount: "1500",
          surface: 65,
          rooms: 3,
          type: "appartement",
          status: "loué",
          tenant: "Marie Dubois"
        },
        {
          id: 2,
          title: "Maison Bordeaux",
          address: "12 avenue des Pins",
          price: "320000",
          rentAmount: "1200",
          surface: 90,
          rooms: 4,
          type: "maison",
          status: "disponible"
        }
      ]);

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

  const totalAssets = Object.values(assets).reduce((sum, value) => sum + (value > 0 ? value : 0), 0);
  const totalLiabilities = Math.abs(Object.values(assets).reduce((sum, value) => sum + (value < 0 ? value : 0), 0));
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div data-name="dashboard" className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patrimoine net"
          value={formatCurrency(netWorth)}
          icon="wallet"
          trend="+5.2%"
          color="purple"
        />
        <StatCard
          title="Actifs"
          value={formatCurrency(totalAssets)}
          icon="arrow-up"
          trend="+3.8%"
          color="green"
        />
        <StatCard
          title="Passifs"
          value={formatCurrency(totalLiabilities)}
          icon="arrow-down"
          trend="-2.1%"
          color="red"
        />
        <StatCard
          title="Revenus locatifs"
          value={formatCurrency(properties.reduce((sum, p) => sum + parseInt(p.rentAmount), 0))}
          icon="home"
          trend="+12%"
          color="blue"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Répartition du patrimoine</h2>
          <AssetDistributionChart assets={assets} />
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Évolution mensuelle</h2>
          <FinanceChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
