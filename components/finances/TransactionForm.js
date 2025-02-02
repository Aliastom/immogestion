function TransactionForm({ onSubmit, onClose, properties }) {
  const [formData, setFormData] = React.useState({
    type: 'revenu',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountingMonth: new Date().toISOString().split('T')[0].substring(0, 7),
    description: '',
    propertyId: ''
  });

  const handlePropertyChange = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    setFormData(prev => ({
      ...prev,
      propertyId,
      amount: prev.category === 'loyer' ? property?.rentAmount || prev.amount : prev.amount
    }));
  };

  const handleCategoryChange = (category) => {
    const property = properties.find(p => p.id === formData.propertyId);
    setFormData(prev => ({
      ...prev,
      category,
      amount: category === 'loyer' && property ? property.rentAmount : prev.amount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(formData);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <form data-name="transaction-form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Nouvelle transaction</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Type"
          type="select"
          value={formData.type}
          onChange={e => setFormData({...formData, type: e.target.value})}
          required
        >
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
        </Input>

        <Input
          label="Bien immobilier"
          type="select"
          value={formData.propertyId}
          onChange={e => handlePropertyChange(e.target.value)}
          required
        >
          <option value="">Sélectionner un bien</option>
          {properties.map(property => (
            <option key={property.id} value={property.id}>
              {property.title}
            </option>
          ))}
        </Input>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Catégorie"
          type="select"
          value={formData.category}
          onChange={e => handleCategoryChange(e.target.value)}
          required
        >
          <option value="">Sélectionner une catégorie</option>
          <option value="loyer">Loyer</option>
          <option value="charges">Charges récupérables</option>
          <option value="travaux">Travaux</option>
          <option value="taxe">Taxe foncière</option>
          <option value="assurance">Assurance</option>
          <option value="autre">Autre</option>
        </Input>

        <Input
          label="Montant"
          type="number"
          value={formData.amount}
          onChange={e => setFormData({...formData, amount: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          required
        />

        <Input
          label="Mois comptable"
          type="month"
          value={formData.accountingMonth}
          onChange={e => setFormData({...formData, accountingMonth: e.target.value})}
          required
        />
      </div>

      <Input
        label="Description"
        value={formData.description}
        onChange={e => setFormData({...formData, description: e.target.value})}
      />

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          Ajouter
        </Button>
      </div>
    </form>
  );
}
