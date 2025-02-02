function Tenants() {
  const [tenants, setTenants] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedTenant, setSelectedTenant] = React.useState(null);

  React.useEffect(() => {
    try {
      // Simuler le chargement des données
      setTenants([
        {
          id: 1,
          name: "Marie Dubois",
          email: "marie.dubois@email.com",
          phone: "06 12 34 56 78",
          property: "Appartement Paris 11",
          rentAmount: "1 500 €",
          leaseStart: "2023-01-01",
          leaseEnd: "2024-01-01"
        },
        // ... autres locataires
      ]);
    } catch (error) {
      reportError(error);
    }
  }, []);

  return (
    <div data-name="tenants-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Locataires</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          <i className="fas fa-user-plus mr-2"></i>
          Ajouter un locataire
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <TenantList 
          tenants={tenants} 
          onSelect={setSelectedTenant}
        />
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <TenantForm 
            onSubmit={(data) => {
              setTenants([...tenants, { id: Date.now(), ...data }]);
              setShowForm(false);
            }}
          />
        </Modal>
      )}

      {selectedTenant && (
        <Modal onClose={() => setSelectedTenant(null)}>
          <TenantDetail 
            tenant={selectedTenant}
            onUpdate={(updatedData) => {
              setTenants(tenants.map(t => 
                t.id === selectedTenant.id ? { ...t, ...updatedData } : t
              ));
              setSelectedTenant(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
