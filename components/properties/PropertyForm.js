function PropertyForm({ onSubmit, onClose, initialData }) {
  const [formData, setFormData] = React.useState(initialData || {
    title: '',
    type: 'appartement',
    address: '',
    price: '',
    rentAmount: '',
    surface: '',
    rooms: '',
    status: 'disponible',
    charges: {
      deductible: {
        maintenance: 0,
        insurance: 0,
        managementFees: 0,
        propertyTax: 0
      },
      nonDeductible: {
        loanCapital: 0,
        improvements: 0
      }
    }
  });

  const propertyTypes = [
    { value: 'appartement', label: 'Appartement' },
    { value: 'maison', label: 'Maison' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'garage', label: 'Garage' }
  ];

  const statusTypes = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'loué', label: 'Loué' },
    { value: 'en travaux', label: 'En travaux' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(formData);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <form data-name="property-form" onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Modifier le bien' : 'Nouveau bien'}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Titre"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          required
        />

        <Input
          label="Type de bien"
          type="select"
          value={formData.type}
          onChange={e => setFormData({...formData, type: e.target.value})}
          required
        >
          {propertyTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Input>
      </div>

      <Input
        label="Adresse"
        value={formData.address}
        onChange={e => setFormData({...formData, address: e.target.value})}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prix"
          type="number"
          value={formData.price}
          onChange={e => setFormData({...formData, price: e.target.value})}
          required
        />

        <Input
          label="Loyer mensuel"
          type="number"
          value={formData.rentAmount}
          onChange={e => setFormData({...formData, rentAmount: e.target.value})}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Surface (m²)"
          type="number"
          value={formData.surface}
          onChange={e => setFormData({...formData, surface: e.target.value})}
          required
        />

        <Input
          label="Nombre de pièces"
          type="number"
          value={formData.rooms}
          onChange={e => setFormData({...formData, rooms: e.target.value})}
          required
        />

        <Input
          label="Statut"
          type="select"
          value={formData.status}
          onChange={e => setFormData({...formData, status: e.target.value})}
          required
        >
          {statusTypes.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Input>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Charges annuelles</h3>
        
        <div className="space-y-4">
          <h4 className="font-medium">Charges déductibles</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Entretien et réparations"
              type="number"
              value={formData.charges.deductible.maintenance}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  deductible: {
                    ...formData.charges.deductible,
                    maintenance: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
            <Input
              label="Assurance"
              type="number"
              value={formData.charges.deductible.insurance}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  deductible: {
                    ...formData.charges.deductible,
                    insurance: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
            <Input
              label="Frais de gestion (%)"
              type="number"
              value={formData.charges.deductible.managementFees}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  deductible: {
                    ...formData.charges.deductible,
                    managementFees: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
            <Input
              label="Taxe foncière"
              type="number"
              value={formData.charges.deductible.propertyTax}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  deductible: {
                    ...formData.charges.deductible,
                    propertyTax: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
          </div>

          <h4 className="font-medium mt-4">Charges non déductibles</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Capital d'emprunt"
              type="number"
              value={formData.charges.nonDeductible.loanCapital}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  nonDeductible: {
                    ...formData.charges.nonDeductible,
                    loanCapital: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
            <Input
              label="Travaux d'amélioration"
              type="number"
              value={formData.charges.nonDeductible.improvements}
              onChange={e => setFormData({
                ...formData,
                charges: {
                  ...formData.charges,
                  nonDeductible: {
                    ...formData.charges.nonDeductible,
                    improvements: parseFloat(e.target.value) || 0
                  }
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
