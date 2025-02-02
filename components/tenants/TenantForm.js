function TenantForm({ onSubmit, initialData, properties }) {
  const [formData, setFormData] = React.useState(initialData || {
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    rentAmount: '',
    leaseStart: '',
    leaseEnd: '',
    deposit: '',
    paymentMethod: 'virement',
    guarantor: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const paymentMethods = [
    { value: 'virement', label: 'Virement bancaire' },
    { value: 'prelevement', label: 'Prélèvement automatique' },
    { value: 'cheque', label: 'Chèque' },
    { value: 'especes', label: 'Espèces' }
  ];

  const handlePropertyChange = (propertyId) => {
    const selectedProperty = properties.find(p => p.id === parseInt(propertyId));
    if (selectedProperty) {
      setFormData(prev => ({
        ...prev,
        propertyId,
        rentAmount: selectedProperty.rentAmount
      }));
    }
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
    <form data-name="tenant-form" onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Modifier le locataire' : 'Nouveau locataire'}
      </h2>

      <Input
        label="Nom complet"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
          required
        />

        <Input
          label="Téléphone"
          value={formData.phone}
          onChange={e => setFormData({...formData, phone: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
              {property.title} ({property.address})
            </option>
          ))}
        </Input>

        <Input
          label="Montant du loyer"
          type="number"
          value={formData.rentAmount}
          onChange={e => setFormData({...formData, rentAmount: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Début du bail"
          type="date"
          value={formData.leaseStart}
          onChange={e => setFormData({...formData, leaseStart: e.target.value})}
          required
        />

        <Input
          label="Fin du bail"
          type="date"
          value={formData.leaseEnd}
          onChange={e => setFormData({...formData, leaseEnd: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Dépôt de garantie"
          type="number"
          value={formData.deposit}
          onChange={e => setFormData({...formData, deposit: e.target.value})}
          required
        />

        <Input
          label="Mode de paiement"
          type="select"
          value={formData.paymentMethod}
          onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
          required
        >
          {paymentMethods.map(method => (
            <option key={method.value} value={method.value}>
              {method.label}
            </option>
          ))}
        </Input>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Garant</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Nom du garant"
            value={formData.guarantor.name}
            onChange={e => setFormData({
              ...formData,
              guarantor: { ...formData.guarantor, name: e.target.value }
            })}
          />
          <Input
            label="Email du garant"
            type="email"
            value={formData.guarantor.email}
            onChange={e => setFormData({
              ...formData,
              guarantor: { ...formData.guarantor, email: e.target.value }
            })}
          />
          <Input
            label="Téléphone du garant"
            value={formData.guarantor.phone}
            onChange={e => setFormData({
              ...formData,
              guarantor: { ...formData.guarantor, phone: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => onClose()}>
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
