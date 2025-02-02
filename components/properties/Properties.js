function Properties() {
  const [properties, setProperties] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      // Simuler le chargement des données
      setProperties([
        {
          id: 1,
          title: "Appartement Paris 11",
          address: "25 rue de la République, 75011 Paris",
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
          address: "12 avenue des Pins, 33000 Bordeaux",
          price: "320000",
          rentAmount: "1200",
          surface: 90,
          rooms: 4,
          type: "maison",
          status: "disponible"
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
        }
      ]);

      setLoading(false);
    } catch (error) {
      reportError(error);
      setLoading(false);
    }
  }, []);

  const handleAddProperty = (propertyData) => {
    try {
      const newProperty = {
        id: Date.now(),
        ...propertyData
      };
      setProperties([...properties, newProperty]);
      setShowForm(false);
    } catch (error) {
      reportError(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div data-name="properties-page" className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Biens Immobiliers</h1>
        <Button 
          onClick={() => setShowForm(true)}
          variant="primary"
          icon="plus"
        >
          Ajouter un bien
        </Button>
      </div>

      <PropertyList 
        properties={properties} 
        onSelect={setSelectedProperty}
        transactions={transactions}
      />

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <PropertyForm 
            onSubmit={handleAddProperty}
            onClose={() => setShowForm(false)}
          />
        </Modal>
      )}

      {selectedProperty && (
        <Modal onClose={() => setSelectedProperty(null)}>
          <PropertyDetail 
            property={selectedProperty}
            transactions={transactions.filter(t => t.propertyId === selectedProperty.id)}
            onClose={() => setSelectedProperty(null)}
          />
        </Modal>
      )}
    </div>
  );
}
